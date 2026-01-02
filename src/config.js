const CONFIG = {
  VALID_DURATIONS: ['day', 'week', 'month', 'year'],
  DEFAULT_DURATION: 'week',
  DEFAULT_LIMIT: 10,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
  MAX_RETRIES: 3,
  GITHUB_API_URL: 'https://api.github.com/search/repositories',
  RATE_LIMIT: {
    UNAUTHENTICATED: 60,
    AUTHENTICATED: 5000,
  },
};

module.exports = CONFIG;