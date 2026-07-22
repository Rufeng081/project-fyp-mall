# R Mall FYP Defence Slides

This directory contains the standalone English HTML slides, the approximately 10-minute verbatim script and the JMeter defence quick-reference.

## Open the Slides

Open `index.html` directly in a modern browser, or start a local server from the repository root:

```bash
python3 -m http.server 8088 --directory FYP_Defence_Slides
```

Then open `http://localhost:8088/`.

## Presentation Controls

- **Arrow keys**: Right advances; Left returns.
- **Page Down / Space**: advance.
- **Page Up**: return.
- **Home / End**: first or last slide.
- **F**: toggle **Fullscreen** when the browser permits it.
- The on-screen controls provide the same previous, next and fullscreen actions.
- A slide can be opened directly with `#slide-N`, for example `#slide-8`.

## Live Demonstration

Slide 8 is the transition point for the three-minute Live demonstration. Switch to the deployed R Mall system and follow this sequence:

```text
Browse → Login → Cart → Order → Payment → History → Admin
```

Return to Slide 9 after the demonstration. The exact spoken cues and a deployment-unavailable fallback are in `speaker-script.md`.

If a recorded demonstration video is used later, play it after Slide 8 and return to Slide 9 when it ends. Keep the video close to three minutes so the total defence remains near ten minutes.

## Preparation Files

- `speaker-script.md` — complete slide-by-slide English narration and live actions.
- `jmeter-defence-quick-reference.md` — minimum terminology, numbers and likely panel questions.

## Evidence Boundaries

The testing claims come from the retained Phase 6 evidence summarised in `report/D8.pdf`. The results apply to a single-VM HTTP academic prototype under the selected workloads. Sampler executions are individual JMeter requests; they are not user counts.

## Verification

Run:

```bash
node FYP_Defence_Slides/tests/verify-slides.mjs
```

Expected output:

```text
FYP defence slide verification passed
```
