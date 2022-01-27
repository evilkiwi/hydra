import type { FetchRequest } from '@/fetch';
import type { Hook } from '@/enums';

export type MiddlewareFilter<H extends Hook, P = unknown> = (payload: MiddlewarePayload<P>[H]) => boolean;

export interface MiddlewareRegister<H extends Hook, P = unknown> {
    filter?: MiddlewareFilter<H, P>;
    obj: Middleware<H, P>;
}

export interface MiddlewareRegistry {
    [id: string]: MiddlewareRegister<any, any>;
}

export interface MiddlewarePayload<P = unknown> {
    [Hook.PreFetch]: {
        id: string;
        service: string;
        request: FetchRequest;
    };
    [Hook.PostFetch]: {
        id: string;
        service: string;
        request: FetchRequest;
        statusCode: number;
        response: unknown;
        rerun?: boolean;
    };
    [Hook.PreLiveConnect]: {};
    [Hook.PostLiveConnect]: {};
    [Hook.PreLiveSend]: {};
    [Hook.PostLiveSend]: {};
    [Hook.PreLiveMessage]: {
        payload: P;
    };
    [Hook.PostLiveMessage]: {};
    [Hook.PreLiveDisconnect]: {};
    [Hook.PostLiveDisconnect]: {};
}

export type Middleware<H extends Hook, P = unknown> = (payload: MiddlewarePayload<P>[H]) => Promise<MiddlewarePayload<P>[H]>;
