import { registerIntegration, live as rootLive, fetch as rootFetch } from '@tnotifier/hydra';
import type WebSocketClient from '@gamestdio/websocket'; // Fixes type inference
import type { ElgatoLive } from './types';
import * as instance from './instance';

// Create and export the helper functions.
export const live = rootLive<ElgatoLive>(instance.id);
export const fetch = rootFetch(instance.id);

// Register the Integration with Hydra.
registerIntegration(instance.id, instance);

export * from './types';
