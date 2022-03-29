import type { IntegrationLiveInstance } from '@evilkiwi/hydra';
import type { EventsMap, DefaultEvents } from 'nanoevents';
import { createLive } from '@evilkiwi/hydra';
import { obs as ws } from '@evilkiwi/obs';
import type { Instance, OBSOptions, OBSPayload } from './types';

export const obs = async <E extends EventsMap = DefaultEvents>(options: OBSOptions) => {
    const instance = await createLive<Instance, E, OBSPayload>({
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

    const obsOverride: Partial<IntegrationLiveInstance<Instance, E, OBSPayload>> = {
        send: async ({ type, payload }) => instance.instance().request(type, payload),
    };

    return {
        ...instance,
        ...obsOverride,
    };
};

export * from './types';
