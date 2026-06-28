# GitHub, gcloud, and VM UI Sync Record - 2026-06-28

## Purpose

Verify whether the current UI version is ready to push to GitHub, whether it can be synchronized to the Google Cloud VM, whether the admin workflow remains compatible, and how the original homepage carousel is handled after the homepage hero redesign.

## Scope

- Local branch: `main`
- GitHub remote: `origin` (`https://github.com/Rufeng081/project-fyp-mall.git`)
- Google Cloud project: `cobalt-bond-496703-n2`
- VM: `fyp-mall-vm`
- Zone: `asia-southeast1-b`
- Public IP checked: `34.143.225.11`

## GitHub Readiness and Push

The local `main` branch was checked against `origin/main` before pushing. There were no remote-only commits, and the local branch contained the completed UI optimization commits:

- `76f77a2 feat: enhance mall ui for fyp demo`
- `1a90706 refactor: refine homepage visual direction`
- `65bb4bc refactor: apply warm lifestyle homepage hero`

The branch was pushed successfully:

```text
To https://github.com/Rufeng081/project-fyp-mall.git
   6e061a4..65bb4bc  main -> main
```

The unrelated untracked file `report/D5_REWRITE_CONTEXT_20260627.md` was intentionally left untouched.

## Admin Compatibility Verification

The admin compatibility check covered both source code behavior and the live VM API.

Frontend behavior:

- `ElectronicMallVue/src/views/front/Front.vue` calls `/role` when a user token exists in `localStorage`.
- The resolved role is passed into `ElectronicMallVue/src/components/Navagation.vue`.
- `Navagation.vue` renders the top-level `Admin` entry when `role === "admin"`.
- The user dropdown also renders `Admin Dashboard` when `loginStatus && role === "admin"`.
- The router guard in `ElectronicMallVue/src/router/index.js` still protects `/manage` and only allows users whose `/role` response is `admin`.

Live VM API verification used the admin account and confirmed the role flow:

```json
{
  "loginStatus": 200,
  "loginCode": "200",
  "loginUser": "admin",
  "loginNickname": "Administrator",
  "tokenPresent": true,
  "roleStatus": 200,
  "roleCode": "200",
  "role": "admin"
}
```

Conclusion: the current version remains compatible with admin functionality. When an admin logs in and `/api/role` returns `admin`, the frontend has the required conditions to show both the navigation `Admin` entry and the dropdown `Admin Dashboard` entry.

## Original Homepage Carousel Handling

The original homepage carousel image rotation is no longer used as the visual hero.

Current behavior in `ElectronicMallVue/src/views/front/TopView.vue`:

- The homepage hero image is fixed to the local asset `@/resource/homepage-hero.png`.
- The user-supplied warm lifestyle hero image is displayed as the homepage visual hero.
- The component still requests `/api/carousel` and stores the response in `carousels`.
- Carousel data is still used as the first priority for the hero click target through `heroLink()`.
- If carousel data is unavailable, the hero click target falls back to the first available product.

Admin carousel management remains present in `ElectronicMallVue/src/views/manage/good/Carousel.vue`, and the backend carousel APIs are retained. Therefore, the carousel module is preserved for backend/admin compatibility, but its images no longer render as a rotating homepage hero.

## VM Sync and Deployment Verification

VM status was checked before sync:

```text
RUNNING 34.143.225.11
```

The VM repository at `/opt/project-fyp-mall` was fast-forwarded to the pushed GitHub version:

```text
6e061a4..65bb4bc
```

The VM repository had two untracked runtime directories before sync:

```text
?? backups/
?? uploads/
```

These runtime directories were left untouched.

Frontend verification on the VM:

- `npm run check:deployment`: passed
- `npm run check:ui`: passed, 28 checks passed
- `npm run build`: passed when run as repository owner `a206331`

One deployment issue was found during verification: running the build as the SSH default user caused a permission error when removing `ElectronicMallVue/dist/js`. The cause was user ownership/permission mismatch. The build was rerun as `a206331`, which passed successfully.

The built frontend was synchronized to `/var/www/project-fyp-mall`, ownership was set to `www-data:www-data`, and Nginx was reloaded.

Post-deployment checks:

```text
nginx: configuration file /etc/nginx/nginx.conf test is successful
active
www-data:www-data /var/www/project-fyp-mall/index.html
65bb4bc
```

Public endpoint checks:

```text
HTTP/1.1 200 OK
Content-Type: text/html
```

Hero image deployment check:

```text
-rw-rw-r-- 1 www-data www-data 2.1M Jun 28 06:49 /var/www/project-fyp-mall/img/homepage-hero.2c99bd90.png
HTTP/1.1 200 OK
Content-Type: image/png
Content-Length: 2195456
```

## Build Warnings

The VM build completed successfully, but retained existing Vue CLI production warnings:

- `caniuse-lite` / Browserslist data is outdated.
- Several bundles exceed Vue CLI recommended asset-size thresholds.
- The deployed `homepage-hero.2c99bd90.png` is approximately 2.1 MB.

These warnings do not block deployment, but the hero image can be compressed later if page-load performance needs further optimization.

## Result

The current UI version was pushed to GitHub, synchronized to the Google Cloud VM, built successfully on the VM, deployed through Nginx, and verified through public endpoint checks. Admin login and role compatibility were verified against the live VM API, and the homepage carousel handling is documented above.
