import type { Options } from '@tnotifier/obs';
import type { live } from '@/instance';

export interface WSOptions extends Options {
    id: string;
}

export type OBSLive = typeof live;
