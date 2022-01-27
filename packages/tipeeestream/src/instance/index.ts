import axios from 'axios';

export const id = 'TIPEEESTREAM';

export const http = axios.create({
    baseURL: 'https://api.tipeeestream.com/v1.0',
});
