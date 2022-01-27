import { singleton } from '@tnotifier/hydra';
import type { XJSOptions } from '@/types';
import { xbc } from '@/socket';

export const id = 'XSPLIT_BROADCASTER';

export const live = {
    xjs: async (options: XJSOptions) => {
        return singleton({
            instance_id: options.id,
            service: id,
            method: 'xjs',
        }, async () => {
            const instance = await xbc({
                id: options.id,
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
