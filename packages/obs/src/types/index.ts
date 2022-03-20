import type { Options as OBSLibOptions } from '@tnotifier/obs';
import type { LiveOptions } from '@tnotifier/hydra';
import type { live } from '@/instance';

export interface WSOptions extends LiveOptions, OBSLibOptions {

}

export type OBSLive = typeof live;
