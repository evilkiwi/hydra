<template>
    <div class="page">
        <button :disabled="loading" @click="getGames">Fetch Top Games</button>
        <ul>
            <li :key="index" v-for="(game, index) in games">{{ game }}</li>
        </ul>
        <button :disabled="loading" @click="connectPubsub">Connect to PubSub</button>
    </div>
</template>

<script lang="ts" setup>
    import type { PromiseRegistry, TransportResponsePayload, IntegrationLiveInstance } from '@tnotifier/hydra';
    import { registerTransport, setTransport } from '@tnotifier/hydra';
    import { live, fetch } from '@tnotifier/hydra-twitch';
    import { useEmbed } from '@tnotifier/embed';
    import { Service } from '@tnotifier/sdk';
    import { ref } from 'vue';

    import '@tnotifier/hydra-twitch';

    // Set-up Embed for communication.
    const { post, events, send } = useEmbed('client', {
        id: 'shared-id',
        remote: 'http://localhost:8000',
        debug: false,
    });

    // Set-up the Transport to forward all requests over Embed to the parent.
    const promises: PromiseRegistry = {};

    registerTransport('client', {
        request: async (payload) => {
            return new Promise((resolve, reject) => {
                promises[payload.id] = {
                    resolve,
                    reject,
                    timeout: window.setTimeout(() => {
                        reject(new Error('timed out'));
                        delete promises[payload.id];
                    }, 60000),
                };

                post('hydra-request', payload);
            });
        },
        connect: async (instance) => send('hydra-connect', {
            id: instance.id,
            name: instance.name,
            method: instance.method,
            service: instance.service,
            options: instance.options,
        }),
        send: async (instance, payload) => send('hydra-send', {
            id: instance.id,
            name: instance.name,
            method: instance.method,
            service: instance.service,
            options: instance.options,
            payload,
        }),
        disconnect: async (instance) => send('hydra-disconnect', {
            id: instance.id,
            name: instance.name,
            method: instance.method,
            service: instance.service,
            options: instance.options,
        }),
    });

    setTransport('client');

    // Listen for responses from the parent.
    events.on('hydra-respond', (payload: TransportResponsePayload) => {
        const promise = promises[payload.id];

        if (!promise) {
            return;
        }

        window.clearTimeout(promise.timeout as any);

        if (payload.response instanceof Error) {
            promise.reject(payload.response);
        } else {
            promise.resolve(payload.response);
        }

        delete promises[payload.id];
    });

    events.on('hydra-message', (payload: unknown) => {
        instance.process(payload);
    });

    // UI.
    const loading = ref(false);
    const games = ref([]);

    const getGames = async () => {
        if (loading.value) {
            return;
        }

        loading.value = true;

        try {
            // Can make the request as intended - but everything will happen in the parent!
            const response = await fetch<any>({
                method: 'GET',
                url: 'helix/games/top',
                access_token: '----',
            });

            games.value = response.data.map((game: any) => game.name);
        } catch (e) {
            console.log('failed to execute', e);
        }

        loading.value = false;
    };

    let instance!: IntegrationLiveInstance<any, any, any>;

    const connectPubsub = async () => {
        if (loading.value) {
            return;
        }

        loading.value = true;

        try {
            const pubsub = instance = await live().pubsub({
                id: 'hello-world',
            });

            await pubsub.send({
                type: 'LISTEN',
                data: {
                    topics: ['whispers.44009150'],
                    auth_token: '----',
                },
            });

            pubsub.events.on('whispers.44009150', data => {
                //
            });
        } catch (e) {
            console.log('failed to connect', e);
        }

        loading.value = false;
    };
</script>

<style>
    html,
    body,
    #app {
        margin: 0;
        padding: 0;
        height: 100%;
    }

    .page {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 20px;
    }
</style>
