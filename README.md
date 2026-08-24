# sample-perf-sitespeed-scripts

Enterprise-ready performance test project powered by **[sitespeed.io](https://www.sitespeed.io/)**.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Performance Budgets](#performance-budgets)
- [CI/CD Integration](#cicd-integration)
- [Contributing](#contributing)

---

## Overview

This project provides a structured, production-ready scaffold for running automated web performance tests against a target URL. Out of the box it:

- Measures Core Web Vitals and other key timing metrics using **sitespeed.io**.
- Supports **scripted user journeys** via Browsertime scripts (Selenium WebDriver).
- Enforces **performance budgets** – the CI pipeline fails when thresholds are exceeded.
- Generates rich **HTML reports** including waterfall charts, screenshots, and HAR files.

The sample target URL is `https://www.sitespeed.io/`.

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| Node.js | 18.x |
| npm | 9.x |
| Google Chrome | stable |
| Docker (optional) | 20.x |

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/mpiy1359/sample-perf-sitespeed-scripts.git
cd sample-perf-sitespeed-scripts

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Run the default performance test
npm run perf:run
```

HTML results are written to `./results/latest/`.

---

## Project Structure

```
sample-perf-sitespeed-scripts/
│
├── config/                      # All configuration files
│   ├── sitespeed.config.json    # Main sitespeed.io options (browser, plugins, output)
│   └── budget.json              # Performance budget thresholds
│
├── scripts/                     # Browsertime scripted user journeys
│   └── user-journey.js          # Sample scripted navigation for sitespeed.io
│
├── tests/                       # Unit tests for project utilities
│   ├── budget-checker.test.js   # Tests for the budget-checker utility
│   └── logger.test.js           # Tests for the logger utility
│
├── utils/                       # Shared utility modules
│   ├── logger.js                # Structured JSON logger (env-driven log levels)
│   └── budget-checker.js        # Compares measured metrics against budget thresholds
│
├── results/                     # Generated reports (git-ignored)
│
├── docs/                        # Extended documentation
│
├── .github/
│   └── workflows/
│       └── performance.yml      # GitHub Actions CI pipeline
│
├── .env.example                 # Template for environment variables
├── .gitignore
├── eslint.config.cjs            # ESLint flat-config (v9+)
└── package.json
```

### Why each folder exists

| Folder / file | Purpose |
|---|---|
| `config/` | Centralises all settings so engineers change one file rather than hunting through CLI flags. |
| `scripts/` | Browsertime user-journey scripts simulate real user flows (login, checkout, etc.), giving more representative metrics than a simple page load. |
| `tests/` | Unit tests verify utility logic in isolation – no browser or network calls needed. |
| `utils/` | Reusable helpers (logging, budget checking) that are shared across scripts and the CI pipeline. |
| `results/` | Output directory for HTML reports, HAR files, screenshots. Excluded from version control. |
| `docs/` | Home for extended documentation such as runbooks and architecture decisions. |
| `.github/workflows/` | CI/CD pipeline definitions. Performance tests run automatically on every push to `main`. |

---

## Configuration

### `config/sitespeed.config.json`

Controls browser settings, plugins, and output. Key options:

| Key | Default | Description |
|---|---|---|
| `urls` | `["https://www.sitespeed.io/"]` | URLs to test |
| `browsertime.iterations` | `3` | Number of page loads per URL |
| `browsertime.browser` | `chrome` | Browser to use |
| `browsertime.headless` | `true` | Run headless (no visible window) |
| `outputFolder` | `./results/latest` | Where to write reports |

### `config/budget.json`

Performance budget thresholds in milliseconds (timing) or bytes/counts:

| Metric | Default budget |
|---|---|
| First Paint | 2 000 ms |
| First Contentful Paint | 2 500 ms |
| Largest Contentful Paint | 3 500 ms |
| Time to Interactive | 4 000 ms |
| Total Blocking Time | 300 ms |
| Cumulative Layout Shift | 0.1 |
| Transfer Size | 2 MB |
| Requests | 100 |
| Coach Score | ≥ 75 |

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run unit tests (logger and budget-checker) |
| `npm run perf:run:ci` | Run and write results to `results/ci/` |
| `npm run perf:run:desktop` | Run at 1920×1080 viewport |
| `npm run perf:run:mobile` | Run with mobile viewport + emulation |
| `npm run perf:run:scripted` | Run the scripted user journey |
| `npm run lint` | Lint scripts and utilities |
| `node tests/budget-checker.test.js` | Run budget-checker unit tests |
| `node tests/logger.test.js` | Run logger unit tests |

---

## Performance Budgets

If any measured metric exceeds the values in `config/budget.json` sitespeed.io will exit with a non-zero status code, causing the CI pipeline to fail.

Adjust the thresholds to match your organisation's SLOs.

---

## CI/CD Integration

The GitHub Actions workflow in `.github/workflows/performance.yml`:

1. **Runs unit tests** on every push and pull request.
2. **Runs performance tests** on pushes to `main` and manual workflow dispatches.
3. **Uploads the HTML report** as a build artifact (retained for 30 days).

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-improvement`.
3. Commit your changes: `git commit -m "feat: describe your change"`.
4. Push and open a Pull Request.

Please ensure `npm run lint` passes before opening a PR.
