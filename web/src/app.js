async function api(path, opts) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  return res.json();
}

function dimInputs(rubric) {
  return rubric.dimensions
    .map(
      (d) => `<label>${d.label}
        <select name="${d.id}">
          ${[1, 2, 3, 4, 5].map((n) => `<option value="${n}" ${n === 3 ? "selected" : ""}>${n}</option>`).join("")}
        </select>
      </label>`
    )
    .join("");
}

function tagInputs(rubric) {
  return rubric.failureTags
    .map((t) => `<label class="tag"><input type="checkbox" name="tag" value="${t}" /> ${t}</label>`)
    .join("");
}

async function render() {
  const [rubric, queue, stats] = await Promise.all([
    api("/rubric"),
    api("/queue"),
    api("/stats"),
  ]);

  document.getElementById("stats").innerHTML = `
    <h2>Stats</h2>
    <p>Scored: <strong>${stats.n}</strong> · Overall: <strong>${stats.overall}</strong></p>
    <pre>${JSON.stringify(stats.means || {}, null, 2)}</pre>
    <p>Failure patterns:</p>
    <pre>${JSON.stringify(stats.failureCounts || {}, null, 2)}</pre>
  `;

  const root = document.getElementById("queue");
  if (!queue.length) {
    root.innerHTML = "<h2>Queue</h2><p>All samples scored.</p>";
    return;
  }

  root.innerHTML = `<h2>Queue</h2>` + queue.map((sample) => `
    <article class="card" data-id="${sample.id}">
      <p><strong>${sample.feature}</strong> · ${sample.model}</p>
      <p><em>Q:</em> ${sample.question}</p>
      <p><em>Context:</em> ${sample.context}</p>
      <p><em>Output:</em> ${sample.output}</p>
      <form class="score-form">
        <div class="row">${dimInputs(rubric)}</div>
        <div>${tagInputs(rubric)}</div>
        <label>Note <input type="text" name="note" placeholder="optional" /></label>
        <p><button type="submit">Save score</button></p>
      </form>
    </article>
  `).join("");

  root.querySelectorAll(".score-form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const article = form.closest("[data-id]");
      const scores = {};
      rubric.dimensions.forEach((d) => {
        scores[d.id] = Number(form.elements[d.id].value);
      });
      const failureTags = [...form.querySelectorAll('input[name="tag"]:checked')].map(
        (el) => el.value
      );
      await api("/score", {
        method: "POST",
        body: JSON.stringify({
          sampleId: article.dataset.id,
          scores,
          failureTags,
          note: form.elements.note.value,
        }),
      });
      render();
    });
  });
}

render().catch((err) => {
  document.getElementById("queue").textContent =
    "Start the server with npm run server, then reload. " + err.message;
});
