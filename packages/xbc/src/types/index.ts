import type { Options as XJSLibOptions } from '@tnotifier/xjs';
import type { LiveOptions } from '@tnotifier/hydra';
import type { live } from '@/instance';

export interface XJSOptions extends LiveOptions, XJSLibOptions {

}

export type XBCLive = typeof live;
