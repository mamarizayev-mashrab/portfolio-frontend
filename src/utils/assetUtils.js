import { SERVER_URL } from '../api/axios';

/**
 * Formats an image path. 
 * If it's a relative path (starts with /uploads), prepends the server URL.
 * If it's an absolute URL, returns it as is.
 * 
 * @param {string} path 
 * @returns {string}
 */
export const getImageUrl = (path) => {
    if (!path) return '';

    // If it's already a full URL (http:// or https://), return it
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // If it's a relative path starting with /, prepend server URL
    if (path.startsWith('/')) {
        return `${SERVER_URL}${path}`;
    }

    // Fallback for paths without leading slash that might be relative
    if (path.startsWith('uploads')) {
        return `${SERVER_URL}/${path}`;
    }

    return path;
};
