import type { DefaultEvents, EventsMap } from 'nanoevents';
import type { IntegrationLiveInstance } from '@/integrations';
import { integrations } from '@/integrations';
import type { BuildIdOptions, HoldRegistry, InstanceRegistry, SingletonCallback } from './types';

export const instances: InstanceRegistry = {};
export const hold: HoldRegistry = {};

export const live = <Live extends object>(service: string) => () => {
    const integration = integrations[`${service}`];

    if (!integration || !integration.live) {
        throw new Error(`service "${service}" does not support live`);
    }

    return integration.live as Live;
};

export const singleton = async <C = any, E extends EventsMap = DefaultEvents, P = unknown>(options: BuildIdOptions, cb: SingletonCallback<C, E, P>) => {
    const id = buildId(options);

    if (hold[id] !== undefined) {
        return hold[id] as Promise<IntegrationLiveInstance<C, E, P>>;
    } else if (!instances[id]) {
        hold[id] = new Promise<IntegrationLiveInstance<C, E, P>>(async (resolve, reject) => {
            try {
                const instance = await cb();
                instances[id] = instance;
                delete hold[id];
                resolve(instance);
            } catch (e) {
                reject(e as Error);
            }
        });

        return hold[id] as Promise<IntegrationLiveInstance<C, E, P>>;
    }

    return instances[id] as IntegrationLiveInstance<C, E, P>;
};

export const buildId = (options: BuildIdOptions) => {
    return `${options.service}:${options.method}:${options.instance_id}`;
};

export { live as createLive } from './base';
export * from './types';
export * from './json-rpc';
export * from './ws';
