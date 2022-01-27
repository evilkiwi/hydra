<template>
    <div class="page">
        <iframe
            src="http://localhost:8001"
            class="page__iframe"
            ref="iframe"
        />
    </div>
</template>

<script lang="ts" setup>
    import { buildId, Hook, registerMiddleware, registerTransport, setTransport } from '@tnotifier/hydra';
    import type { IntegrationLiveInstance, TransportRequestPayload, LiveChild } from '@tnotifier/hydra';
    import { fetch, live } from '@tnotifier/hydra-twitch';
    import { useEmbed } from '@tnotifier/embed';
    import { Service } from '@tnotifier/sdk';
    import { ref } from 'vue';

    // Set-up Embed for communications.
    const iframe = ref<InstanceType<typeof HTMLIFrameElement>>();
    const { handle, post, events } = useEmbed('host', {
        id: 'shared-id',
        iframe,
        remote: 'http://localhost:8001',
        timeout: 15000,
        debug: false,
    });

    // Add Twitch Credentials to all requests.
    registerMiddleware('add-credentials', Hook.PreFetch, async (payload) => {
        payload.request.headers = {
            ...(payload.request.headers ?? {}),
            'Client-ID': 'eghhpg16nsvalqb66d7iumtdu7rqf24',
        };

        return payload;
    }, ({ service }) => service === Service.Twitch);

    // Register Host Transport to send responses to the iFrame.
    registerTransport('host', {
        respond: async (payload) => {
            post('hydra-respond', payload);
            return payload.response;
        },
        message: async (instance, payload) => {
            post('hydra-message', payload);
        },
    });

    setTransport('host');

    // Listen for requests coming from the iFrame.
    events.on('hydra-request', (payload: TransportRequestPayload) => {
        fetch({
            id: payload.id,
            ...payload.request,
        });
    });

    // Handle Live connections.
    const connections: Record<string, IntegrationLiveInstance> = {};

    handle<LiveChild>('hydra-connect', async (payload) => {
        const id = buildId({
            service: payload.service,
            method: payload.name,
            instance_id: payload.id,
        });

        const instance = await (live() as any)[payload.method]({
            ...(payload.options as any),
            ping: false,
        });

        if (!connections[id]) {
            connections[id] = instance;
        }
    });

    handle<LiveChild & { payload: unknown }>('hydra-send', async (payload) => {
        const id = buildId({
            service: payload.service,
            method: payload.name,
            instance_id: payload.id,
        });

        if (!connections[id]) {
            throw new Error('no connection for this id');
        }

        return connections[id].send(payload.payload);
    });

    handle<LiveChild>('hydra-disconnect', async (payload) => {
        const id = buildId({
            service: payload.service,
            method: payload.name,
            instance_id: payload.id,
        });

        if (!connections[id]) {
            return;
        }

        return connections[id].disconnect();
    });
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
        flex-direction: row;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
    }

    .page__col {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        flex-shrink: 1;
        margin-left: 20px;
    }

    .page__col:first-child {
        margin-left: 0;
    }

    .page__iframe {
        flex-grow: 1;
        flex-shrink: 1;
        margin: 0;
        padding: 0;
    }
</style>
