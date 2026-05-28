// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import {
  coverageGaps,
  detectionLane,
  incidentPosture,
  payload,
  summary,
  verification
} from "./services/detectionGapCoverageLabService.js";
import {
  renderCoverageGaps,
  renderDetectionLane,
  renderDocs,
  renderIncidentPosture,
  renderOverview,
  renderVerification
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5520);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/detection-lane", (_req, res) => res.type("html").send(renderDetectionLane()));
app.get("/coverage-gaps", (_req, res) => res.type("html").send(renderCoverageGaps()));
app.get("/incident-posture", (_req, res) => res.type("html").send(renderIncidentPosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/detection-lane", (_req, res) => res.json(detectionLane()));
app.get("/api/coverage-gaps", (_req, res) => res.json(coverageGaps()));
app.get("/api/incident-posture", (_req, res) => res.json(incidentPosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`Detection Gap Coverage Lab listening on http://${host}:${port}`);
  });
}

export default app;
