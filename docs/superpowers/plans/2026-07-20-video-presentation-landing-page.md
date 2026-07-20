# R Mall Video Presentation Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, publish, and deploy a verified static presentation page at `http://34.143.225.11/LandingPage/` without changing the existing mall application.

**Architecture:** A dependency-free `LandingPage/` directory contains semantic HTML, a token-based responsive stylesheet, minimal progressive-enhancement JavaScript, and a Node verification script. Nginx serves it from a dedicated alias before the existing Vue SPA fallback; evidence values remain traceable to the retained Phase 6 CSV and reports.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js verification, Nginx, Git/GitHub, Google Cloud CLI.

---

## File Structure

- `LandingPage/index.html` — semantic presentation content and accessible data descriptions.
- `LandingPage/styles.css` — approved Navy and Architectural Stone design, responsive layouts, chart bars, focus and reduced-motion states.
- `LandingPage/script.js` — sticky chapter-state enhancement and current-year-free static behavior.
- `LandingPage/tests/verify-content.js` — content, evidence, privacy, asset, anchor, and external-request regression checks.
- `LandingPage/README.md` — local preview, evidence provenance, and deployment notes.
- `deploy/nginx/project-fyp-mall.conf` — dedicated `/LandingPage` redirect and `/LandingPage/` static alias.
- `deploy/README.md` — repeatable landing-page deployment and production verification commands.

### Task 1: Establish evidence and privacy regression tests

**Files:**
- Create: `LandingPage/tests/verify-content.js`

- [ ] **Step 1: Write a failing verification script**

Create a Node script that reads `LandingPage/index.html`, `styles.css`, and `script.js` and asserts:

```js
const requiredClaims = [
  '3,197', 'JMeter sampler executions', '35 summarized result rows',
  '0 JMeter errors observed', '441', '1,882', '1,986',
  '2,457', '3,116', '3,400', '3,659'
];

const prohibitedClaims = [
  '3,197 test runs', '3,197 users', 'the system has zero errors',
  'supports 200 users', 'Evidence policy', 'Claims that will not be used'
];
```

The script must also reject external `http(s)` assets, missing local file references, missing internal anchor targets, purple color tokens, gradients, and privacy-sensitive labels such as student names, email addresses, public IP addresses, or institution branding.

- [ ] **Step 2: Run the verification script and confirm the RED state**

Run:

```bash
node LandingPage/tests/verify-content.js
```

Expected: non-zero exit because `LandingPage/index.html`, `styles.css`, and `script.js` do not exist.

- [ ] **Step 3: Commit the failing test**

```bash
git add LandingPage/tests/verify-content.js
git commit -m "test: define landing page evidence requirements"
```

### Task 2: Build the semantic presentation content

**Files:**
- Create: `LandingPage/index.html`

- [ ] **Step 1: Implement the minimum semantic page that satisfies content requirements**

The document must contain:

```html
<header class="site-header">...</header>
<main id="main-content">
  <section id="overview">...</section>
  <section id="method">...</section>
  <section id="architecture">...</section>
  <section id="results">...</section>
  <section id="conclusion">...</section>
</main>
```

Use the exact evidence terminology approved in the design specification. Include scenario names, thread counts, values, units, the test date, source filenames, and the single-VM HTTP academic-prototype limitation. Add a screen-reader summary before the visual P90 bars.

- [ ] **Step 2: Run the verification script**

Run:

```bash
node LandingPage/tests/verify-content.js
```

Expected: still fails because required CSS and JavaScript assets are absent.

### Task 3: Implement the approved visual system and responsive behavior

**Files:**
- Create: `LandingPage/styles.css`
- Create: `LandingPage/script.js`

- [ ] **Step 1: Add the Navy and Architectural Stone design tokens**

Use semantic tokens equivalent to:

```css
:root {
  --ink: #16263a;
  --ink-soft: #466273;
  --stone-50: #f5f5f2;
  --stone-100: #eceeeb;
  --stone-300: #b6c1c1;
  --line: #c8cecd;
  --text-muted: #56646b;
  --focus: #9b5b22;
}
```

Do not use purple, gradients, glow, glass effects, external fonts, background illustrations, or excessive card rounding.

- [ ] **Step 2: Add responsive layouts and accessible states**

Implement a maximum-width content frame, 16:9-friendly section sizing, a sticky chapter header, direct-labelled horizontal data bars, visible keyboard focus, a skip link, mobile stacking at `768px`, and overflow-safe behavior at `375px`.

- [ ] **Step 3: Add minimal progressive enhancement**

`script.js` must use `IntersectionObserver` only to mark the visible chapter link with `aria-current="location"`. The document remains fully readable without JavaScript.

- [ ] **Step 4: Run content verification and confirm GREEN**

Run:

```bash
node LandingPage/tests/verify-content.js
```

Expected: `Landing page verification passed` with zero failures.

- [ ] **Step 5: Commit the page implementation**

```bash
git add LandingPage/index.html LandingPage/styles.css LandingPage/script.js LandingPage/tests/verify-content.js
git commit -m "feat: add verified video presentation landing page"
```

### Task 4: Document provenance and local use

**Files:**
- Create: `LandingPage/README.md`

- [ ] **Step 1: Document evidence provenance and preview commands**

The README must explain that data comes from the Phase 6 aggregate CSV, summary table, execution record, and performance report. It must define `sampler execution`, list the tested concurrency matrix, state the HTTP single-VM limitation, and provide:

```bash
python3 -m http.server 8088 --directory LandingPage
```

- [ ] **Step 2: Extend verification to require the provenance document**

Add assertions that the README names all four canonical evidence categories and contains no prohibited claims.

- [ ] **Step 3: Run verification**

Run:

```bash
node LandingPage/tests/verify-content.js
```

Expected: pass.

- [ ] **Step 4: Commit documentation**

```bash
git add LandingPage/README.md LandingPage/tests/verify-content.js
git commit -m "docs: document landing page evidence provenance"
```

### Task 5: Add isolated Nginx routing and deployment documentation

**Files:**
- Modify: `deploy/nginx/project-fyp-mall.conf`
- Modify: `deploy/README.md`
- Modify: `LandingPage/tests/verify-content.js`

- [ ] **Step 1: Write failing deployment assertions**

Require the Nginx file to contain an exact redirect and a static alias:

```nginx
location = /LandingPage {
    return 301 /LandingPage/;
}

location ^~ /LandingPage/ {
    alias /var/www/project-fyp-mall-landing/;
    index index.html;
}
```

Run the test and confirm failure before modifying Nginx.

- [ ] **Step 2: Add the Nginx locations before the root SPA fallback**

Do not modify `/api/` proxy behavior or the existing Vue root.

- [ ] **Step 3: Add deployment commands**

Document the sequence:

```bash
sudo mkdir -p /var/www/project-fyp-mall-landing
sudo rsync -a --delete LandingPage/ /var/www/project-fyp-mall-landing/ --exclude tests --exclude README.md
sudo chown -R www-data:www-data /var/www/project-fyp-mall-landing
sudo cp deploy/nginx/project-fyp-mall.conf /etc/nginx/sites-available/project-fyp-mall
sudo nginx -t
sudo systemctl reload nginx
```

- [ ] **Step 4: Run verification and commit**

```bash
node LandingPage/tests/verify-content.js
git add deploy/nginx/project-fyp-mall.conf deploy/README.md LandingPage/tests/verify-content.js
git commit -m "deploy: serve presentation landing page with nginx"
```

### Task 6: Perform local functional and visual verification

**Files:**
- Modify as needed only when verification exposes an issue.

- [ ] **Step 1: Run the complete static verification**

```bash
node LandingPage/tests/verify-content.js
```

- [ ] **Step 2: Start a local static server**

```bash
python3 -m http.server 8088 --directory LandingPage
```

- [ ] **Step 3: Inspect at required viewports**

Check 375×812, 768×1024, 1440×900, and 1920×1080. Verify chapter navigation, focus order, direct chart labels, no horizontal overflow, no external network requests, and reduced-motion behavior.

- [ ] **Step 4: Run existing frontend regression checks**

```bash
cd ElectronicMallVue
npm run check:deployment
npm run check:routes
npm run build
```

- [ ] **Step 5: Run whitespace and repository-scope checks**

```bash
git diff --check
git status --short
```

### Task 7: Publish the scoped implementation to GitHub

**Files:**
- No new files.

- [ ] **Step 1: Review committed scope**

```bash
git log --oneline main..HEAD
git diff --stat main...HEAD
```

Confirm unrelated report artifacts and `.superpowers/` are absent.

- [ ] **Step 2: Push the feature branch**

```bash
git push -u origin codex/video-presentation-landing
```

Expected: GitHub accepts the branch and reports its upstream.

### Task 8: Deploy to the Google Cloud VM and verify production

**Files:**
- No repository changes unless production verification exposes a defect.

- [ ] **Step 1: Confirm active Google Cloud target**

```bash
gcloud config list
gcloud compute instances describe fyp-mall-vm --zone asia-southeast1-b
```

- [ ] **Step 2: Transfer the committed landing page and Nginx configuration**

Use `gcloud compute scp --recurse` to copy the page into a versioned temporary VM directory, then use an SSH command to synchronize it into `/var/www/project-fyp-mall-landing/` and install the reviewed Nginx file.

- [ ] **Step 3: Validate before reload**

On the VM, run:

```bash
sudo nginx -t
```

Only reload Nginx after this succeeds.

- [ ] **Step 4: Verify public behavior**

```bash
curl -I http://34.143.225.11/LandingPage
curl -I http://34.143.225.11/LandingPage/
curl -I http://34.143.225.11/
curl -I http://34.143.225.11/api/api/good
```

Expected: `/LandingPage` redirects to `/LandingPage/`; the canonical page, storefront, and API remain available.

- [ ] **Step 5: Inspect the public page visually**

Open `http://34.143.225.11/LandingPage/` in a fresh browser session and confirm the production presentation matches the approved design.

