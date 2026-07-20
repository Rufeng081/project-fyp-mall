# Video Presentation Content Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the R Mall video presentation landing page with the final D8 report and redeploy the verified revision.

**Architecture:** Keep the existing dependency-free landing page and deployment route. Extend its content-verification script with report-alignment assertions, then revise only the presentation copy and provenance documentation before running browser and production checks.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js content verification, Nginx, Google Cloud VM.

---

### Task 1: Add report-alignment regression checks

**Files:**
- Modify: `LandingPage/tests/verify-content.js`
- Test: `LandingPage/tests/verify-content.js`

- [ ] **Step 1: Write the failing assertions**

Add these exact required strings to the visible-content checks:

```js
const reportAlignedContent = [
  'Chapter 4 test summary',
  'Design and develop a cloud-based small e-commerce platform that supports core online shopping functions.',
  'Implement and analyse the network communication mechanisms used by the platform in a cloud environment.',
  'Evaluate the network performance of the deployed platform under different test parameters using Apache JMeter.',
  'Chapter 4, Tables 4.17 and 4.18'
];
```

Reject visible `Phase 6`, `reproducible response-time`, `Evidence policy for the final page`, `Claims that will not be used`, and case-insensitive AI self-reference.

- [ ] **Step 2: Run the verifier and confirm RED**

Run: `node LandingPage/tests/verify-content.js`

Expected: FAIL because the current page still uses Phase 6 and does not contain the exact report-aligned objective sentences.

- [ ] **Step 3: Commit the failing test**

```bash
git add LandingPage/tests/verify-content.js
git commit -m "test: require D8-aligned presentation content"
```

### Task 2: Revise presentation copy and provenance

**Files:**
- Modify: `LandingPage/index.html`
- Modify: `LandingPage/README.md`
- Test: `LandingPage/tests/verify-content.js`

- [ ] **Step 1: Replace Chapter terminology**

Change the metadata, hero evidence label, results introduction, results accessibility label, and evidence source from Phase 6 language to Chapter 4 language. Use `Chapter 4 test summary` and `Chapter 4, Tables 4.17 and 4.18` in visible copy.

- [ ] **Step 2: Clarify project background**

State that R Mall is a cloud-based small e-commerce platform supporting core shopping workflows while providing a realistic client-server-database workload for Network Technology analysis. Preserve the concise problem statement that functional success alone cannot explain the deployed request path or concurrent performance.

- [ ] **Step 3: Insert the exact concise objectives**

Use these three sentences without expanding the project claims:

```text
Design and develop a cloud-based small e-commerce platform that supports core online shopping functions.
Implement and analyse the network communication mechanisms used by the platform in a cloud environment.
Evaluate the network performance of the deployed platform under different test parameters using Apache JMeter.
```

- [ ] **Step 4: Tighten results language**

Keep every verified metric unchanged. Replace the conclusion's `reproducible` claim with `measured`, and keep the single-VM HTTP scope statement in concise report-aligned language.

- [ ] **Step 5: Update README provenance language**

Describe the figures as Chapter 4 evidence derived from the retained JMeter artefacts. Keep the underlying Phase 6 filenames only where they identify canonical repository files.

- [ ] **Step 6: Run verification and confirm GREEN**

Run: `node LandingPage/tests/verify-content.js && git diff --check`

Expected: `Landing page verification passed.` and no whitespace errors.

- [ ] **Step 7: Commit the content revision**

```bash
git add LandingPage/index.html LandingPage/README.md
git commit -m "fix: align presentation copy with D8 report"
```

### Task 3: Verify, publish, and inspect production

**Files:**
- Verify: `LandingPage/index.html`
- Verify: `deploy/nginx/project-fyp-mall.conf`

- [ ] **Step 1: Run the complete local checks**

Run the landing-page checks from the repository root:

```bash
node LandingPage/tests/verify-content.js
git diff --check
```

Then run the existing Vue application checks from its package directory:

```bash
cd ElectronicMallVue
npm run check:deployment
npm run check:auth
npm run check:homepage-admin
npm run check:catalog
npm run build
```

Expected: all checks exit successfully; the existing Vue build may retain its documented Browserslist and asset-size warnings.

- [ ] **Step 2: Review desktop and mobile presentation views**

Open the local page at desktop and mobile widths. Confirm Chapter 4 wording, exact objectives, readable wrapping, working chapter navigation, no overflow, and no internal or AI self-reference.

- [ ] **Step 3: Push the branch**

Run: `git push origin video-presentation-landing`

Expected: the remote branch advances to the new content commit.

- [ ] **Step 4: Deploy the static files**

Upload `LandingPage/` to the VM staging directory, synchronize it to `/var/www/project-fyp-mall-landing/`, preserve the existing Nginx route, validate with `nginx -t`, and reload Nginx only after validation succeeds.

- [ ] **Step 5: Verify production**

Confirm `/LandingPage` returns the canonical redirect, `/LandingPage/` and `/` return HTTP 200, the public HTML contains `Chapter 4 test summary`, and the public HTML contains no visible `Phase 6` text.

- [ ] **Step 6: Final browser review**

Inspect the public opening, objectives, architecture, and results sections. Keep the production page open as the deliverable only after the final screenshots and interaction checks pass.
