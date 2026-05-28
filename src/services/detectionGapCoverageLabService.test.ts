// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import { coverageGaps, detectionLane, payload, summary, verification } from "./detectionGapCoverageLabService.js";

describe("detectionGapCoverageLabService", () => {
  test("summary reflects the sample coverage posture", () => {
    const metrics = summary();
    expect(metrics.surfaces).toBe(2);
    expect(metrics.healthySurfaces).toBe(1);
    expect(metrics.gaps).toBe(6);
  });

  test("lane and gap payloads stay populated", () => {
    expect(detectionLane().length).toBe(4);
    expect(coverageGaps().length).toBeGreaterThan(0);
    expect(payload().sample).toBeDefined();
  });

  test("verification stays honest about synthetic and vendor-neutral posture", () => {
    expect(verification().join(" ")).toContain("synthetic");
    expect(verification().join(" ")).toContain("vendor-neutral");
  });
});
