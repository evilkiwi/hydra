import { registerIntegration, live as rootLive } from '@tnotifier/hydra';
import * as instance from './instance';
import type { OBSLive } from './types';

// Create and export the helper functions.
export const live = rootLive<OBSLive>(instance.id);

// Register the Integration with Hydra.
registerIntegration(instance.id, instance);

export * from './types';
