import { registerIntegration, live as rootLive } from '@tnotifier/hydra';
import type { XBCLive } from './types';
import * as instance from './instance';

// Create and export the helper functions.
export const live = rootLive<XBCLive>(instance.id);

// Register the Integration with Hydra.
registerIntegration(instance.id, instance);

export * from './types';
