import { rand, singleton } from '@evilkiwi/hydra';
import type { WSOptions } from '@/types';
import { obs } from '@/socket';

export const id = 'OBS_STUDIO';

export const live = {
    ws: async (options: WSOptions) => {
        const liveId = `${options.id ?? rand(1, 1000000)}`;

        return singleton({
            instance_id: liveId,
            service: id,
            method: 'ws',
        }, async () => {
            const instance = await obs({
                id: liveId,
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
