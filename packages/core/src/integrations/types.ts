import type { Emitter, EventsMap, DefaultEvents } from 'nanoevents';
import type { AxiosInstance } from 'axios';
import type { TransportRequestResponse } from '@/transports';
import type { FetchRequest } from '@/fetch';
import type { LiveChild } from '@/live';

export interface IntegrationFetchPayload<D> {
    id: string;
    request: FetchRequest<D>;
    service: string;
}

export type IntegrationFetch = <D = unknown>(payload: IntegrationFetchPayload<D>) => Promise<TransportRequestResponse|Error>;

export type IntegrationLiveCallback<D = unknown> = (payload: D) => Promise<void>|void;

export interface IntegrationLiveInstance<C = any, E extends EventsMap = DefaultEvents, P = unknown> extends LiveChild {
    instance: (newInstance?: C) => C;
    events: Emitter<E>;
    cb: () => IntegrationLiveCallback<any>|undefined;
    connect: () => Promise<void>;
    reconnect: () => Promise<void>;
    process: (payload: unknown) => Promise<void>;
    onMessage: <D = unknown>(cb: IntegrationLiveCallback<D>) => () => void;
    send: (payload: P) => Promise<unknown>;
    disconnect: () => Promise<void>;
}

export type IntegrationLive<C = any, E extends EventsMap = DefaultEvents, O = any, P = any> = (options: O) => Promise<IntegrationLiveInstance<C, E, P>>;

export interface IntegrationLiveRegister<I extends IntegrationLive = IntegrationLive> {
    [name: string]: I;
}

export interface Integration {
    http?: AxiosInstance;
    live?: IntegrationLiveRegister;
}
