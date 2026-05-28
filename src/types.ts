// Vendor-neutral operator surface for detection coverage posture.
//
// Inputs reflect synthetic exports or captured snapshots for:
//   - monitoring domain health and telemetry reach
//   - detections, incidents, and automation coverage

export type SurfaceStatus = "HEALTHY" | "DEGRADED";
export type DetectionStatus = "ACTIVE" | "RESOLVED";
export type DetectionSeverity = "high" | "medium" | "low" | "info";
export type ControlKind = "Rule" | "Connector" | "Playbook" | "Surface" | "Incident" | string;
export type DetectionDomain = "IDENTITY" | "ENDPOINT" | "EMAIL" | "CLOUD" | "NETWORK" | "SAAS" | string;

export interface CoverageSurface {
  id: string;
  platform: string;
  scope: string;
  status: SurfaceStatus;
  domains: DetectionDomain[];
  owner: string;
  automationEnabled: boolean;
}

export interface DetectionGap {
  id: string;
  category: string;
  title: string;
  scope: string;
  severity: DetectionSeverity;
  status: DetectionStatus;
  controlKind: ControlKind;
  asset: string;
  principal?: string;
  domain?: DetectionDomain;
  createdAt: string;
  updatedAt?: string;
  owner?: string;
  note?: string;
}

export interface DetectionCoverageExport {
  surfaces?: CoverageSurface[];
  gaps?: DetectionGap[];
}

export type DetectionCode =
  | "no-healthy-surface"
  | "telemetry-gap"
  | "identity-gap"
  | "endpoint-gap"
  | "cloud-gap"
  | "automation-gap"
  | "high-severity-unassigned"
  | "stale-active-gap";

export interface Finding {
  code: DetectionCode;
  severity: DetectionSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: string;
  principal?: string;
  owner?: string;
}

export interface CoverageReport {
  generatedAt: string;
  surfaces: number;
  healthySurfaces: number;
  gaps: number;
  detectionsByStatus: Record<DetectionStatus, number>;
  highSeverityGaps: number;
  automationGaps: number;
  staleGaps: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface CoverageOptions {
  now?: string;
  staleDetectionAfterHours?: number;
}
