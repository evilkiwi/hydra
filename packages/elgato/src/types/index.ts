import type { LiveOptions } from '@tnotifier/hydra';
import type { live } from '@/instance';

export interface WSOptions extends LiveOptions {

}

export type ElgatoLive = typeof live;
