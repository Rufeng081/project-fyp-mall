# FYP Defence HTML Slides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a self-contained 12-slide English HTML FYP defence presentation, an approximately 10-minute verbatim English script, and a JMeter defence quick-reference.

**Architecture:** A standalone `FYP_Defence_Slides/` directory will contain semantic slide markup, one visual system stylesheet, minimal keyboard/fullscreen navigation, curated local evidence assets, and a Node-based content verifier. Audience-facing slides remain separate from the speaker script and JMeter preparation notes, while all quantitative claims are checked against the approved report evidence.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js verification, local PNG assets, browser rendering and screenshot-based visual QA.

---

## Communication Job

By the end, the FYP evaluation panel should understand that R Mall is not only a functioning small e-commerce application, but a deployed and measurable Network Technology testbed with a documented cloud request path and bounded performance evidence.

## File Structure

- `FYP_Defence_Slides/index.html` — all 12 audience-facing slides, semantic structure, accessible labels and local asset references.
- `FYP_Defence_Slides/styles.css` — 16:9 scaling, Evidence-led Editorial visual system, responsive rules, print fallback and reduced-motion support.
- `FYP_Defence_Slides/slides.js` — slide state, keyboard controls, progress, fullscreen and presenter-safe URL state.
- `FYP_Defence_Slides/assets/storefront.png` — curated storefront evidence copied from the report screenshot set.
- `FYP_Defence_Slides/assets/catalogue.png` — curated product catalogue evidence.
- `FYP_Defence_Slides/assets/cart.png` — curated cart evidence.
- `FYP_Defence_Slides/assets/orders.png` — curated order-history evidence.
- `FYP_Defence_Slides/assets/admin.png` — curated administrator evidence.
- `FYP_Defence_Slides/tests/verify-slides.mjs` — regression checks for structure, identity, evidence terminology, prohibited claims, assets and navigation hooks.
- `FYP_Defence_Slides/speaker-script.md` — slide-by-slide English verbatim script, timing and live-demo action cues.
- `FYP_Defence_Slides/jmeter-defence-quick-reference.md` — essential terminology and likely panel questions with bounded answers.
- `FYP_Defence_Slides/README.md` — opening, navigation, fullscreen, live-demo and fallback instructions.

### Task 1: Establish content and evidence regression checks

**Files:**
- Create: `FYP_Defence_Slides/tests/verify-slides.mjs`

- [ ] **Step 1: Write the failing structure and evidence verifier**

Create a Node script that loads `index.html`, `styles.css`, `slides.js`, `speaker-script.md`, `jmeter-defence-quick-reference.md` and `README.md`. It must initially fail when those files are absent and later assert:

```js
const exactTitle = 'DEVELOPMENT AND NETWORK PERFORMANCE EVALUATION OF A CLOUD-BASED SMALL ECOMMERCE PLATFORM';
const requiredIdentity = ['LI RUFENG', 'A206331'];
const requiredClaims = [
  '3,197',
  'sampler executions',
  '0 observed JMeter errors',
  '0.00%',
  '3,659 ms',
  '3,400 ms',
  '3,116 ms',
  '2,457 ms'
];
const prohibitedClaims = [
  '3,197 users',
  '3,197 test runs',
  'the system has zero errors',
  'supports 200 users',
  'commercial-scale capacity'
];
```

The verifier must require exactly 12 `<section class="slide">` elements, one `.is-active` initial slide, 12 slide-number labels, all local assets to exist, no external `http(s)` assets, and navigation hooks for ArrowLeft, ArrowRight, Home, End and fullscreen.

- [ ] **Step 2: Run the verifier and confirm the RED state**

Run:

```bash
node FYP_Defence_Slides/tests/verify-slides.mjs
```

Expected: non-zero exit with missing-deliverable messages.

- [ ] **Step 3: Keep the failing test for the implementation cycle**

Do not commit partial presentation content yet; continue directly to Task 2 so the test becomes green incrementally.

### Task 2: Build the complete audience-facing slide narrative

**Files:**
- Create: `FYP_Defence_Slides/index.html`

- [ ] **Step 1: Create the semantic presentation shell**

Use this document structure:

```html
<body>
  <main class="deck" aria-label="FYP defence presentation">
    <section class="slide is-active" data-slide="1" aria-labelledby="slide-1-title">...</section>
    <!-- slides 2 through 12 -->
  </main>
  <nav class="deck-controls" aria-label="Presentation controls">...</nav>
  <script src="slides.js"></script>
</body>
```

Every slide must include a unique audience-facing claim title, a visible slide number and no speaker timing or production notes.

- [ ] **Step 2: Implement Slides 1-3**

Add the exact project identity and the approved opening narrative:

```text
1. From a Working Store to a Measurable Cloud System
2. A working website alone cannot answer a Network Technology question
3. Three objectives guided one iterative development process
```

Slide 3 must show Build, Analyse and Evaluate together with the five increments: localisation, authentication, cloud deployment, runtime debugging and performance evaluation.

- [ ] **Step 3: Implement Slides 4-7**

Use the approved development claims:

```text
4. Each increment made the next stage testable
5. Real shopping journeys became realistic network workloads
6. Every public request travelled through one documented cloud path
7. Three integration problems defined the deployed system
```

Slide 5 must include Register/Login → Browse → Cart → Order → Simulated Payment → History and administrator support. Slide 6 must show Browser/JMeter → Nginx → Vue or Spring Boot → MySQL/Redis, with SMTP limited to verification. Slide 7 must use problem → decision → verified outcome for routing, Redis-backed state and persistent media.

- [ ] **Step 4: Implement Slides 8-12**

Use these final claims:

```text
8. Live Demonstration
9. Eight scenarios tested three controlled workload types
10. The tested path completed 3,197 sampler executions with 0 observed JMeter errors
11. All three objectives were achieved within clear project boundaries
12. R Mall turns e-commerce into a measurable network testbed
```

Slide 8 stays sparse and shows only Browse → Login → Cart → Order → Payment → History → Admin. Slide 9 includes 200 read-only threads, 100 authenticated threads and 10 controlled-mutation threads. Slide 10 includes direct-labelled P90 evidence and the stable-but-optimisable interpretation. Slide 11 covers single VM, HTTP only, simulated payment and bounded workload. Slide 12 resolves the opening claim before ending with “Thank you” and “Questions”.

- [ ] **Step 5: Run the verifier**

Run:

```bash
node FYP_Defence_Slides/tests/verify-slides.mjs
```

Expected: failures only for the not-yet-created style, navigation, asset and companion-document requirements.

### Task 3: Add curated project screenshots and visual evidence

**Files:**
- Create: `FYP_Defence_Slides/assets/storefront.png`
- Create: `FYP_Defence_Slides/assets/catalogue.png`
- Create: `FYP_Defence_Slides/assets/cart.png`
- Create: `FYP_Defence_Slides/assets/orders.png`
- Create: `FYP_Defence_Slides/assets/admin.png`
- Modify: `FYP_Defence_Slides/index.html`

- [ ] **Step 1: Copy the strongest existing screenshots into stable presentation paths**

Use the reviewed report screenshots as sources:

```text
report/截图/1-home page.png → FYP_Defence_Slides/assets/storefront.png
report/截图/3-category.png → FYP_Defence_Slides/assets/catalogue.png
report/截图/4-my cart.png → FYP_Defence_Slides/assets/cart.png
report/截图/5-orders.png → FYP_Defence_Slides/assets/orders.png
report/截图/8-admin.png → FYP_Defence_Slides/assets/admin.png
```

- [ ] **Step 2: Inspect every copied screenshot for personal or sensitive information**

Reject or crop any screenshot that exposes email addresses, phone numbers, delivery addresses, verification codes, public IP addresses, account identifiers or personal photographs. Product names, prices and generic role labels may remain.

- [ ] **Step 3: Add screenshots only where they advance the story**

Use one large storefront image on Slide 1 or 5 and a restrained evidence strip on Slide 5. Do not create a dense gallery, and do not repeat the same screenshot on multiple slides.

### Task 4: Implement the Evidence-led Editorial visual system

**Files:**
- Create: `FYP_Defence_Slides/styles.css`

- [ ] **Step 1: Define the approved palette and typography scale**

Start with:

```css
:root {
  --paper: #f4f1e9;
  --paper-bright: #fbfaf6;
  --ink: #14263a;
  --ink-soft: #4f6170;
  --copper: #9a5b2f;
  --line: #cfc9bc;
  --stone: #e6e1d7;
  --success: #2f6b58;
  --slide-w: 1600;
  --slide-h: 900;
}
```

Use system sans-serif fonts, title sizes equivalent to at least 50 pt on the 1600×900 canvas, slide titles equivalent to at least 35 pt, mid-level text equivalent to at least 24 pt and body text equivalent to at least 16 pt.

- [ ] **Step 2: Build the 16:9 scaling and layout system**

The viewport must center a fixed-ratio `.slide`, hide inactive slides, preserve equal outer margins and avoid horizontal scrolling. Create a small set of focused compositions: title image, tension comparison, process line, workflow, request path, three decisions, sparse live-demo, workload matrix, result chart, objective synthesis and closing.

- [ ] **Step 3: Add restrained editorial details**

Use thin copper rules, small uppercase eyebrow labels, direct data labels and large numeric evidence. Exclude gradients, purple, glow, glass effects, dark full-slide backgrounds, excessive rounded cards and dashboard-like density.

- [ ] **Step 4: Add accessibility and print safety**

Include visible focus states, `prefers-reduced-motion`, strong contrast, alt text support and `@media print` rules that place one 16:9 slide on each printed page.

- [ ] **Step 5: Run the verifier**

Expected: style requirements pass; remaining failures concern navigation or companion documents.

### Task 5: Implement reliable presentation navigation

**Files:**
- Create: `FYP_Defence_Slides/slides.js`
- Modify: `FYP_Defence_Slides/index.html`

- [ ] **Step 1: Implement deterministic slide state**

Create `showSlide(index)` that clamps the index to 0-11, moves `.is-active`, updates `aria-hidden`, slide counter, progress width and `#slide-N` URL state without reloading.

- [ ] **Step 2: Add keyboard and button controls**

Map ArrowRight, PageDown and Space to next; ArrowLeft and PageUp to previous; Home to the first slide; End to the last slide; and `f` to `document.documentElement.requestFullscreen()` when available. Ignore shortcuts while a form control is focused.

- [ ] **Step 3: Add click-safe controls and startup routing**

Previous and next buttons must have accessible labels. On startup, parse `#slide-N`, default safely to Slide 1 and never expose an invalid state.

- [ ] **Step 4: Run the verifier and confirm navigation checks pass**

Run:

```bash
node FYP_Defence_Slides/tests/verify-slides.mjs
```

Expected: only missing script, quick-reference or README checks remain.

### Task 6: Write and time the English verbatim defence script

**Files:**
- Create: `FYP_Defence_Slides/speaker-script.md`

- [ ] **Step 1: Write Slides 1-3 for approximately one minute**

The narration must introduce the exact title, establish the gap between local functionality and network analysis, and state the three objectives and iterative method without reading every word on screen.

- [ ] **Step 2: Write Slides 4-7 for approximately three minutes**

Explain the sequence of development, the complete but bounded workflow, the public request path and the three integration problems. Use transitions that connect each slide causally.

- [ ] **Step 3: Write Slide 8 live-demo cues for approximately three minutes**

Include bracketed presenter actions and spoken lines for Browse, Login, Cart, Order, Simulated Payment, History and Admin. Include one short fallback paragraph that can be spoken over the transition slide if the live deployment is unavailable.

- [ ] **Step 4: Write Slides 9-10 for approximately two minutes**

Define JMeter at audience level, explain the workload boundaries, present the headline results and state that 0 observed errors applies only to the retained tested workload.

- [ ] **Step 5: Write Slides 11-12 for approximately one minute**

Resolve all three objectives, state the prototype boundaries, articulate the Network Technology value and close by inviting questions.

- [ ] **Step 6: Check length and speaking pace**

Target approximately 1,150-1,300 English words including short live-demo cues, suitable for a clear non-native English delivery near 10 minutes. Remove repetition before increasing speaking speed.

### Task 7: Create the JMeter defence quick-reference

**Files:**
- Create: `FYP_Defence_Slides/jmeter-defence-quick-reference.md`

- [ ] **Step 1: Define the minimum terminology**

Explain thread, ramp-up, loop, sampler, average response time, P90, throughput and error rate in plain English and one-line Chinese memory aids where useful.

- [ ] **Step 2: Add evidence-backed answers to likely questions**

Cover at least:

```text
Why did you use JMeter?
Why were different thread levels used?
Why were mutation tests limited to 10 threads?
What does P90 mean?
Does 0 observed errors prove production readiness?
Why are some P90 values above three seconds?
Why can throughput values not be compared directly across every scenario?
What would you improve next?
```

Every answer must stay within the single-VM, HTTP-only, academic-prototype scope.

### Task 8: Document operation and complete automated verification

**Files:**
- Create: `FYP_Defence_Slides/README.md`
- Modify: `FYP_Defence_Slides/tests/verify-slides.mjs`

- [ ] **Step 1: Document local opening and presentation controls**

Document direct browser opening and an optional local server:

```bash
python3 -m http.server 8088 --directory FYP_Defence_Slides
```

List keyboard controls, fullscreen, live-demo switching and video substitution guidance.

- [ ] **Step 2: Run the full verifier**

Run:

```bash
node FYP_Defence_Slides/tests/verify-slides.mjs
```

Expected: `FYP defence slide verification passed` and exit code 0.

- [ ] **Step 3: Run repository-scoped integrity checks**

Confirm the presentation does not modify application behavior and run any existing lightweight frontend checks that do not require network access.

### Task 9: Render, inspect and correct every slide

**Files:**
- Modify as needed: `FYP_Defence_Slides/index.html`
- Modify as needed: `FYP_Defence_Slides/styles.css`
- Modify as needed: `FYP_Defence_Slides/slides.js`
- Create in temporary QA workspace only: rendered slide PNGs and contact sheet

- [ ] **Step 1: Render all 12 slides at 1600×900**

Use a local browser automation runtime to visit `#slide-1` through `#slide-12` and save one PNG per slide in a temporary QA directory outside the deliverable.

- [ ] **Step 2: Inspect every slide individually at full size**

Check titles, line wrapping, chart labels, screenshot crops, contrast, slide numbers, progress and unused space. Do not rely only on a montage.

- [ ] **Step 3: Fix every unintended overlap, clipping or density issue**

Shorten text or change layout before reducing font size. Re-render every corrected slide.

- [ ] **Step 4: Verify presentation flow and interaction**

Navigate through all slides using keyboard controls, test Home, End and fullscreen, and confirm the live-demo transition is clean.

- [ ] **Step 5: Run final checks**

Run the verifier again, scan for prohibited performance wording, confirm exactly 12 slides and confirm the script remains close to the 10-minute target.

- [ ] **Step 6: Commit the completed deliverables**

Stage only `FYP_Defence_Slides/` and the implementation plan updates, preserving unrelated report files and user work. Commit with:

```bash
git commit -m "feat: add FYP defence HTML slides and script"
```
