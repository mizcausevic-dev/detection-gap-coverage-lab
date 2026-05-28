import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { DetectionCoverageExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): DetectionCoverageExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as DetectionCoverageExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts surfaces and gaps", () => {
    const report = analyze(fixture("detection-coverage.json"), { now: NOW });
    expect(report.surfaces).toBe(2);
    expect(report.healthySurfaces).toBe(1);
    expect(report.gaps).toBe(6);
  });

  it("flags missing healthy surfaces as high", () => {
    const report = analyze({ surfaces: [], gaps: [] }, { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "no-healthy-surface")?.severity).toBe("high");
  });

  it("flags degraded telemetry", () => {
    const report = analyze(fixture("detection-coverage.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "telemetry-gap")?.scope).toBe("EMEA workforce collaboration");
  });

  it("flags identity, endpoint, cloud, and automation gaps", () => {
    const report = analyze(fixture("detection-coverage.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "identity-gap")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "endpoint-gap")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "cloud-gap")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "automation-gap")).toBeDefined();
  });

  it("flags stale active gaps", () => {
    const report = analyze(fixture("detection-coverage.json"), { now: NOW, staleDetectionAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "stale-active-gap")).toBeDefined();
  });

  it("ok=true on a clean fixture", () => {
    const report = analyze(fixture("detection-coverage-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("toMarkdown ranks high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("detection-coverage.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("🟠"));
  });

  it("toSummary emits a one-liner", () => {
    const summary = toSummary(analyze(fixture("detection-coverage.json"), { now: NOW }));
    expect(summary).toMatch(/surfaces/);
    expect(summary).toMatch(/gaps/);
  });
});
