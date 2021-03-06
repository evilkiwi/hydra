import type WebSocketClient from '@gamestdio/websocket'; // Fixes type inference
import { jsonRpc, singleton, rand } from '@evilkiwi/hydra';
import type { WSOptions } from '@/types';

export const id = 'ELGATO_CONTROL_CENTER';

export const live = {
    ws: async (options: WSOptions) => {
        const liveId = `${options.id ?? rand(1, 1000000)}`;

        return singleton({
            instance_id: liveId,
            service: id,
            method: 'ws',
        }, async () => {
            const instance = await jsonRpc({
                id: liveId,
                name: 'elgato/ws',
                method: 'ws',
                service: id,
                options,
                url: 'localhost',
                port: [1804, 1805, 1806, 1807, 1808, 1809, 1810, 1811, 1812, 1813],
                secure: false,
            });

            await instance.connect();

            return instance;
        });
    },
};
