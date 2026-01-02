const https = require('https');
const config = require('./config');
const rateLimit = require('./rate-limit');

// Calculate date range for GitHub API query
function getDateRange(duration) {
  const date = new Date();

  switch (duration) {
    case 'day':
      date.setDate(date.getDate() - 1);
      break;
    case 'week':
      date.setDate(date.getDate() - 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() - 1);
      break;
  }

  return date.toISOString().split('T')[0];
}

// Build query string with filters
function buildQuery(conf) {
  const sinceDate = getDateRange(conf.duration);
  let query = `created:>${sinceDate}`;

  if (conf.language) {
    query += ` language:${conf.language}`;
  }

  if (conf.minStars && conf.minStars > 0) {
    query += ` stars:>=${conf.minStars}`;
  }

  return query;
}

// Fetch data from GitHub API with rate limit handling
function fetchTrendingRepos(conf, retryCount = 0) {
  return new Promise((resolve, reject) => {
    const query = buildQuery(conf);

    const params = {
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: conf.limit,
    };

    const queryString = new URLSearchParams(params).toString();

    const headers = {
      'User-Agent': 'trending-repos-cli/1.0',
      'Accept': 'application/vnd.github.v3+json',
    };

    // Add authentication token if provided
    if (conf.token) {
      headers['Authorization'] = `token ${conf.token}`;
    }

    const options = {
      hostname: 'api.github.com',
      path: `/search/repositories?${queryString}`,
      method: 'GET',
      headers,
    };

    https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        // Extract rate limit information from headers
        const rateLimitInfo = {
          limit: parseInt(res.headers['x-ratelimit-limit'], 10),
          remaining: parseInt(res.headers['x-ratelimit-remaining'], 10),
          reset: parseInt(res.headers['x-ratelimit-reset'], 10),
        };

        // Store rate limit data
        rateLimit.storeRateLimit(rateLimitInfo);

        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve({ data: parsed, rateLimit: rateLimitInfo });
          } catch (err) {
            reject(new Error('Failed to parse GitHub API response'));
          }
        } else if (res.statusCode === 429 || (res.statusCode === 403 && rateLimitInfo.remaining === 0)) {
          // Rate limit exceeded - implement exponential backoff
          const waitTime = Math.max(rateLimitInfo.reset * 1000 - Date.now(), 0);

          if (retryCount < config.MAX_RETRIES) {
            const backoffTime = Math.min(1000 * Math.pow(2, retryCount), waitTime + 5000);
            const seconds = Math.ceil(backoffTime / 1000);

            console.error(
              `\n⚠️  Rate limit exceeded. Retrying in ${seconds}s (Attempt ${retryCount + 1}/${config.MAX_RETRIES})...\n`
            );

            setTimeout(() => {
              fetchTrendingRepos(conf, retryCount + 1).then(resolve).catch(reject);
            }, backoffTime);
          } else {
            reject(
              new Error(
                `Rate limit exceeded after ${config.MAX_RETRIES} retries. ` +
                `Reset time: ${new Date(rateLimitInfo.reset * 1000).toLocaleTimeString()}`
              )
            );
          }
        } else if (res.statusCode === 422) {
          reject(new Error('Invalid query parameters. Please check language and other filters.'));
        } else if (res.statusCode === 403) {
          reject(new Error('Access denied. Check your authentication token.'));
        } else {
          reject(new Error(`GitHub API returned status code: ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Network error: ${err.message}`));
    }).end();
  });
}

module.exports = { fetchTrendingRepos };