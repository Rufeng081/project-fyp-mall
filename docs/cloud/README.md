# Cloud Deployment Notes

This directory tracks Phase 4 cloud deployment diagnostics and runtime debugging notes.

## Current Checkpoint

As of 2026-06-15:

- Google Cloud VM provisioning is complete.
- The VM server stack is running with Nginx, Spring Boot, MySQL, and Redis.
- Public HTTP endpoint recorded during deployment: `http://34.143.225.11`.
- Public image/resource display has been fixed after production resource URLs were routed through `/api`, Nginx proxy behavior was documented, and backend upload storage was moved behind `MALL_UPLOAD_DIR`.
- Email verification service is configured through Brevo SMTP environment variables and uses the FYP-UKM Rufeng Mall Demo verification email template. VM runtime email sending requires `BREVO_SMTP_USERNAME`, `BREVO_SMTP_KEY`, and `BREVO_SENDER_EMAIL`.
- The active Spring Boot systemd unit on the VM is `project-fyp-mall.service`.
- A stale Redis product cache key from the old Java package namespace was removed on 2026-06-15; product detail API `/api/api/good/3` returned HTTP 200 after the cache cleanup.
- phpMyAdmin is installed for browser-based MySQL administration at `http://34.143.225.11/phpmyadmin/`; Nginx remains the public HTTP server on port `80`, while Apache serves phpMyAdmin only on `127.0.0.1:8081`.

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
| [phase-4-vm-diagnostics-2026-05-19.md](phase-4-vm-diagnostics-2026-05-19.md) | Diagnostic findings, root causes, applied fixes, VM repair commands, and verification commands for image/resource routing and the 2026-06-15 stale Redis product-cache issue. |
| [phpmyadmin-admin-setup-2026-06-15.md](phpmyadmin-admin-setup-2026-06-15.md) | phpMyAdmin installation, Apache localhost-only configuration, Nginx `/phpmyadmin/` proxy, MySQL admin-user scope, verification, and rollback notes. |

The raw VM diagnostic archive used on 2026-05-19 was summarized into the diagnostics report above and removed from the tracked repository during documentation cleanup.

Related records:

- [../reports/phase-4-cloud-deployment-report.md](../reports/phase-4-cloud-deployment-report.md)
- [../engineering/cloud-deployment-guide.md](../engineering/cloud-deployment-guide.md)
