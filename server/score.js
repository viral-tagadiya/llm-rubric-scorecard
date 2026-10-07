function mean(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function validateScorePayload(body, rubric) {
  const dims = rubric.dimensions.map((d) => d.id);
  const scores = body.scores || {};
  for (const id of dims) {
    const n = Number(scores[id]);
    if (!Number.isFinite(n) || n < 1 || n > 5) {
      return `scores.${id} must be 1–5`;
    }
  }
  const tags = Array.isArray(body.failureTags) ? body.failureTags : [];
  for (const tag of tags) {
    if (!rubric.failureTags.includes(tag)) return `unknown failure tag: ${tag}`;
  }
  if (!body.sampleId) return "sampleId is required";
  return null;
}

function aggregate(labels) {
  const dims = ["accuracy", "relevance", "tone", "instruction_following"];
  const byDim = {};
  for (const d of dims) {
    byDim[d] = Number(mean(labels.map((l) => l.scores[d])).toFixed(2));
  }
  const failureCounts = {};
  for (const label of labels) {
    for (const tag of label.failureTags || []) {
      failureCounts[tag] = (failureCounts[tag] || 0) + 1;
    }
  }
  return {
    n: labels.length,
    means: byDim,
    overall: Number(mean(Object.values(byDim)).toFixed(2)),
    failureCounts,
  };
}

module.exports = { validateScorePayload, aggregate, mean };
