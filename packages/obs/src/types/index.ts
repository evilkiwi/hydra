import type { Options as OBSLibOptions } from '@evilkiwi/obs';
import type { LiveOptions } from '@evilkiwi/hydra';
import type { live } from '@/instance';

export interface WSOptions extends LiveOptions, OBSLibOptions {

}

export type OBSLive = typeof live;
