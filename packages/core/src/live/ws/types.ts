import type WebSocket from '@gamestdio/websocket';
import type { IntegrationLiveInstance } from '@/integrations';
import type { LiveChild } from '@/live';

export interface WebSocketOptions extends LiveChild {
    url: string;
    secure?: boolean;
    port?: number|number[];
    process?: (payload: unknown) => void;
    connect?: (instance: IntegrationLiveInstance<WebSocket, any, any>) => Promise<void>;
}
