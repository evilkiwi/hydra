import type { DefaultEvents, EventsMap } from 'nanoevents';
import type { IntegrationFetchPayload, IntegrationLiveInstance } from '@/integrations';
import type { FetchRequest } from '@/fetch';
import type { LiveBase } from '@/live';

export interface TransportPayload {
    id: string;
    meta: unknown;
}

export interface TransportRequestPayload extends TransportPayload {
    service: string;
    request: FetchRequest;
    fetch: <D = any>(payload: IntegrationFetchPayload<D>) => Promise<TransportRequestResponse|Error>;
}

export interface TransportResponsePayload extends TransportPayload {
    response: TransportRequestResponse|Error;
}

export interface TransportRequestResponse {
    statusCode: number;
    response: unknown;
}

export interface TransportLivePayload<C = any, E extends EventsMap = DefaultEvents, P = unknown> extends IntegrationLiveInstance<C, E, P> {
    id: string;
    name: string;
    service: string;
    options: any;
    meta: unknown;
    transport: LiveBase<C, E, P>;
}

export interface Transport<C = any, E extends EventsMap = DefaultEvents, P = unknown> {
    request?: (payload: TransportRequestPayload) => Promise<TransportRequestResponse>;
    respond?: (payload: TransportResponsePayload) => Promise<TransportRequestResponse|Error>;
    connect?: (instance: TransportLivePayload<C, E, P>) => Promise<void>;
    message?: (instance: TransportLivePayload<C, E, P>, payload: unknown) => Promise<void>;
    send?: (instance: TransportLivePayload<C, E, P>, payload: P) => Promise<void>;
    disconnect?: (instance: TransportLivePayload<C, E, P>) => Promise<void>;
}
