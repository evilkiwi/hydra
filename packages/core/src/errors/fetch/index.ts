import type { TransportRequestResponse } from '@/transports';
import { HydraError } from '@/errors/base';

export class FetchFailed extends HydraError {
    response: TransportRequestResponse;

    constructor(response: TransportRequestResponse) {
        super(`fetch failed with status code \`${response.statusCode}\``);

        this.name = 'FetchFailed';
        this.response = response;
    }
}
