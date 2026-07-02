/**
 * Path Detector - Auto-detect correct paths for API calls
 * Works in any folder structure or subdomain
 */

// Detect base path from script location
function detectBasePath() {
    // Method 1: Try to find script.js location
    const scripts = typeof document !== 'undefined' ? document.getElementsByTagName('script') : [];
    for (let script of scripts) {
        if (script.src && (script.src.includes('script.js') || script.src.includes('main.js') || script.src.includes('index.js'))) {
            const url = new URL(script.src);
            const pathname = url.pathname;
            const scriptDir = pathname.substring(0, pathname.lastIndexOf('/'));
            return scriptDir || '';
        }
    }
    
    // Method 2: Use current page location
    if (typeof window === 'undefined') return '';
    const currentPath = window.location.pathname;
    
    // Remove index.php or trailing file names if present
    let cleanPath = currentPath;
    if (cleanPath.endsWith('.php') || cleanPath.endsWith('.html') || cleanPath.endsWith('.js')) {
        cleanPath = cleanPath.substring(0, cleanPath.lastIndexOf('/'));
    }
    
    // If we are in a subdirectory like /batches/ or /study/, extract it
    // For local development on root, this returns ""
    return cleanPath.replace(/\/$/, ''); // strip trailing slash
}

function detectSubdirectory() {
    const path = detectBasePath();
    if (!path) return '';
    const parts = path.split('/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : '';
}

// Dynamic API Endpoint Builder
function getApiPath(endpoint) {
    const base = detectBasePath();
    
    // Handle public settings or local JSONs
    if (endpoint === 'settings') {
        return base + '/get_settings.json';
    }
    if (endpoint === 'batches') {
        return base + '/batch.json';
    }
    
    return base + '/' + endpoint;
}

export const PathDetector = {
    basePath: detectBasePath(),
    subdirectory: detectSubdirectory(),
    getApiPath: getApiPath,
    
    // Helper to build full URL
    buildUrl: function(path) {
        const base = this.basePath;
        const cleanPath = path.startsWith('/') ? path : '/' + path;
        return base + cleanPath;
    }
};

if (typeof window !== 'undefined') {
    window.PathDetector = PathDetector;
}

export default PathDetector;
