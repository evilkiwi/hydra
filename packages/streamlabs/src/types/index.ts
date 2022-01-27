import type { live } from '@/instance';

export interface WSOptions {
    id: string;
    token?: string;
    access_token?: string;
}

export type StreamlabsLive = typeof live;
