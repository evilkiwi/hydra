import type { Transport } from '@/transports';

export const local: Transport = {
    request: async ({ id, service, request, fetch }) => {
        const response = await fetch({ id, service, request });

        if (response instanceof Error) {
            throw response;
        }

        return response;
    },
    respond: async ({ response }) => response,
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
