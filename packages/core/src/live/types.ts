import type { EventsMap, DefaultEvents } from 'nanoevents';
import type { IntegrationLiveInstance } from '@/integrations';

export interface LiveChild<O = unknown> {
    id: string;
    name: string;
    method: string;
    service: string;
    options: O;
}

export interface LiveBase<C = any, E extends EventsMap = DefaultEvents, P = unknown> extends LiveChild {
    connect: (instance: IntegrationLiveInstance<C, E, P>) => Promise<void>;
    send: (instance: IntegrationLiveInstance<C, E, P>, payload: P) => Promise<void>;
    disconnect: (instance: IntegrationLiveInstance<C, E, P>) => Promise<void>;
}

export interface InstanceRegistry {
    [id: string]: IntegrationLiveInstance<any, any, any>;
}

export interface HoldRegistry {
    [id: string]: Promise<IntegrationLiveInstance<any, any, any>>;
}

export type SingletonCallback<C = any, E extends EventsMap = DefaultEvents, P = unknown> = () => Promise<IntegrationLiveInstance<C, E, P>>;

export interface BuildIdOptions {
    service: string;
    method: string;
    instance_id: string;
}
