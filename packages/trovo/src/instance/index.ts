import axios from 'axios';

export const id = 'TROVO';

export const http = axios.create({
    baseURL: 'https://open-api.trovo.live/openplatform',
});
