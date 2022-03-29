import type { LiveOptions } from '@evilkiwi/hydra';
import type { live } from '@/instance';

export interface WSOptions extends LiveOptions {
    token?: string;
    access_token?: string;
}

export type StreamlabsLive = typeof live;
