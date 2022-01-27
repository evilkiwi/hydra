import axios from 'axios';

export const id = 'DISCORD';

export const http = axios.create({
    baseURL: 'https://discord.com/api/v9',
});
