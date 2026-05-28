# Security Policy

`detection-gap-coverage-lab` ships both an offline analyzer and a synthetic public dashboard surface. It reads JSON exports from detection-surface and incident-workflow snapshots (or synthetic data) and emits structured findings, route JSON, and prerendered HTML. No live tenant credential storage, no remote fetch of customer telemetry, and no execution of user-supplied code is included.

## Reporting

- [Open a security advisory](https://github.com/mizcausevic-dev/detection-gap-coverage-lab/security/advisories/new)
- Or create a private report through the GitHub Security tab if enabled

## Scope and posture

- The public dashboard is a static proof surface, not a live bridge into a production SIEM, XDR, or SOC console.
- Do not place real workspace credentials, customer events, incident artifacts, or production exports in this repository.
- Sample data and screenshots are synthetic and meant only to demonstrate operator-surface behavior.
