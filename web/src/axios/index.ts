import axios from 'axios';

const api = axios.create({baseURL: '/api'});

export function getMediaURL(value: string | null | undefined): string | null {
    if (!value) return null;
    if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
        return value.startsWith('//') ? `${window.location.protocol}${value}` : value;
    }
    return new URL(value, window.location.origin).toString();
}

export default api;
