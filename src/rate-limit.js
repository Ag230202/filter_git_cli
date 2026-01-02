const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, '../data/rate-limit-cache.json');
const DATA_DIR = path.join(__dirname, '../data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Store rate limit information for monitoring
function storeRateLimit(rateLimitInfo) {
  try {
    ensureDataDir();
    const data = {
      limit: rateLimitInfo.limit,
      remaining: rateLimitInfo.remaining,
      reset: rateLimitInfo.reset,
      storedAt: new Date().toISOString(),
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    // Silently fail - this is not critical
  }
}

// Get cached rate limit info
function getRateLimit() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Check if rate limit is exhausted
function isRateLimited(rateLimitInfo) {
  return rateLimitInfo && rateLimitInfo.remaining === 0;
}

module.exports = {
  storeRateLimit,
  getRateLimit,
  isRateLimited,
};