import { registerMiddleware, Hook, registerIntegration, fetch as rootFetch } from '@evilkiwi/hydra';
import * as instance from './instance';

// Create and export the helper functions.
export const fetch = rootFetch(instance.id);

// Register the Integration with Hydra.
registerIntegration(instance.id, instance);

// Register the Access Token Middleware.
registerMiddleware('_nightbot-auth', Hook.PreFetch, async (payload) => {
    if (payload.request.access_token) {
        payload.request.headers = {
            ...(payload.request.headers ?? {}),
            Authorization: `Bearer ${payload.request.access_token}`,
        };
    }

    return payload;
}, ({ service }) => service === instance.id);
