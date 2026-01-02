// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

// Format and display results
function displayResults(data, conf) {
  if (!data.items || data.items.length === 0) {
    console.log(
      `${colors.yellow}No trending repositories found for the past ${conf.duration}.${colors.reset}\n`
    );
    return;
  }

  console.log(
    `\n${colors.bright}${colors.cyan}Trending Repositories (Last ${conf.duration.toUpperCase()})${colors.reset}\n`
  );

  const filters = [];
  if (conf.language) filters.push(`Language: ${conf.language}`);
  if (conf.minStars > 0) filters.push(`Min Stars: ${conf.minStars}`);
  if (filters.length > 0) {
    console.log(`${colors.dim}Filters: ${filters.join(' • ')}${colors.reset}\n`);
  }

  console.log(`${colors.dim}Found ${data.items.length} repositories${colors.reset}\n`);

  data.items.forEach((repo, index) => {
    const num = `${colors.dim}${String(index + 1).padStart(3, ' ')}.${colors.reset}`;
    const name = `${colors.bright}${colors.blue}${repo.full_name}${colors.reset}`;
    const stars = `${colors.yellow}⭐ ${repo.stargazers_count}${colors.reset}`;
    const language = repo.language 
      ? `${colors.green}${repo.language}${colors.reset}` 
      : `${colors.dim}Unknown${colors.reset}`;
    const created = new Date(repo.created_at);
    const createdDays = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
    const createdText = `${colors.gray}${createdDays}d ago${colors.reset}`;

    console.log(`${num} ${name}`);
    console.log(`   ${stars} • Language: ${language} • Created: ${createdText}`);

    if (repo.description) {
      const desc = repo.description.substring(0, 75);
      console.log(`   ${colors.dim}${desc}${desc.length < repo.description.length ? '...' : ''}${colors.reset}`);
    }

    console.log(`   ${colors.dim}${repo.html_url}${colors.reset}\n`);
  });
}

// Display rate limit status
function displayRateLimit(rateLimitInfo) {
  if (!rateLimitInfo) return;

  const resetDate = new Date(rateLimitInfo.reset * 1000);
  const minutesUntilReset = Math.ceil((resetDate - Date.now()) / (1000 * 60));
  const hourUntilReset = Math.ceil((resetDate - Date.now()) / (1000 * 60 * 60));

  let resetText = '';
  if (minutesUntilReset < 60) {
    resetText = `${minutesUntilReset} minutes`;
  } else {
    resetText = `${hourUntilReset} hour${hourUntilReset > 1 ? 's' : ''}`;
  }

  console.log(
    `${colors.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );
  console.log(
    `${colors.gray}Rate Limit: ${rateLimitInfo.remaining}/${rateLimitInfo.limit} remaining (resets in ${resetText})${colors.reset}`
  );
  console.log(
    `${colors.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`
  );
}

// Show help message
function showHelp() {
  console.log(`
${colors.bright}GitHub Trending CLI${colors.reset}
Discover trending repositories with advanced filtering and rate-limit awareness

${colors.bright}Usage:${colors.reset}
  npm start [options]

${colors.bright}Options:${colors.reset}
  --duration <value>    Time range: day, week, month, year
                        ${colors.dim}(default: week)${colors.reset}
  --limit <number>      Number of repositories (1-100)
                        ${colors.dim}(default: 10)${colors.reset}
  --language <lang>     Filter by programming language
                        ${colors.dim}(e.g., javascript, python, go)${colors.reset}
  --min-stars <num>     Minimum star count
                        ${colors.dim}(default: 0)${colors.reset}
  --token <token>       GitHub Personal Access Token
                        ${colors.dim}(5000 req/hr vs 60 req/hr without)${colors.reset}
  --reset-prefs         Reset saved preferences
  --help, -h            Show this help message

${colors.bright}Examples:${colors.reset}
  ${colors.dim}# Use saved preferences${colors.reset}
  npm start

  ${colors.dim}# Top JavaScript projects from last month${colors.reset}
  npm start -- --duration month --language javascript --limit 15

  ${colors.dim}# Popular Python projects (1000+ stars)${colors.reset}
  npm start -- --language python --min-stars 1000

  ${colors.dim}# With GitHub token for higher rate limit${colors.reset}
  npm start -- --token ghp_your_token_here --limit 50

${colors.bright}Environment Variables:${colors.reset}
  GITHUB_TOKEN          GitHub Personal Access Token
  ${colors.dim}export GITHUB_TOKEN=ghp_xxxx${colors.reset}

${colors.bright}Rate Limiting:${colors.reset}
  Without token: 60 requests per hour
  With token:    5,000 requests per hour
  `);
}

module.exports = {
  colors,
  displayResults,
  displayRateLimit,
  showHelp,
};