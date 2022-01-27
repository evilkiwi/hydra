import type { Options } from '@tnotifier/xjs';
import type { live } from '@/instance';

export interface XJSOptions extends Options {
    id: string;
}

export type XBCLive = typeof live;
