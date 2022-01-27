import type { EventsMap, DefaultEvents } from 'nanoevents';
import type WebSocket from '@gamestdio/websocket';
import { v4 as uuid } from 'uuid';
import type { IntegrationLiveInstance } from '@/integrations';
import type { PromiseRegistry } from '@/types';
import { ws } from '@/live/ws';
import type { JsonRpcOptions, JsonRpcPayload } from './types';

const promises: PromiseRegistry<unknown> = {};

export const jsonRpc = async <E extends EventsMap = DefaultEvents>(options: JsonRpcOptions) => {
    const instance = await ws<E, JsonRpcPayload>({
        ...options,
        process: (payload: any) => {
            // Check for the RPC ID.
            if (payload.id) {
                // Find the references.
                const promise = promises[payload.id];

                if (!promise) {
                    return;
                }

                // Kill the timeout.
                clearTimeout(promise.timeout as any);

                // Resolve the Promise.
                if (payload.error !== undefined && payload.error !== null) {
                    promise.reject(payload.error);
                } else {
                    promise.resolve(payload.result);
                }

                // And clean-up.
                delete promises[payload.id];
            }
        },
    });

    const rpc: Partial<IntegrationLiveInstance<WebSocket, E, JsonRpcPayload>> = {
        send: async ({ type, data }) => {
            return new Promise<unknown>((resolve, reject) => {
                // Create a unique ID for the RPC message.
                const id = uuid();

                // Store a reference to the timeout and resolve.
                promises[id] = {
                    resolve,
                    reject,
                    timeout: setTimeout(() => {
                        reject(new Error('rpc timed out'));
                        delete promises[id];
                    }, options.timeout ?? 15000),
                };

                // Send the raw RPC message.
                instance.send({
                    // @ts-ignore
                    id,
                    jsonrpc: '2.0',
                    method: type,
                    params: data,
                });
            });
        },
    };

    return {
        ...instance,
        ...rpc,
    };
};

export * from './types';
