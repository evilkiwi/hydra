import type { LiveOptions } from '@evilkiwi/hydra';
import type { live } from '@/instance';

export interface WSOptions extends LiveOptions {

}

export type ElgatoLive = typeof live;
