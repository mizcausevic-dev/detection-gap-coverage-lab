import type {
  CoverageOptions,
  CoverageReport,
  CoverageSurface,
  DetectionCoverageExport,
  DetectionGap,
  DetectionStatus,
  Finding
} from "./types.js";

const HOUR_MS = 3_600_000;

function emptyStatusCounts(): Record<DetectionStatus, number> {
  return {
    ACTIVE: 0,
    RESOLVED: 0
  };
}

function lastUpdatedAt(gap: DetectionGap): Date {
  return new Date(gap.updatedAt ?? gap.createdAt);
}

function surfaceHasDomain(surface: CoverageSurface, domain: string): boolean {
  return surface.domains.includes(domain);
}

export function analyze(input: DetectionCoverageExport, opts: CoverageOptions = {}): CoverageReport {
  const now = opts.now ? new Date(opts.now) : new Date();
  const staleAfter = (opts.staleDetectionAfterHours ?? 48) * HOUR_MS;

  const surfaces = input.surfaces ?? [];
  const gaps = input.gaps ?? [];
  const findingsList: Finding[] = [];
  const detectionsByStatus = emptyStatusCounts();

  const healthySurfaces = surfaces.filter((surface) => surface.status === "HEALTHY");
  const activeGaps = gaps.filter((gap) => gap.status === "ACTIVE");
  const highSeverityGaps = activeGaps.filter((gap) => gap.severity === "high");
  const automationGaps = surfaces.filter((surface) => surface.status === "DEGRADED" || !surface.automationEnabled).length;

  if (healthySurfaces.length === 0) {
    findingsList.push({
      code: "no-healthy-surface",
      severity: "high",
      message: "No healthy detection surface is active for the captured SecOps scope.",
      subject: "surfaces"
    });
  }

  for (const surface of surfaces) {
    if (surface.status === "DEGRADED") {
      findingsList.push({
        code: "telemetry-gap",
        severity: "medium",
        message: `${surface.platform} surface in ${surface.scope} is degraded and not carrying healthy telemetry coverage.`,
        subject: surface.id,
        subjectName: surface.owner,
        scope: surface.scope,
        owner: surface.owner
      });
    }

    if (surface.status === "HEALTHY" && !surfaceHasDomain(surface, "IDENTITY")) {
      findingsList.push({
        code: "identity-gap",
        severity: "medium",
        message: `${surface.platform} surface in ${surface.scope} is missing identity-detection coverage for privileged access and auth posture.`,
        subject: surface.id,
        subjectName: surface.owner,
        scope: surface.scope,
        owner: surface.owner
      });
    }

    if (surface.status === "HEALTHY" && !surfaceHasDomain(surface, "ENDPOINT")) {
      findingsList.push({
        code: "endpoint-gap",
        severity: "medium",
        message: `${surface.platform} surface in ${surface.scope} is missing endpoint telemetry coverage for device and server detections.`,
        subject: surface.id,
        subjectName: surface.owner,
        scope: surface.scope,
        owner: surface.owner
      });
    }

    if (!surface.automationEnabled) {
      findingsList.push({
        code: "automation-gap",
        severity: "medium",
        message: `${surface.platform} surface in ${surface.scope} is missing healthy incident-playbook automation coverage.`,
        subject: surface.id,
        subjectName: surface.owner,
        scope: surface.scope,
        owner: surface.owner
      });
    }
  }

  for (const gap of gaps) {
    detectionsByStatus[gap.status] += 1;

    if (gap.status !== "ACTIVE") {
      continue;
    }

    if (gap.domain === "IDENTITY") {
      findingsList.push({
        code: "identity-gap",
        severity: gap.severity,
        message: `Identity detection coverage around "${gap.asset}" still needs confirmation before the SecOps lane can call posture healthy.`,
        subject: gap.id,
        subjectName: gap.asset,
        scope: gap.scope,
        principal: gap.principal,
        owner: gap.owner
      });
    }

    if (gap.domain === "ENDPOINT") {
      findingsList.push({
        code: "endpoint-gap",
        severity: gap.severity,
        message: `Endpoint detection coverage for "${gap.asset}" remains incomplete and needs a tighter containment path.`,
        subject: gap.id,
        subjectName: gap.asset,
        scope: gap.scope,
        owner: gap.owner
      });
    }

    if (gap.domain === "CLOUD" || gap.domain === "EMAIL" || gap.domain === "SAAS") {
      findingsList.push({
        code: "cloud-gap",
        severity: gap.severity,
        message: `Cloud, SaaS, or collaboration coverage for "${gap.asset}" remains incomplete and may leave the response lane blind to pivots.`,
        subject: gap.id,
        subjectName: gap.asset,
        scope: gap.scope,
        owner: gap.owner
      });
    }

    if (gap.controlKind === "Playbook" || gap.controlKind === "Incident") {
      findingsList.push({
        code: "automation-gap",
        severity: gap.severity,
        message: `Incident automation around "${gap.asset}" is still missing enough playbook proof for response confidence.`,
        subject: gap.id,
        subjectName: gap.asset,
        scope: gap.scope,
        owner: gap.owner
      });
    }

    if (!gap.owner && gap.severity === "high") {
      findingsList.push({
        code: "high-severity-unassigned",
        severity: "medium",
        message: `High-severity gap "${gap.title}" still has no assigned owner.`,
        subject: gap.id,
        subjectName: gap.asset,
        scope: gap.scope
      });
    }

    if (now.getTime() - lastUpdatedAt(gap).getTime() > staleAfter) {
      findingsList.push({
        code: "stale-active-gap",
        severity: "medium",
        message: `Gap "${gap.title}" has remained active since ${lastUpdatedAt(gap).toISOString().slice(0, 16)}Z.`,
        subject: gap.id,
        subjectName: gap.asset,
        scope: gap.scope,
        owner: gap.owner
      });
    }
  }

  const staleGaps = activeGaps.filter((gap) => now.getTime() - lastUpdatedAt(gap).getTime() > staleAfter).length;

  return {
    generatedAt: now.toISOString(),
    surfaces: surfaces.length,
    healthySurfaces: healthySurfaces.length,
    gaps: gaps.length,
    detectionsByStatus,
    highSeverityGaps: highSeverityGaps.length,
    automationGaps,
    staleGaps,
    findingsList,
    ok: !findingsList.some((finding) => finding.severity === "high")
  };
}
