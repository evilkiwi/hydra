import type { EventsMap, DefaultEvents } from 'nanoevents';
import WebSocket from '@gamestdio/websocket';
import { live } from '@/live/base';
import type { WebSocketOptions } from './types';

export const ws = async <E extends EventsMap = DefaultEvents, P = unknown>(options: WebSocketOptions) => {
    const create = (port?: number) => {
        let url = `ws${options.secure ? 's' : ''}://${options.url}`;

        if (port) {
            url = `${url}:${port}`;
        } else if (options.port && !Array.isArray(options.port)) {
            url = `${url}:${options.port}`;
        }

        return new WebSocket(url, [], {
            backoff: 'exponential',
            connect: false,
        });
    };

    return live<WebSocket, E, P>({
        id: options.id,
        name: options.name,
        method: options.method,
        service: options.service,
        options: options.options,
        async connect(context) {
            const { instance, process } = context;

            if (options.connect) {
                await options.connect(context);
            } else {
                instance(create());

                // Port checker.
                const check = (port?: number) => new Promise<void>((resolve, reject) => {
                    // If a port is specified, re-create the Instance.
                    if (port !== null) {
                        instance(create(port));
                        instance().reconnectEnabled = false;
                    }

                    const done = () => {
                        instance().onopen = null;
                        instance().onerror = null;
                    };

                    instance().onopen = () => {
                        done();
                        resolve();
                    };
                    instance().onerror = () => {
                        done();
                        reject(new Error('failed to connect'));
                    };

                    instance().open();
                });

                if (options.port === undefined) {
                    await check();
                } else if (typeof options.port === 'number') {
                    await check(options.port);
                } else {
                    let found = false;

                    await options.port.reduce(async (promise, port) => {
                        await promise;

                        if (!found) {
                            try {
                                await check(port);
                                found = true;
                                instance().reconnectEnabled = true;
                            } catch {
                                // Do nothing.
                            }
                        }
                    }, Promise.resolve());

                    if (!found) {
                        throw new Error('no ports specified');
                    }
                }
            }

            instance().onmessage = (e: MessageEvent) => {
                const data = JSON.parse(e.data);

                if (options.process) {
                    options.process(data);
                } else {
                    process(data);
                }
            };
        },
        async send({ instance }, payload) {
            let processedPayload: any = payload;

            if (Array.isArray(processedPayload) || typeof processedPayload === 'object') {
                processedPayload = JSON.stringify(processedPayload);
            }

            processedPayload = `${processedPayload}`;

            if (instance() && instance().readyState === WebSocket.OPEN) {
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
