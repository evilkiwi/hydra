import type { xjs, Event, Options } from '@evilkiwi/xjs';
import type { LiveChild } from '@evilkiwi/hydra';
import type { PromiseType } from 'utility-types';

export interface XBCOptions extends LiveChild<Options> {

}

export interface XBCPayload {
    event: Event;
    payload?: object;
}

export type Instance = PromiseType<ReturnType<typeof xjs>>;
