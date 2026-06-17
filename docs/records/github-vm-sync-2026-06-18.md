# GitHub and VM Sync Record - 2026-06-18

## Purpose

Push the completed demo-readiness and Phase 6/JMeter work to GitHub, then synchronize the Google Cloud VM so the server repository, backend runtime, and frontend static files match the pushed project version.

## Scope

- Local branch: `phase6-jmeter-completion`, fast-forwarded into `main`.
- GitHub repository: `Rufeng081/project-fyp-mall`.
- VM: `fyp-mall-vm`, zone `asia-southeast1-b`.
- VM repository path: `/opt/project-fyp-mall`.
- Public endpoint: `http://34.143.225.11/`.

## Operation Log

| Step | Action | Result |
|---|---|---|
| 1 | Staged completed Phase 6 and demo-readiness changes. | 29 files staged; raw JMeter `.jtl`, HTML reports, and downloaded JMeter binaries stayed ignored. |
| 2 | Committed local changes. | Created commit `ec7cb11` with message `Complete Phase 6 JMeter evaluation`. |
| 3 | Fast-forwarded local `main`. | `main` updated from `5e8a73b` to `ec7cb11`. |
| 4 | Pushed to GitHub. | `origin/main` updated from `5e8a73b` to `ec7cb11`. |
| 5 | Checked VM repository state before pull. | VM repository was at `5e8a73b`; untracked `backups/` and `uploads/` runtime directories were preserved. |
| 6 | Diagnosed first VM pull failure. | `git fetch` failed because `/opt/project-fyp-mall` is owned by `a206331`, while SSH used user `rufeng`. |
| 7 | Pulled as repository owner. | `sudo -u a206331 git fetch origin` and `sudo -u a206331 git pull --ff-only origin main` fast-forwarded VM to `ec7cb11`. |
| 8 | Rebuilt backend on VM. | `mvn -q clean package` completed. |
| 9 | Checked and rebuilt frontend on VM. | `npm run check:deployment` passed; `npm run build` completed with existing Browserslist and asset-size warnings. |
| 10 | Synced frontend static files. | Vue `dist/` was rsynced to `/var/www/project-fyp-mall/` and ownership reset to `www-data`. |
| 11 | Preserved upload storage. | `/opt/project-fyp-mall/uploads/file` and `/opt/project-fyp-mall/uploads/avatar` were ensured and kept owned by `www-data`. |
| 12 | Restarted/reloaded services. | `project-fyp-mall.service` restarted; `nginx -t` passed; Nginx reloaded. |
| 13 | Verified server state. | VM HEAD was `ec7cb11`; `nginx`, `project-fyp-mall.service`, `mysql`, and `redis-server` were active. |
| 14 | Verified runtime endpoint. | Local VM homepage check returned HTTP `200`; product API returned JSON containing `"code":"200"`. |
| 15 | Checked recent backend warnings/errors. | `journalctl -u project-fyp-mall.service --since '5 minutes ago' -p warning` returned no entries. |
| 16 | Added and synchronized this operation record. | A follow-up docs-only commit was pushed and pulled so GitHub and the VM repository also contain the sync evidence. No backend/frontend rebuild was needed for the docs-only update. |

## Notes

- GitHub CLI `gh` was installed, but its token for `Rufeng081` was invalid. Direct `git push` succeeded, so no `gh` re-authentication was required for this sync.
- The VM repository has untracked runtime directories `backups/` and `uploads/`; they were intentionally not removed.
- The frontend build warnings are the same known non-blocking warnings already documented: outdated Browserslist data and large bundled assets/images.

## Final State

| Target | Version |
|---|---|
| Local `main` | Same final docs-synchronized `main` commit as GitHub and VM |
| GitHub `origin/main` | Same final docs-synchronized `main` commit as local and VM |
| VM repository | Same final docs-synchronized `main` commit as local and GitHub |
| Backend runtime | Rebuilt and restarted from `ec7cb11` |
| Frontend runtime | Rebuilt from `ec7cb11` and synced to Nginx web root |
