# Cloud Deployment Notes

This directory tracks Phase 4 cloud deployment diagnostics and runtime debugging notes.

## Current Checkpoint

As of 2026-05-20:

- Google Cloud VM provisioning is complete.
- The VM server stack is running with Nginx, Spring Boot, MySQL, and Redis.
- Public HTTP endpoint recorded during deployment: `http://34.143.225.11`.
- Public image/resource display has been fixed after production resource URLs were routed through `/api`, Nginx proxy behavior was documented, and backend upload storage was moved behind `MALL_UPLOAD_DIR`.
- Email verification service is configured through Brevo SMTP environment variables and uses the FYP-UKM Rufeng Mall Demo verification email template. VM runtime email sending requires `BREVO_SMTP_USERNAME`, `BREVO_SMTP_KEY`, and `BREVO_SENDER_EMAIL`.

Cloud runtime verification should continue to use these checks after future deployment changes:

- Frontend loads through the public IP.
- Product, carousel, avatar, and uploaded-resource images display from the VM.
- Avatar/file upload and retrieval use the VM, not browser-side `localhost`.
- Public API routing works for both shared Axios calls and legacy `/api/...` backend routes.
- Registration and forgot-password email codes send successfully when the VM SMTP environment variables are present.
- Login, product browsing, cart, order placement, simulated payment, and order history work through the browser.

## Files

| File | Purpose |
| --- | --- |
| [phase-4-vm-diagnostics-2026-05-19.md](phase-4-vm-diagnostics-2026-05-19.md) | Diagnostic findings, root causes, applied local fixes, VM repair commands, and verification commands for the image/resource issue. |

The raw VM diagnostic archive used on 2026-05-19 was summarized into the diagnostics report above and removed from the tracked repository during documentation cleanup.

Related records:

- [../reports/phase-4-cloud-deployment-report.md](../reports/phase-4-cloud-deployment-report.md)
- [../engineering/cloud-deployment-guide.md](../engineering/cloud-deployment-guide.md)
