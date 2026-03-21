/**
 * Cloudflare Pages Function: /api/github-stats
 * Caches GitHub API data to avoid rate limiting.
 * Cache duration: 30 minutes (48 fetches/day, well within 60/hr limit)
 */

const GITHUB_USERNAME = 'Gary-nope';
const API_BASE = 'https://api.github.com';
const UA = 'Personal-Profile-Site';
const CACHE_SECONDS = 1800; // 30 minutes

async function fetchGitHubData() {
    const headers = { 'User-Agent': UA, 'Accept': 'application/vnd.github.v3+json' };

    // Fetch user profile + repos in parallel
    const [userRes, reposRes] = await Promise.all([
        fetch(`${API_BASE}/users/${GITHUB_USERNAME}`, { headers }),
        fetch(`${API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&direction=desc`, { headers }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
        throw new Error('GitHub API error: ' + userRes.status);
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

    const projects = repos
        .filter(r => !r.fork)
        .slice(0, 6)
        .map(r => ({
            name: r.name,
            description: r.description || '暂无描述',
            html_url: r.html_url,
            language: r.language || '',
            stars: r.stargazers_count || 0,
        }));

    return {
        stats: {
            public_repos: user.public_repos || 0,
            followers: user.followers || 0,
            following: user.following || 0,
            stars: totalStars,
        },
        projects,
        cached_at: new Date().toISOString(),
    };
}

export async function onRequestGet(context) {
    const cacheUrl = new URL(context.request.url);
    cacheUrl.pathname = '/api/github-stats-cache';
    const cacheKey = new Request(cacheUrl.toString());
    const cache = caches.default;

    // Try cache first
    let response = await cache.match(cacheKey);
    if (response) {
        // Add header to indicate cache hit
        const body = await response.text();
        return new Response(body, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'X-Cache': 'HIT',
                'Cache-Control': 'public, max-age=' + CACHE_SECONDS,
            },
        });
    }

    // Cache miss — fetch from GitHub
    try {
        const data = await fetchGitHubData();
        const body = JSON.stringify(data);

        response = new Response(body, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'X-Cache': 'MISS',
                'Cache-Control': 'public, max-age=' + CACHE_SECONDS,
            },
        });

        // Store in cache (non-blocking)
        context.waitUntil(cache.put(cacheKey, response.clone()));

        return response;
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 502,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}
