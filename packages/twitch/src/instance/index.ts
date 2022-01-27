import type WebSocketClient from '@gamestdio/websocket'; // Fixes type inference
import { singleton, ws, ping } from '@tnotifier/hydra';
import axios from 'axios';
import type { PubSubOptions, TwitchEvents } from '@/types';

export const id = 'TWITCH';

export const http = axios.create({
    baseURL: 'https://api.twitch.tv',
});

export const live = {
    pubsub: async (options: PubSubOptions) => {
        return singleton({
            instance_id: options.id,
            service: id,
            method: 'pubsub',
        }, async () => {
            const instance = await ws<TwitchEvents>({
                id: options.id,
                name: 'twitch/pub-sub',
                method: 'pubsub',
                service: id,
                options,
                url: 'pubsub-edge.twitch.tv',
                secure: true,
            });

            await instance.connect();

            const pong = options.ping === false ? () => {} : ping(instance, {
                format: { type: 'PING' },
            });

            instance.onMessage<any>(({ type, data }) => {
                switch (type) {
                    case 'RECONNECT': instance.reconnect(); break;
                    case 'PONG': pong(); break;
                    case 'MESSAGE': {
                        instance.events.emit('event', {
                            topic: data.topic,
                            data: JSON.parse(data.message),
                        });
                        instance.events.emit(data.topic, JSON.parse(data.message));
                        break;
                    }
                }
            });

            return instance;
        });
    },
};
