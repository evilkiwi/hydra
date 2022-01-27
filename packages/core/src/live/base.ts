import type { DefaultEvents, EventsMap } from 'nanoevents';
import { createNanoEvents } from 'nanoevents';
import type { IntegrationLiveCallback, IntegrationLiveInstance } from '@/integrations';
import { runMiddleware } from '@/middleware';
import { useTransport } from '@/transports';
import { logger } from '@/logger';
import { Hook } from '@/enums';
import type { LiveBase, LiveChild } from './types';

export const live = async <C = any, E extends EventsMap = DefaultEvents, P = unknown>(options: LiveBase<C, E, P>) => {
    // Handle the onMessage callback.
    let cb: IntegrationLiveCallback<any>|undefined;

    // Create the Event Emitter.
    const events = createNanoEvents<E>();

    // Create the Client.
    let instance!: C;

    const child: () => LiveChild = () => ({
        id: options.id,
        name: options.name,
        method: options.method,
        service: options.service,
        options: options.options,
    });

    const connect = async () => {
        const transport = useTransport<C, E, P>();

        // If an instance exists, disconnect.
        if (instance) {
            await disconnect();
        }

        logger.debug('opening live connection', child());

        // Run the pre-connect middleware.
        await runMiddleware(Hook.PreLiveConnect, {});

        // Run the live transport connect logic.
        await transport.connect({
            ...liveInstance,
            ...child(),
            transport: options,
        });

        // Run the post-connect middleware.
        await runMiddleware(Hook.PostLiveConnect, {});
    };

    const disconnect = async () => {
        const transport = useTransport<C, E, P>();

        logger.debug('disconnecting from live instance', child());

        // Run the pre-disconnect middleware.
        await runMiddleware(Hook.PreLiveDisconnect, {});

        // Run the live transport disconnect logic.
        await transport.disconnect({
            ...liveInstance,
            ...child(),
            transport: options,
        });

        // Run the post-disconnect middleware.
        await runMiddleware(Hook.PostLiveDisconnect, {});
    };

    const send = async (payload: P) => {
        const transport = useTransport<C, E, P>();

        logger.debug('sending live payload', child(), payload);

        // Run the pre-send middleware.
        await runMiddleware(Hook.PreLiveSend, {});

        // Run the live transport send logic.
        const response = await transport.send({
            ...liveInstance,
            ...child(),
            transport: options,
        }, payload);

        // Run the post-send middleware.
        await runMiddleware(Hook.PostLiveSend, {});

        return response;
    };

    const reconnect = async () => {
        await disconnect();
        await connect();
    };

    const onMessage = (callback: IntegrationLiveCallback<any>) => {
        cb = callback;
        return () => { cb = undefined };
    };

    const process = async (payload: unknown) => {
        const transport = useTransport<C, E, P>();

        logger.debug('processing message', payload);

        // Run the pre-message middleware.
        const preMessage = await runMiddleware(Hook.PreLiveMessage, { payload });
        payload = preMessage.payload;

        // Run the live transport message logic.
        await transport.message({
            ...liveInstance,
            transport: options,
        }, payload);

        // Run the post-message middleware.
        await runMiddleware(Hook.PostLiveMessage, {});
    };

    const liveInstance: IntegrationLiveInstance<C, E, P> = {
        ...child(),
        instance: (newInstance?: C) => {
            if (newInstance) {
                instance = newInstance;
            }

            return instance;
        },
        events,
        onMessage,
        reconnect,
        process,
        cb: () => cb,
        connect,
        send,
        disconnect,
    };

    return liveInstance;
};
