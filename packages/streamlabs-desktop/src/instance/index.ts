import type WebSocketClient from '@gamestdio/websocket'; // Fixes type inference
import { rand, singleton } from '@tnotifier/hydra';
import type { WSOptions } from '@/types';
import { sockjs } from '@/socket';

export const id = 'STREAMLABS_OBS';

export const live = {
    ws: async (options: WSOptions) => {
        const liveId = `${options.id ?? rand(1, 1000000)}`;

        return singleton({
            instance_id: liveId,
            service: id,
            method: 'ws',
        }, async () => {
            const instance = await sockjs({
                id: liveId,
                name: 'streamlabs-desktop/ws',
                method: 'ws',
                service: id,
                options,
                url: '127.0.0.1',
                port: 59650,
            });

            await instance.connect();

            return instance;
        });
    },
};
