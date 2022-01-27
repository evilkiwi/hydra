import { singleton } from '@tnotifier/hydra';
import type { WSOptions } from '@/types';
import { obs } from '@/socket';

export const id = 'OBS_STUDIO';

export const live = {
    ws: async (options: WSOptions) => {
        return singleton({
            instance_id: options.id,
            service: id,
            method: 'ws',
        }, async () => {
            const instance = await obs({
                id: options.id,
                name: 'obs/ws',
                method: 'ws',
                service: id,
                options,
            });

            await instance.connect();

            return instance;
        });
    },
};
