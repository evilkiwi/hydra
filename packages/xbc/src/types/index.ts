import type { Options as XJSLibOptions } from '@evilkiwi/xjs';
import type { LiveOptions } from '@evilkiwi/hydra';
import type { live } from '@/instance';

export interface XJSOptions extends LiveOptions, XJSLibOptions {

}

export type XBCLive = typeof live;
