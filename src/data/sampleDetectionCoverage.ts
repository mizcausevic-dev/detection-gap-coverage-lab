import type { DetectionCoverageExport } from "../types.js";

export const sampleDetectionCoveragePayload: DetectionCoverageExport = {
  surfaces: [
    {
      id: "surf-core-xdr",
      platform: "XDR core",
      scope: "Global SecOps control plane",
      status: "HEALTHY",
      domains: ["IDENTITY", "ENDPOINT", "NETWORK", "CLOUD"],
      owner: "Security Platform",
      automationEnabled: true
    },
    {
      id: "surf-emea-collab",
      platform: "Collaboration telemetry",
      scope: "EMEA workforce collaboration",
      status: "DEGRADED",
      domains: ["IDENTITY", "EMAIL", "SAAS"],
      owner: "Detection Engineering",
      automationEnabled: false
    }
  ],
  gaps: [
    {
      id: "dg-001",
      category: "Identity",
      title: "Privileged access anomaly coverage is missing an approved containment owner",
      scope: "Global SecOps control plane",
      severity: "high",
      status: "ACTIVE",
      controlKind: "Rule",
      asset: "Privileged access analytics",
      principal: "global-admins@kineticgain.com",
      domain: "IDENTITY",
      createdAt: "2026-05-26T09:10:00Z",
      updatedAt: "2026-05-26T10:35:00Z",
      owner: "Identity Detection Engineering",
      note: "Reconcile analytics tuning before the next admin review window."
    },
    {
      id: "dg-002",
      category: "Endpoint",
      title: "Server telemetry connector drift on finance reporting nodes",
      scope: "Global SecOps control plane",
      severity: "medium",
      status: "ACTIVE",
      controlKind: "Connector",
      asset: "Endpoint telemetry connector",
      domain: "ENDPOINT",
      createdAt: "2026-05-25T20:15:00Z",
      updatedAt: "2026-05-25T21:00:00Z",
      owner: "Security Platform",
      note: "Restore connector health before the next reporting cycle."
    },
    {
      id: "dg-003",
      category: "SaaS",
      title: "Collaboration audit connector is not ingesting enough detection events",
      scope: "EMEA workforce collaboration",
      severity: "medium",
      status: "ACTIVE",
      controlKind: "Connector",
      asset: "Collaboration audit connector",
      domain: "SAAS",
      createdAt: "2026-05-24T22:00:00Z",
      updatedAt: "2026-05-24T22:40:00Z",
      owner: "Detection Engineering",
      note: "Restore event flow and confirm mailbox rule coverage."
    },
    {
      id: "dg-004",
      category: "Automation",
      title: "Incident playbook is incomplete for high-confidence phishing detections",
      scope: "EMEA workforce collaboration",
      severity: "high",
      status: "ACTIVE",
      controlKind: "Playbook",
      asset: "Phishing incident playbook",
      domain: "EMAIL",
      createdAt: "2026-05-24T08:30:00Z",
      updatedAt: "2026-05-24T09:15:00Z",
      owner: "Incident Automation",
      note: "Resolve playbook drift before broad workforce campaigns resume."
    },
    {
      id: "dg-005",
      category: "Cloud",
      title: "Cloud correlation queue remains active without verified closure",
      scope: "Global SecOps control plane",
      severity: "high",
      status: "ACTIVE",
      controlKind: "Incident",
      asset: "Cloud correlation incident queue",
      domain: "CLOUD",
      createdAt: "2026-05-23T12:00:00Z",
      updatedAt: "2026-05-23T12:20:00Z",
      note: "Incident queue still lacks final ownership proof."
    },
    {
      id: "dg-006",
      category: "Identity",
      title: "Legacy guest anomaly replay reviewed and closed",
      scope: "EMEA workforce collaboration",
      severity: "low",
      status: "RESOLVED",
      controlKind: "Rule",
      asset: "Guest access anomaly",
      principal: "legacy-guest#EXT#@kineticgain.onmicrosoft.com",
      domain: "IDENTITY",
      createdAt: "2026-05-20T12:00:00Z",
      updatedAt: "2026-05-21T08:00:00Z",
      owner: "Identity Detection Engineering"
    }
  ]
};

export const detectionLanePackets = [
  {
    id: "identity-lane",
    lane: "Identity detection lane",
    owner: "Identity Detection Engineering",
    focus: "Privileged access detections, anomaly coverage, and rule ownership.",
    status: "red",
    note: "Identity analytics still carry unresolved coverage and owner pressure.",
    nextAction: "Reconcile analytics tuning and privileged access ownership before the next admin review window."
  },
  {
    id: "endpoint-lane",
    lane: "Endpoint coverage lane",
    owner: "Security Platform",
    focus: "Connector health, server telemetry, and endpoint evidence completeness.",
    status: "yellow",
    note: "Endpoint coverage is recoverable, but connector drift is still blocking full trust.",
    nextAction: "Restore endpoint connector health and verify finance node telemetry."
  },
  {
    id: "collab-lane",
    lane: "SaaS and collaboration lane",
    owner: "Detection Engineering",
    focus: "Email audit events, SaaS detections, and collaboration visibility.",
    status: "red",
    note: "Collaboration event flow is degraded and detection coverage is incomplete.",
    nextAction: "Repair audit ingestion and confirm collaboration detections before external workforce changes expand."
  },
  {
    id: "automation-lane",
    lane: "Incident automation lane",
    owner: "Incident Automation",
    focus: "Playbook readiness, incident closure evidence, and response confidence.",
    status: "red",
    note: "Playbook drift and incident-closure proof are still below the desired bar.",
    nextAction: "Repair incident playbook execution and close the stale cloud queue."
  }
];

export const incidentPackets = [
  {
    packetId: "DG-11",
    lane: "Privileged access tuning packet",
    owner: "Identity Detection Engineering",
    completenessScore: 67,
    status: "red",
    blocker: "Privileged access anomaly coverage is still missing final owner approval.",
    launchWindowHours: 6,
    decisionNote: "Do not wait for the weekly governance review before tightening privileged identity detections."
  },
  {
    packetId: "DG-18",
    lane: "Endpoint connector recovery packet",
    owner: "Security Platform",
    completenessScore: 81,
    status: "yellow",
    blocker: "Finance-server telemetry is partially restored, but connector proof is not complete yet.",
    launchWindowHours: 10,
    decisionNote: "Connector recovery can clear once the endpoint evidence lands in the surface."
  },
  {
    packetId: "DG-24",
    lane: "Collaboration ingestion packet",
    owner: "Detection Engineering",
    completenessScore: 59,
    status: "red",
    blocker: "Collaboration audit flow is still inconsistent across the EMEA tenant.",
    launchWindowHours: 8,
    decisionNote: "Hold broader collaboration rollout until audit ingestion is healthy again."
  },
  {
    packetId: "DG-31",
    lane: "Incident playbook packet",
    owner: "Incident Automation",
    completenessScore: 73,
    status: "red",
    blocker: "High-confidence phishing playbook drift is still unresolved in the response queue.",
    launchWindowHours: 4,
    decisionNote: "Repair incident automation before more high-confidence detections queue without closure proof."
  }
];
