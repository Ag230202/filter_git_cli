const api = require('./api');
const formatter = require('./formatter');
const config = require('./config');
const preferences = require('./preferences');
const prompt = require('./prompts');

// Parse command-line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsedConfig = {
    duration: null,
    limit: null,
    language: null,
    minStars: null,
    token: null,
    resetPrefs: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--duration' && args[i + 1]) {
      parsedConfig.duration = args[i + 1].toLowerCase();
      i++;
    } else if (args[i] === '--limit' && args[i + 1]) {
      parsedConfig.limit = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--language' && args[i + 1]) {
      parsedConfig.language = args[i + 1].toLowerCase();
      i++;
    } else if (args[i] === '--min-stars' && args[i + 1]) {
      parsedConfig.minStars = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--token' && args[i + 1]) {
      parsedConfig.token = args[i + 1];
      i++;
    } else if (args[i] === '--reset-prefs') {
      parsedConfig.resetPrefs = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      formatter.showHelp();
      process.exit(0);
    }
  }

  return parsedConfig;
}

// Validate configuration
function validateConfig(conf) {
  const errors = [];

  if (conf.duration && !config.VALID_DURATIONS.includes(conf.duration)) {
    errors.push(
      `${formatter.colors.red}✗ Invalid duration: ${conf.duration}${formatter.colors.reset}\n` +
      `  Valid options: ${config.VALID_DURATIONS.join(', ')}`
    );
  }

  if (conf.limit && (isNaN(conf.limit) || conf.limit < config.MIN_LIMIT)) {
    errors.push(
      `${formatter.colors.red}✗ Invalid limit: ${conf.limit}${formatter.colors.reset}\n` +
      `  Limit must be a number >= ${config.MIN_LIMIT}`
    );
  }

  if (conf.limit && conf.limit > config.MAX_LIMIT) {
    conf.limit = config.MAX_LIMIT;
  }

  if (conf.minStars && (isNaN(conf.minStars) || conf.minStars < 0)) {
    errors.push(
      `${formatter.colors.red}✗ Invalid min-stars: ${conf.minStars}${formatter.colors.reset}\n` +
      `  Must be a non-negative number`
    );
  }

  if (errors.length > 0) {
    console.error('\n' + errors.join('\n') + '\n');
    if (errors.some(e => e.includes('Invalid'))) {
      process.exit(1);
    }
  }

  return conf;
}

// Merge user arguments with saved preferences
async function mergePreferences(args) {
  let savedPrefs = preferences.getPreferences();
  
  // Check for token in environment variable
  if (!args.token && process.env.GITHUB_TOKEN) {
    args.token = process.env.GITHUB_TOKEN;
  }

  if (!savedPrefs || args.resetPrefs) {
    console.log(`\n${formatter.colors.cyan}${formatter.colors.bright}Welcome to GitHub Trending CLI!${formatter.colors.reset}\n`);
    savedPrefs = await prompt.askForPreferences();
    preferences.savePreferences(savedPrefs);
    console.log(`\n${formatter.colors.green}✓ Preferences saved!${formatter.colors.reset}\n`);
  }

  const finalConfig = {
    duration: args.duration || savedPrefs.duration,
    limit: args.limit || savedPrefs.limit,
    language: args.language || savedPrefs.language || null,
    minStars: args.minStars || savedPrefs.minStars || 0,
    token: args.token || null,
  };

  return finalConfig;
}

// Main execution
async function run() {
  try {
    const args = parseArgs();
    let conf = await mergePreferences(args);
    conf = validateConfig(conf);

    console.log(`${formatter.colors.dim}Fetching trending repositories...${formatter.colors.reset}\n`);

    const { data, rateLimit } = await api.fetchTrendingRepos(conf);
    formatter.displayResults(data, conf);
    formatter.displayRateLimit(rateLimit);
  } catch (error) {
    console.error(`\n${formatter.colors.red}✗ Error: ${error.message}${formatter.colors.reset}\n`);
    process.exit(1);
  }
}

module.exports = { run };