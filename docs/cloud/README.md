# Cloud Deployment Notes

This directory tracks Phase 4 cloud deployment diagnostics and runtime debugging notes.

## Current Checkpoint

As of 2026-05-20:

- Google Cloud VM provisioning is complete.
- The VM server stack is running with Nginx, Spring Boot, MySQL, and Redis.
- Public HTTP endpoint recorded during deployment: `http://34.143.225.11`.
- Current blocker: public images/resources fail to display on the public deployment.
- Active diagnosis area: production resource URLs, Nginx proxy paths, and backend persistent upload storage.

Phase 4 should remain in progress until the public deployment verifies:

- Frontend loads through the public IP.
- Product, carousel, avatar, and uploaded-resource images display from the VM.
- Avatar/file upload and retrieval use the VM, not browser-side `localhost`.
- Public API routing works for both shared Axios calls and legacy `/api/...` backend routes.
- Login, product browsing, cart, order placement, simulated payment, and order history work through the browser.

## Files

| File | Purpose |
| --- | --- |
| [phase-4-vm-diagnostics-2026-05-19.md](phase-4-vm-diagnostics-2026-05-19.md) | Diagnostic findings, root causes, applied local fixes, VM repair commands, and verification commands for the current cloud runtime issues. |

The raw VM diagnostic archive used on 2026-05-19 was summarized into the diagnostics report above and removed from the tracked repository during documentation cleanup.

Related records:

- [../records/phase-4-cloud-deployment-handoff-2026-05-19.md](../records/phase-4-cloud-deployment-handoff-2026-05-19.md)
- [../reports/phase-4-cloud-deployment-report.md](../reports/phase-4-cloud-deployment-report.md)
- [../engineering/cloud-deployment-guide.md](../engineering/cloud-deployment-guide.md)
