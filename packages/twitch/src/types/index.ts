import type { LiveOptions } from '@evilkiwi/hydra';
import type { EventsMap } from 'nanoevents';
import type { live } from '@/instance';

export interface PubSubOptions extends LiveOptions {
    ping?: boolean;
}

export interface TwitchPubSubMessage {
    type: 'LISTEN'|'UNLISTEN';
    nonce?: string;
    data: {
        topics: string[];
        auth_token?: string;
    };
}

export interface TwitchEvents extends EventsMap {
    event: (data: { topic: string; data: any }) => void;
    [topic: string]: (data: any) => void;
}

export type TwitchLive = typeof live;
