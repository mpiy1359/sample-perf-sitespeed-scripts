# Architecture Decision Record – ADR-001: Project Structure

## Status
Accepted

## Context
The project needs a clear, maintainable structure that separates concerns and allows the suite to scale as more URLs, user journeys, and environments are added.

## Decision

### Folder layout

```
config/     ← All sitespeed.io and budget settings live here.
            Externalising config from code means environment-specific
            values (budgets, URLs, browser flags) can be changed without
            touching any JavaScript.

scripts/    ← Browsertime user-journey scripts (Selenium WebDriver).
            Separating scripted journeys from utilities keeps each file
            focused on a single page flow, making them easy to maintain
            and review in isolation.

tests/      ← Node.js unit tests for project utilities.
            Fast, dependency-free tests run on every commit and PR,
            catching regressions in shared logic before a full browser
            run is needed.

utils/      ← Shared helper modules (logger, budget-checker).
            Centralising cross-cutting concerns avoids code duplication
            and gives a single place to improve formatting, add
            observability, or swap implementations.

results/    ← Runtime output (HTML reports, HAR, screenshots).
            Excluded from version control; stored as CI artefacts.

docs/       ← Architecture Decision Records and runbooks.
            Capturing decisions in ADRs helps future contributors
            understand why things are the way they are.

.github/
  workflows/ ← CI pipeline definitions.
              Keeping pipelines close to the code they test means they
              are versioned together and reviewed in the same PR.
```

### Key technology choices

| Choice | Reason |
|---|---|
| **sitespeed.io** | Production-grade, plugin-based performance runner with built-in budget support, Coach advice, and PageXray asset analysis. |
| **Browsertime scripts** | Enables testing dynamic, JavaScript-heavy flows that a raw URL test would miss. |
| **JSON config** | Keeps all settings in one place, easy to diff, lint, and document. |
| **Custom logger** | Structured JSON log lines are compatible with log aggregators (Datadog, Splunk, CloudWatch) without extra tooling. |
| **Node assert** (no external test framework) | Zero additional dependencies for unit tests; compatible with any Node 18+ environment. |

## Consequences
- Adding a new target URL requires only a one-line change in `config/sitespeed.config.json`.
- Adding a new user journey requires a new file in `scripts/` and an additional `npm run` entry in `package.json`.
- Performance budgets are explicit and version-controlled, enabling teams to tighten thresholds over time in a reviewable way.
