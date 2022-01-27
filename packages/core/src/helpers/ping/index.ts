import type { IntegrationLiveInstance } from '@/integrations';
import type { PingOptions } from './types';

export const ping = (live: IntegrationLiveInstance, options: PingOptions = {}) => {
    const format = options.format ?? { type: 'PING' };
    let pong: number|NodeJS.Timeout|undefined;

    live.send(format);

    return () => {
        clearTimeout(pong as any);
        setTimeout(() => {
            pong = setTimeout(() => {
                clearTimeout(pong as any);
                pong = undefined;
                live.reconnect();
            }, options.reconnectTimeout ?? 10000);

            live.send(format);
        }, options.interval ?? 60000 * 2);
    };
};

export * from './types';
