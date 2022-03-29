import type { IntegrationLiveInstance, JsonRpcPayload } from '@evilkiwi/hydra';
import type { EventsMap, DefaultEvents } from 'nanoevents';
import Client from 'sockjs-client/dist/sockjs.min.js';
import type WebSocket from '@gamestdio/websocket';
import { jsonRpc } from '@evilkiwi/hydra';
import type { WSOptions } from '@/types';
import type { SockJSOptions } from './types';

export const sockjs = async <E extends EventsMap = DefaultEvents>(options: SockJSOptions) => {
    const rpc = await jsonRpc<E>({
        ...options,
        connect: async ({ instance }) => {
            const { url, port, secure } = options;
            const client = new Client(`http${secure ? 's' : ''}://${url}${port ? `:${port}` : ''}/api`) as WebSocket;

            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    clear();
                    reject(new Error('timed out'));
                }, 5000);

                const clear = () => {
                    client.onopen = null;
                    clearTimeout(timeout);
                };

                client.onopen = () => {
                    clear();
                    resolve();
                };
                client.onerror = () => {
                    clear();
                    reject(new Error('could not connect'));
                };
            });

            instance(client);
        },
    });

    const rpcOverride: Partial<IntegrationLiveInstance<WebSocket, E, JsonRpcPayload>> = {
        connect: async () => {
            const { token } = rpc.options as WSOptions;

            await rpc.connect();

            const result = (await rpc.send({
                type: 'auth',
                data: {
                    resource: 'TcpServerService',
                    args: [token],
                },
            })) as boolean;

            if (!result) {
                throw new Error('authentication failed - please check the provided token');
            }
        },
    };

    return {
        ...rpc,
        ...rpcOverride,
        subscribe: async (topic: string) => {
            const split = topic.split('.');
            const service = split[0];
            const method = split[1];

            return rpc.send({
                type: method,
                data: { resource: service, args: [] },
            });
        },
    };
};

export * from './types';
