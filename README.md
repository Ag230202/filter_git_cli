# GitHub Trending CLI

A professional command-line tool to discover trending GitHub repositories with advanced filtering, rate-limit awareness, and token-based authentication.

## Features

- 🔍 **Smart Filtering**: Filter by language, stars, and time range
- ⚡ **Rate Limit Aware**: Monitors API rate limits and implements smart backoff
- 🔐 **Token Authentication**: Support for GitHub Personal Access Tokens (5,000 req/hr vs 60 req/hr)
- 🎯 **Intuitive CLI**: Interactive setup wizard and command-line arguments
- 💾 **Persistent Preferences**: Save your preferred settings
- 🏗️ **Modular Architecture**: Clean, maintainable, extensible codebase
- 📊 **Beautiful Output**: Color-coded terminal formatting with detailed info

## Installation
```bash
npm install
```

## Quick Start
```bash
# First run - interactive setup wizard
npm start

# Using saved preferences
npm start

# Override with options
npm start -- --duration month --limit 20 --language javascript --min-stars 1000

# Show help
npm start -- --help
```

## Authentication (Optional)

To increase your rate limit from 60 to 5,000 requests per hour, add your GitHub Personal Access Token:

1. **Create a GitHub Personal Access Token**:
   - Go to Settings > Developer settings > Personal access tokens
   - Click "Generate new token"
   - Select scope: `public_repo` (read-only access)
   - Copy the token

2. **Add to CLI**:
```bash
   npm start -- --token your_token_here
```

Or set environment variable:
```bash
export GITHUB_TOKEN=your_token_here
npm start
```

## Command Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `--duration` | Time range: day, week, month, year | week | `--duration month` |
| `--limit` | Number of results (1-100) | 10 | `--limit 20` |
| `--language` | Filter by programming language | none | `--language javascript` |
| `--min-stars` | Minimum star count | 0 | `--min-stars 1000` |
| `--token` | GitHub Personal Access Token | none | `--token ghp_xxxx` |
| `--reset-prefs` | Reset saved preferences | false | `--reset-prefs` |
| `--help` | Show help message | - | `--help` |

## Example Usage
```bash
# Top JavaScript projects from last month
npm start -- --duration month --language javascript --limit 15

# Python projects with 500+ stars from this week
npm start -- --language python --min-stars 500

# All trending repos with authentication
npm start -- --token ghp_your_token_here --limit 50
```

## Rate Limiting

The CLI automatically handles GitHub API rate limits:
- **Without authentication**: 60 requests per hour
- **With GitHub token**: 5,000 requests per hour
- **Monitoring**: Shows remaining requests after each API call
- **Backoff Strategy**: Implements exponential backoff on rate limit errors

