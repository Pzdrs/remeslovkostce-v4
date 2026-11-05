import axios from 'axios';

const strapiURL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api';

const api = axios.create({baseURL: strapiURL});

export function getMediaURL(media: string | { url?: string } | null | undefined): string {
    if (typeof media === 'object') media = media?.url ?? '';
    if (!media) return '';
    if (/^https?:\/\//i.test(media)) return media;

    const origin = new URL(strapiURL, window.location.origin).origin;
    return `${origin}${media.startsWith('/') ? media : `/${media}`}`;
}

export default api;
