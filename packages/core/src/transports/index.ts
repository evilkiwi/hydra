import type { DefaultEvents, EventsMap } from 'nanoevents';
import { Transport } from '@/enums';
import type { Transport as Base } from './types';

import { local } from './local';

export let transport: Transport|string = Transport.Local;

export const transports: Record<Transport|string, Base> = {
    [Transport.Local]: local,
};

export const registerTransport = (id: string, obj: Base) => {
    if (transports[id] !== undefined) {
        return;
    }

    transports[id] = obj;
};

export const unregisterTransport = (id: string) => {
    if (!transports[id]) {
        return;
    }

    if (transport === id) {
        transport = Transport.Local;
    }

    delete transports[id];
};

export const setTransport = (id: string) => {
    if (!transports[id]) {
        throw new Error(`transport "${id}" is not registered`);
    }

    transport = id;
};

export const useTransport = <C = any, E extends EventsMap = DefaultEvents, P = unknown>() => {
    const obj = transports[transport] as Base<C, E, P>;
    const localTransport = (local as unknown) as Required<Base<C, E, P>>;

    if (!obj) {
        throw new Error(`transport "${transport}" is not registered`);
    }

    if (!obj.request) {
        obj.request = localTransport.request;
    }

    if (!obj.respond) {
        obj.respond = localTransport.respond;
    }

    if (!obj.connect && localTransport.connect) {
        obj.connect = localTransport.connect;
    }

    if (!obj.message) {
        obj.message = localTransport.message;
    }

    if (!obj.send) {
        obj.send = localTransport.send;
    }

    if (!obj.disconnect) {
        obj.disconnect = localTransport.disconnect;
    }

    return (obj as unknown) as Required<Base<C, E, P>>;
};

export * from './types';
