// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { detectionLanePackets, incidentPackets, sampleDetectionCoveragePayload } from "../data/sampleDetectionCoverage.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleDetectionCoveragePayload, {
  now: NOW,
  staleDetectionAfterHours: 36
});

function severityRank(finding: Finding): number {
  return finding.severity === "high"
    ? 0
    : finding.severity === "medium"
      ? 1
      : finding.severity === "low"
        ? 2
        : 3;
}

export function summary() {
  return {
    surfaces: report.surfaces,
    healthySurfaces: report.healthySurfaces,
    gaps: report.gaps,
    highSeverityGaps: report.highSeverityGaps,
    automationGaps: report.automationGaps,
    staleGaps: report.staleGaps,
    recommendation:
      "Restore degraded telemetry, close privileged identity coverage gaps, repair collaboration ingestion, and stabilize incident automation before calling detection posture healthy."
  };
}

export function detectionLane() {
  return detectionLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "identity-lane") {
        return finding.code === "identity-gap" || finding.code === "high-severity-unassigned";
      }
      if (lane.id === "endpoint-lane") {
        return finding.code === "endpoint-gap" || finding.code === "stale-active-gap";
      }
      if (lane.id === "collab-lane") {
        return finding.code === "cloud-gap" || finding.code === "telemetry-gap";
      }
      if (lane.id === "automation-lane") {
        return finding.code === "automation-gap" || finding.code === "stale-active-gap";
      }
      return false;
    }).length
  }));
}

export function coverageGaps() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.owner ??
        (finding.code === "identity-gap"
          ? "Identity Detection Engineering"
          : finding.code === "endpoint-gap"
            ? "Security Platform"
            : finding.code === "cloud-gap"
              ? "Detection Engineering"
              : "Incident Automation")
    }));
}

export function incidentPosture() {
  return incidentPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline detection-coverage analyzer and CLI, not static copy alone.",
    "Surfaces and gaps are synthetic sample data only; no live tenant tokens, customer events, or production incidents are published.",
    "The control plane keeps telemetry reach, rule coverage, automation, and incident posture visible for SecOps stakeholders.",
    "This surface demonstrates vendor-neutral detection coverage, not a single-tool keyword page.",
    "It complements Defender, Sentinel, Entra, Intune, M365 retention, AWS security, and GCP proof with a reusable SecOps coverage primitive."
  ];
}

export function payload() {
  return {
    summary: summary(),
    detectionLane: detectionLane(),
    coverageGaps: coverageGaps(),
    incidentPosture: incidentPosture(),
    verification: verification(),
    sample: sampleDetectionCoveragePayload
  };
}
