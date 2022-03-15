import { registerMiddleware, Hook, registerIntegration, live as rootLive, fetch as rootFetch } from '@tnotifier/hydra';
import type { StreamlabsLive } from './types';
import * as instance from './instance';

// Create and export the helper functions.
export const live = rootLive<StreamlabsLive>(instance.id);
export const fetch = rootFetch(instance.id);

// Register the Integration with Hydra.
registerIntegration(instance.id, instance);

// Register the Auth Middleware.
registerMiddleware('_streamlabs-auth', Hook.PreFetch, async (payload) => {
    if (payload.request.access_token) {
        payload.request.headers = {
            ...(payload.request.headers ?? {}),
            Authorization: `Bearer ${payload.request.access_token}`,
        };
    }

    return payload;
}, ({ service }) => service === instance.id);

export * from './types';
