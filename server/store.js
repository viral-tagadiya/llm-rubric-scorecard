const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const labelsPath = path.join(root, "data", "labels.json");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(root, "data", name), "utf8"));
}

function loadLabels() {
  if (!fs.existsSync(labelsPath)) return [];
  return JSON.parse(fs.readFileSync(labelsPath, "utf8"));
}

function saveLabels(labels) {
  fs.writeFileSync(labelsPath, JSON.stringify(labels, null, 2));
}

module.exports = { readJson, loadLabels, saveLabels };
