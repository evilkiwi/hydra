import type { Transport } from '@/transports';

export const local: Transport = {
    request: async ({ id, service, request, fetch }) => {
        return fetch({ id, service, request });
    },
    respond: async (payload) => {
        if (payload.response instanceof Error) {
            throw payload.response;
        }

        return payload.response.response;
    },
    connect: async (instance) => instance.transport.connect(instance),
    message: async ({ cb }, payload) => {
        const callback = cb();

        if (callback) {
            callback(payload);
        }
    },
    send: async (instance, payload) => instance.transport.send(instance, payload),
    disconnect: async (instance) => instance.transport.disconnect(instance),
};
