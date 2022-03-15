import { v4 as uuid } from 'uuid';
import axios from 'axios';
import type { IntegrationFetchPayload } from '@/integrations';
import type { TransportRequestResponse } from '@/transports';
import { integrations } from '@/integrations';
import { runMiddleware } from '@/middleware';
import { useTransport } from '@/transports';
import { FetchFailed } from '@/errors';
import { logger } from '@/logger';
import { Hook } from '@/enums';
import type { FetchRequest } from './types';

export const fetch = (service: string) => async <R extends object = {}, D extends object = {}>(request: FetchRequest<D>, once = false): Promise<R> => {
    if (!integrations[`${service}`] || !integrations[`${service}`].http) {
        throw new Error(`service "${service}" does not support fetch`);
    }

    // Generate a unique request ID.
    const id = request.id ?? uuid();

    logger.debug(`starting request \`${id}\``);

    // Run the pre-fetch middleware.
    const preFetch = await runMiddleware(Hook.PreFetch, { id, service, request });
    request = preFetch.request;

    // Run the request via the active transport.
    const transport = useTransport();

    const { statusCode, response } = await transport.request({
        id,
        service,
        request,
        fetch: runFetch,
        meta: request.meta ?? {},
    });

    // Run the post-fetch middleware.
    const output = await runMiddleware(Hook.PostFetch, {
        id,
        service,
        request,
        response,
        statusCode,
    });

    if (output.rerun && !once) {
        return fetch(service)(output.request, true);
    }

    return response as R;
};

const runFetch = async <D = any>(payload: IntegrationFetchPayload<D>) => {
    const http = integrations[payload.service]?.http;

    if (!http) {
        throw new Error(`service "${payload.service}" does not support http`);
    }

    const transport = useTransport();
    let response: Error|TransportRequestResponse = new Error('unknown error');

    try {
        const { status, data } = await http.request(payload.request);

        response = {
            statusCode: status,
            response: data,
        };
    } catch (e) {
        if (axios.isAxiosError(e)) {
            response = new FetchFailed({
                statusCode: e.response?.status ?? -1,
                response: e.response?.data ?? e,
            });
        } else {
            response = e as Error;
        }
    }

    return transport.respond({
        id: payload.id,
        response,
        meta: payload.request.meta ?? {},
    });
};

export * from './types';
