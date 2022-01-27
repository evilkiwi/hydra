import type { WebSocketOptions } from '@/live';

export interface JsonRpcOptions extends WebSocketOptions {
    timeout?: number;
}

export interface JsonRpcPayload<D = unknown> {
    type: string|number;
    data: D;
}
