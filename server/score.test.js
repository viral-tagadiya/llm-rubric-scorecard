const assert = require("assert");
const { validateScorePayload, aggregate } = require("./score");

const rubric = {
  dimensions: [
    { id: "accuracy" },
    { id: "relevance" },
    { id: "tone" },
    { id: "instruction_following" },
  ],
  failureTags: ["hallucinated_fact"],
};

assert.ok(
  validateScorePayload(
    {
      sampleId: "s1",
      scores: { accuracy: 5, relevance: 5, tone: 4, instruction_following: 5 },
      failureTags: [],
    },
    rubric
  ) === null
);

assert.ok(
  validateScorePayload(
    {
      sampleId: "s1",
      scores: { accuracy: 9, relevance: 5, tone: 4, instruction_following: 5 },
    },
    rubric
  )
);

const stats = aggregate([
  {
    scores: { accuracy: 5, relevance: 5, tone: 5, instruction_following: 5 },
    failureTags: [],
  },
  {
    scores: { accuracy: 1, relevance: 1, tone: 1, instruction_following: 1 },
    failureTags: ["hallucinated_fact"],
  },
]);
assert.equal(stats.overall, 3);
assert.equal(stats.failureCounts.hallucinated_fact, 1);
console.log("score.test.js passed");
