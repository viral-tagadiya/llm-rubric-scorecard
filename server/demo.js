const { aggregate } = require("./score");

const demoLabels = [
  {
    sampleId: "s1",
    scores: { accuracy: 5, relevance: 5, tone: 5, instruction_following: 5 },
    failureTags: [],
  },
  {
    sampleId: "s2",
    scores: { accuracy: 1, relevance: 2, tone: 3, instruction_following: 2 },
    failureTags: ["hallucinated_fact", "incomplete_answer"],
  },
];

console.log(JSON.stringify(aggregate(demoLabels), null, 2));
