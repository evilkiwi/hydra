import type { EventsMap, DefaultEvents } from 'nanoevents';
import type { Socket } from 'socket.io-client';
import { createLive } from '@evilkiwi/hydra';
import io from 'socket.io-client';
import type { SocketIOOptions } from './types';

export const socketio = async <E extends EventsMap = DefaultEvents, P = unknown>(options: SocketIOOptions) => {
    return createLive<typeof Socket, E, P>({
        id: options.id,
        name: options.name,
        method: options.method,
        service: options.service,
        options: options.options,
        async connect({ instance, process }) {
            // Create the Socket.IO instance.
            const socket = io(options.url, {
                autoConnect: false,
                reconnection: true,
                transports: ['websocket'],
            });

            // Await for successful connection.
            await new Promise<void>((resolve, reject) => {
                socket.once('connect', () => {
                    socket.off('connect_error');
                    socket.off('connect_timeout');
                    resolve();
                });

                socket.once('connect_error', (e: Error) => reject(e));
                socket.once('connect_timeout', () => reject(new Error('timed out')));

                socket.connect();
            });

            /**
             * Do some hacky stuff to allow catching _all_ events sent from
             * the server. Not ideal but I mean, they're using Socket.IO v2 so...
             */

            // @ts-ignore
            const onevent = socket.onevent;
            // @ts-ignore
            socket.onevent = function (packet: any) {
                const args = packet.data || [];
                packet.data = ['*'].concat(args);
                onevent.call(this, packet);
            };

            socket.on('*', (event: string, data: unknown = null) => {
                process({ event, data });
            });

            instance(socket);
        },
        async send({ instance }, payload) {
            let processedPayload: any = payload;

            if (Array.isArray(processedPayload) || typeof processedPayload === 'object') {
                processedPayload = JSON.stringify(processedPayload);
            }

            processedPayload = `${processedPayload}`;

            if (instance()) {
                instance().send(processedPayload);
            }
        },
        async disconnect({ instance }) {
            if (instance()) {
                instance().close();
            }
        },
    });
};

export * from './types';
