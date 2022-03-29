import type { obs, Options } from '@evilkiwi/obs';
import type { LiveChild } from '@evilkiwi/hydra';
import type { PromiseType } from 'utility-types';

export interface OBSOptions extends LiveChild<Options> {

}

export interface OBSPayload {
    type: string;
    payload?: object;
}

export type Instance = PromiseType<ReturnType<typeof obs>>;
