// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import { renderCoverageGaps, renderDocs, renderOverview } from "./render.js";

describe("render", () => {
  test("overview includes vendor-neutral detection framing", () => {
    expect(renderOverview()).toContain("Detection Gap Coverage Lab");
    expect(renderOverview()).toContain("vendor-neutral secops");
  });

  test("docs and gap routes use the new route and CLI names", () => {
    expect(renderDocs()).toContain("/detection-lane");
    expect(renderDocs()).toContain("detection-gap-coverage");
    expect(renderCoverageGaps()).toContain("Coverage Gaps");
  });
});
