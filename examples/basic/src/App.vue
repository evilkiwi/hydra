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
    import { Hook, registerMiddleware } from '@tnotifier/hydra';
    import { fetch, live } from '@tnotifier/hydra-twitch';
    import { Service } from '@tnotifier/sdk';
    import { ref } from 'vue';

    registerMiddleware('twitch-client-id', Hook.PreFetch, async (payload) => {
        payload.request.headers = {
            ...(payload.request.headers ?? {}),
            'Client-ID': 'eghhpg16nsvalqb66d7iumtdu7rqf24',
        };

        return payload;
    }, ({ service }) => service === Service.Twitch);

    // UI.
    const loading = ref(false);
    const games = ref([]);

    const getGames = async () => {
        if (loading.value) {
            return;
        }

        loading.value = true;

        try {
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

    const connectPubsub = async () => {
        if (loading.value) {
            return;
        }

        loading.value = true;

        try {
            const pubsub = await live().pubsub({
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
