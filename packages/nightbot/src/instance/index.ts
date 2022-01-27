import axios from 'axios';

export const id = 'NIGHTBOT';

export const http = axios.create({
    baseURL: 'https://api.nightbot.tv/1',
});
