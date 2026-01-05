const path = require("path");
const { readJson, loadLabels, saveLabels } = require("./store");
const { validateScorePayload, aggregate } = require("./score");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../web")));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "llm-rubric-scorecard" });
});

app.get("/rubric", (_req, res) => {
  res.json(readJson("rubric.json"));
});

app.get("/queue", (_req, res) => {
  const samples = readJson("samples.json");
  const scored = new Set(loadLabels().map((l) => l.sampleId));
  res.json(samples.filter((s) => !scored.has(s.id)));
});

app.post("/score", (req, res) => {
  const rubric = readJson("rubric.json");
  const err = validateScorePayload(req.body, rubric);
  if (err) {
    res.status(400).json({ error: err });
    return;
  }
  const labels = loadLabels().filter((l) => l.sampleId !== req.body.sampleId);
  labels.push({
    sampleId: req.body.sampleId,
    scores: req.body.scores,
    failureTags: req.body.failureTags || [],
    note: req.body.note || "",
    scoredAt: new Date().toISOString(),
  });
  saveLabels(labels);
  res.json({ ok: true, stats: aggregate(labels) });
});

app.get("/stats", (_req, res) => {
  res.json(aggregate(loadLabels()));
});

const port = Number(process.env.PORT ?? 4070);
app.listen(port, () => {
  console.log(`llm-rubric-scorecard on http://localhost:${port}`);
});
const express = require('express');
const router = express.Router();
// Base scorecard scoring API infrastructure route definitions
const express = require('express');
const router = express.Router();
// Base scorecard scoring API infrastructure route definitions
<!DOCTYPE html><html><head><title>Rubric Scorecard Reviewer Panel</title></head></html>
app.post('/score', (req, res) => { const { scores, tags, modelId } = req.body; res.sendStatus(200); });
app.post('/score', (req, res) => { const { scores, tags, modelId } = req.body; res.sendStatus(200); });
