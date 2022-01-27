import type { xjs, Event, Options } from '@tnotifier/xjs';
import type { LiveChild } from '@tnotifier/hydra';
import type { PromiseType } from 'utility-types';

export interface XBCOptions extends LiveChild<Options> {

}

export interface XBCPayload {
    event: Event;
    payload?: object;
}

export type Instance = PromiseType<ReturnType<typeof xjs>>;
