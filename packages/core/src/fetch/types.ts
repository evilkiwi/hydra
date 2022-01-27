import type { AxiosRequestConfig } from 'axios';

export interface FetchRequest<D = any> extends AxiosRequestConfig<D> {
    id?: string;
    access_token?: string;
}
