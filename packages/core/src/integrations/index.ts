import type { Integration } from './types';

export const integrations: Record<string, Integration> = {};

export const registerIntegration = (id: string, obj: Integration) => {
    if (integrations[id]) {
        return;
    }

    integrations[id] = obj;
};

export * from './types';
