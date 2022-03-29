import { rand, singleton } from '@evilkiwi/hydra';
import type { XJSOptions } from '@/types';
import { xbc } from '@/socket';

export const id = 'XSPLIT_BROADCASTER';

export const live = {
    xjs: async (options: XJSOptions) => {
        const liveId = `${options.id ?? rand(1, 1000000)}`;

        return singleton({
            instance_id: liveId,
            service: id,
            method: 'xjs',
        }, async () => {
            const instance = await xbc({
                id: liveId,
                name: 'xbc/xjs',
                method: 'xjs',
                service: id,
                options,
            });

            await instance.connect();

            return instance;
        });
    },
};
