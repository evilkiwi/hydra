import type { IntegrationLiveRegister } from '@/integrations';
import type { TransportRequestResponse } from '@/transports';

export interface PromiseRegistry<Payload = TransportRequestResponse> {
    [id: string]: {
        resolve: (payload: Payload) => void;
        reject: (e: Error) => void;
        timeout: NodeJS.Timeout|number;
    };
}

export interface Integrations {
    [name: string]: {
        live: IntegrationLiveRegister;
    };
}
