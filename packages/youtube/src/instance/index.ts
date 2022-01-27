import axios from 'axios';

export const id = 'YOUTUBE';

export const http = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
});
