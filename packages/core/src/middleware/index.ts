import { Hook } from '@/enums';
import type { Middleware, MiddlewarePayload, MiddlewareFilter, MiddlewareRegistry, MiddlewareRegister } from './types';

export const middleware: MiddlewareRegistry = {};

export const hookRegistry: Record<Hook, string[]> = {
    [Hook.PreFetch]: [],
    [Hook.PostFetch]: [],
    [Hook.PreLiveConnect]: [],
    [Hook.PostLiveConnect]: [],
    [Hook.PreLiveSend]: [],
    [Hook.PostLiveSend]: [],
    [Hook.PreLiveMessage]: [],
    [Hook.PostLiveMessage]: [],
    [Hook.PreLiveDisconnect]: [],
    [Hook.PostLiveDisconnect]: [],
};

export const registerMiddleware = <H extends Hook, P = unknown>(id: string, hook: H, obj: Middleware<H, P>, filter?: MiddlewareFilter<H, P>) => {
    if (middleware[id] !== undefined) {
        return;
    }

    middleware[id] = { filter, obj };
    hookRegistry[hook].push(id);
};

export const unregisterMiddleware = (id: string) => {
    if (!middleware[id]) {
        return;
    }

    const hooks = Object.keys(hookRegistry) as Hook[];
    const total = hooks.length;

    for (let i = 0; i < total; i++) {
        const ids = hookRegistry[hooks[i]];
        const index = ids.indexOf(id);

        if (index !== -1) {
            hookRegistry[hooks[i]] = ids.splice(index, 1);
        }
    }

    delete middleware[id];
};

export const getMiddleware = <H extends Hook>(hook: H) => {
    // Find all Middleware IDs to apply.
    const ids = [...hookRegistry[hook]];
    const all: MiddlewareRegister<H>[] = [];

    // Return all Middleware references.
    const total = ids.length;

    for (let i = 0; i < total; i++) {
        all.push(middleware[ids[i]]);
    }

    return all;
};

export const runMiddleware = async <H extends Hook>(hook: H, payload: MiddlewarePayload[H]) => {
    const middleware = getMiddleware(hook);

    return middleware.reduce<Promise<MiddlewarePayload[H]>>(async (promise, m) => {
        const localPayload = await promise;

        if (!m.filter || m.filter(localPayload) === true) {
            return m.obj(localPayload);
        }

        return localPayload;
    }, Promise.resolve(payload));
};

export * from './types';
