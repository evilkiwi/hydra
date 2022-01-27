import axios from 'axios';

export const id = 'SPOTIFY';

export const http = axios.create({
    baseURL: 'https://api.spotify.com/v1',
});
