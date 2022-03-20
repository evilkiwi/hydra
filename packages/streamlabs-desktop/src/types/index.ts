import type { LiveOptions } from '@tnotifier/hydra';
import type { live } from '@/instance';

export interface WSOptions extends LiveOptions {
    token: string;
}

export type StreamlabsLive = typeof live;
