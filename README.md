```markdown
# 🐙 GitHub Trending CLI 📈

A **Dockerized command-line tool** to discover trending GitHub repositories with advanced filtering, rate-limit awareness, and token-based authentication.

✅ Zero setup required — run instantly using Docker  
✅ Works consistently across environments  
✅ Designed for reviewers & developers  

---

## 🚀 Quick Start (Recommended – Docker)

> **Prerequisite:** Docker installed

```bash
docker run --rm gitclitrending
```

### Run with options

```bash
docker run --rm gitclitrending --duration month --language javascript --limit 20
```

👉 No Node.js installation required

---

## ✨ Features

- 🔍 **Smart Filtering** – Filter by language, stars, and time range
- ⚡ **Rate Limit Aware** – Monitors GitHub API limits with smart backoff
- 🔐 **Token Authentication** – Supports GitHub PATs (5,000 req/hr vs 60 req/hr)
- 🎯 **Intuitive CLI** – Interactive setup wizard + CLI flags
- 💾 **Persistent Preferences** – Saves preferred settings locally
- 🏗️ **Modular Architecture** – Clean, maintainable codebase
- 📊 **Beautiful Output** – Color-coded terminal output

---

## 🐳 Docker Image Details

- Base image: `node:18-alpine`
- Entry point: CLI executable
- Lightweight & portable
- Ideal for reviewers and demos

---

## 🛠️ Local Installation (Optional)

Requires Node.js ≥ 12

```bash
npm install
```

### Interactive setup

```bash
npm start
```

### Using saved preferences

```bash
npm start
```

### Override preferences

```bash
npm start -- --duration month --limit 20 --language javascript --min-stars 1000
```

### Help

```bash
npm start -- --help
```

---

## 🔐 Authentication (Optional)

Create a GitHub Personal Access Token (scope: `public_repo`) and pass it via CLI or environment variable.

```bash
npm start -- --token your_token_here
```

```bash
export GITHUB_TOKEN=your_token_here
npm start
```

---

## 🧩 Command Options

| Option          | Description                  | Default | Example                       |
|-----------------|------------------------------|---------|-------------------------------|
| `--duration`    | day / week / month / year    | week    | `--duration month`            |
| `--limit`       | Results (1–100)              | 10      | `--limit 20`                  |
| `--language`    | Programming language         | none    | `--language javascript`       |
| `--min-stars`   | Minimum stars                | 0       | `--min-stars 1000`            |
| `--token`       | GitHub PAT                   | none    | `--token ghp_xxxx`            |
| `--reset-prefs` | Reset preferences            | false   | `--reset-prefs`               |
| `--help`        | Show help                    | —       | `--help`                      |

---

## 📊 Example Usage

```bash
docker run --rm gitclitrending --duration month --language javascript --limit 15
```

```bash
docker run --rm gitclitrending --language python --min-stars 500
```

```bash
docker run --rm gitclitrending --token ghp_your_token_here --limit 50
```

---

## ⏱️ Rate Limiting Behavior

- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour

Displays remaining quota and uses exponential backoff.

---

## 📁 Project Structure

```
.
├── bin/
│   └── index.js
├── src/
├── Dockerfile
├── .dockerignore
├── package.json
└── README.md
```
