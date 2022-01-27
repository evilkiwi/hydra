import type { live } from '@/instance';

export interface WSOptions {
    id: string;
    token: string;
}

export type StreamlabsLive = typeof live;
