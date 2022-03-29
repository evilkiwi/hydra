import type { IntegrationLiveInstance } from '@evilkiwi/hydra';
import type { EventsMap, DefaultEvents } from 'nanoevents';
import type { Subscription } from '@evilkiwi/xjs';
import { createLive } from '@evilkiwi/hydra';
import { xjs as ws } from '@evilkiwi/xjs';
import type { Instance, XBCOptions, XBCPayload } from './types';

export const xbc = async <E extends EventsMap = DefaultEvents>(options: XBCOptions) => {
    const instance = await createLive<Instance, E, XBCPayload>({
        id: options.id,
        name: options.name,
        method: options.method,
        service: options.service,
        options: options.options,
        async connect({ instance, events }) {
            instance(await ws({
                ...options.options,
                events,
            }));
        },
        async send() {},
        async disconnect({ instance }) {
            if (instance()) {
                instance().disconnect();
            }
        },
    });

    const obsOverride: Partial<IntegrationLiveInstance<Instance, E, XBCPayload>> = {
        send: async ({ event, payload }) => instance.instance().request({ event, payload }),
    };

    return {
        ...instance,
        ...obsOverride,
        subscribe: async (topic: Subscription) => instance.instance().subscribe(topic),
    };
};

export * from './types';
