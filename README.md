Score model answers against a fixed rubric (accuracy, relevance, tone, instruction-following), log failure patterns, and export aggregate quality for a feature before release.

## Stack

- Express API + JSON store
- Static reviewer UI (`web/`)
- Sample outputs for offline dry runs

## Quick start

```bash
npm install
npm run demo
npm test
npm run server   # http://localhost:4070
```

Open `web/index.html` or hit the API directly.

### API

- `GET /rubric`
- `GET /queue` — unscored samples
- `POST /score` — submit rubric scores + failure tags
- `GET /stats` — aggregate means + failure pattern counts

## Rubric (1–5)

| Dimension | Meaning |
|-----------|---------|
| accuracy | Facts match the source / task |
| relevance | Answers the asked question |
| tone | Fits product voice |
| instruction_following | Obeys stated constraints |
function calculateAggregateMeans(matrix) { return matrix.reduce((a, b) => a + b, 0) / matrix.length; }
