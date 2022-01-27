import { singleton } from '@tnotifier/hydra';
import axios from 'axios';
import type { WSOptions } from '@/types';
import { socketio } from '@/socket';

export const id = 'STREAMLABS';

export const http = axios.create({
    baseURL: 'https://streamlabs.com/api/v1.0',
});

export const live = {
    ws: async (options: WSOptions) => {
        return singleton({
            instance_id: options.id,
            service: id,
            method: 'ws',
        }, async () => {
            if (!options.token) {
                if (!options.access_token) {
                    throw new Error('please provide either an `access_token` or WebSocket `token`');
                }

                try {
                    const response = await http.get('socket/token', {
                        headers: { Authorization: `Bearer ${options.access_token}` },
                    });

                    if (!response.data.socket_token) {
                        throw new Error('malformed response');
                    }

                    options.token = response.data.socket_token;
                } catch (e) {
                    throw new Error(`failed to fetch WebSocket token: ${e}`);
                }
            }

            const instance = await socketio({
                id: options.id,
                name: 'streamlabs/ws',
                method: 'ws',
                service: id,
                options,
                url: `https://sockets.streamlabs.com?token=${options.token}`,
            });

            await instance.connect();

            return instance;
        });
    },
};
