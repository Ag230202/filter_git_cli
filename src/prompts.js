const readline = require('readline');
const formatter = require('./formatter');
const config = require('./config');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askDuration() {
  return new Promise((resolve) => {
    console.log(`${formatter.colors.cyan}Select your preferred duration:${formatter.colors.reset}`);
    console.log(`  1. day (last 24 hours)`);
    console.log(`  2. week (last 7 days) ${formatter.colors.dim}[default]${formatter.colors.reset}`);
    console.log(`  3. month (last 30 days)`);
    console.log(`  4. year (last 365 days)\n`);

    rl.question(`${formatter.colors.yellow}Enter your choice (1-4) [default: 2]:${formatter.colors.reset} `, (answer) => {
      const choice = answer.trim() || '2';
      const durations = ['day', 'week', 'month', 'year'];
      const index = parseInt(choice, 10) - 1;

      if (index >= 0 && index < durations.length) {
        resolve(durations[index]);
      } else {
        console.log(`${formatter.colors.red}Invalid choice. Using default (week)${formatter.colors.reset}`);
        resolve('week');
      }
    });
  });
}

function askLimit() {
  return new Promise((resolve) => {
    console.log(`\n${formatter.colors.cyan}How many repositories to display?${formatter.colors.reset}`);
    console.log(`${formatter.colors.dim}(Enter a number between 1-100, default: 10)${formatter.colors.reset}\n`);

    rl.question(`${formatter.colors.yellow}Enter limit [default: 10]:${formatter.colors.reset} `, (answer) => {
      const choice = answer.trim() || '10';
      const limit = parseInt(choice, 10);

      if (!isNaN(limit) && limit >= config.MIN_LIMIT && limit <= config.MAX_LIMIT) {
        resolve(limit);
      } else {
        console.log(`${formatter.colors.red}Invalid input. Using default (10)${formatter.colors.reset}`);
        resolve(10);
      }
    });
  });
}

function askLanguage() {
  return new Promise((resolve) => {
    console.log(`\n${formatter.colors.cyan}Filter by programming language (optional)?${formatter.colors.reset}`);
    console.log(`${formatter.colors.dim}(e.g., javascript, python, go, rust, java - leave blank to skip)${formatter.colors.reset}\n`);

    rl.question(`${formatter.colors.yellow}Language [default: none]:${formatter.colors.reset} `, (answer) => {
      const language = answer.trim().toLowerCase() || null;
      resolve(language);
    });
  });
}

function askMinStars() {
  return new Promise((resolve) => {
    console.log(`\n${formatter.colors.cyan}Minimum star count (optional)?${formatter.colors.reset}`);
    console.log(`${formatter.colors.dim}(Leave blank for no minimum)${formatter.colors.reset}\n`);

    rl.question(`${formatter.colors.yellow}Min stars [default: 0]:${formatter.colors.reset} `, (answer) => {
      const minStars = parseInt(answer.trim(), 10);
      if (!isNaN(minStars) && minStars >= 0) {
        resolve(minStars);
      } else {
        resolve(0);
      }
    });
  });
}

async function askForPreferences() {
  const duration = await askDuration();
  const limit = await askLimit();
  const language = await askLanguage();
  const minStars = await askMinStars();

  rl.close();

  return {
    duration,
    limit,
    language,
    minStars,
    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  askForPreferences,
};