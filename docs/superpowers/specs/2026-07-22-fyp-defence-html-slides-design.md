# FYP Defence HTML Slides Design

## Purpose

Create a polished 12-slide English HTML presentation and a matching approximately 10-minute English verbatim script for the defence of:

> DEVELOPMENT AND NETWORK PERFORMANCE EVALUATION OF A CLOUD-BASED SMALL ECOMMERCE PLATFORM

Presenter: **LI RUFENG**

Matric number: **A206331**

The presentation must explain why the project was undertaken, how it was developed, what was implemented and demonstrated, what the testing showed, and why the result matters as a Network Technology FYP.

## Audience and Delivery Context

The primary audience is the FYP evaluation panel. The presentation will be delivered in English in approximately 10 minutes. The system demonstration will be performed live by switching away from the slides; a recorded video may later be substituted, but it is not part of the initial implementation.

The deck must support confident oral delivery rather than duplicate the report. It should use concise audience-facing claims, large typography, high contrast, and evidence that can be explained without reading dense text.

## Narrative Principle

The central story is:

> R Mall progressed from a functional e-commerce application into a deployed and measurable cloud system whose request path and network behaviour could be analysed.

The deck will answer five questions in order:

1. Why was the project necessary?
2. What objectives and methodology guided it?
3. How was the application developed into a deployable cloud system?
4. What was demonstrated and measured?
5. What value and bounded conclusions resulted?

JMeter will remain visible because performance evaluation is part of the report title and Objective 3, but it will occupy only two slides. This avoids presenting the defence as a JMeter-specialist talk and reduces the risk of inviting unnecessarily deep tool-specific questioning.

## Timing

| Section | Slides | Target time |
| --- | ---: | ---: |
| Problem, objectives, methodology | 1-3 | 1 minute |
| Main development process | 4-7 | 3 minutes |
| Live demonstration | 8 | 3 minutes |
| Test design and main results | 9-10 | 2 minutes |
| Achievement, value, conclusion | 11-12 | 1 minute |

The verbatim script will contain concise transition phrases and optional recovery lines for the live demonstration. The main script should remain close to 10 minutes at a natural non-native English speaking pace.

## Slide Structure

### Slide 1 — From a Working Store to a Measurable Cloud System

- Use the exact project title as the formal subtitle.
- Display LI RUFENG and A206331.
- Establish the central positioning without adding an agenda or dense metadata.

### Slide 2 — A Working Website Is Not Yet a Network Technology Project

- Contrast a locally functional application with a deployed, traceable and measurable cloud system.
- State the core problem: how requests travel through the cloud path and how the system behaves under controlled concurrent access.
- Avoid reproducing the full report problem statement.

### Slide 3 — Three Objectives, One Iterative Method

- Objective 1: build a bounded cloud e-commerce platform.
- Objective 2: implement and analyse its network communication path.
- Objective 3: evaluate performance under different test parameters.
- Summarise the five increments: localisation, authentication, cloud deployment, runtime debugging and performance evaluation.

### Slide 4 — Development Was Built in Verifiable Increments

- Explain the development sequence as progressive integration rather than a list of technologies.
- Show that each increment was implemented, verified and corrected before the next.

### Slide 5 — A Complete but Bounded E-Commerce Workflow

- Present the customer golden path: Register/Login → Browse → Cart → Order → Simulated Payment → History.
- Briefly show administrator management as supporting scope.
- Explain that these functions are both product outcomes and realistic HTTP workloads.

### Slide 6 — Every Public Request Travels Through the Cloud Stack

- Use the deck's only primary architecture diagram.
- Show Browser/JMeter → HTTP → Nginx → Vue static content or Spring Boot REST API → MySQL/Redis.
- Connect SMTP only to relevant verification flows.
- Clarify the public entry point, reverse-proxy role and internal backend service.

### Slide 7 — Three Integration Problems Defined the Final System

- Production API routing and SPA history fallback.
- Redis-backed email verification, cooldown and session state.
- Persistent media storage and public resource paths.
- Present each as problem → implementation decision → verified outcome; do not use large code listings.

### Slide 8 — Live Demonstration

- Keep the slide visually sparse.
- Retain a small demonstration sequence: Browse → Login → Cart → Order → Payment → History → Admin.
- The speaker switches to the live system for approximately three minutes.
- The script provides action cues, spoken transitions, and a concise fallback narrative if the deployment is unavailable.

### Slide 9 — Eight Scenarios, Three Controlled Workload Types

- Explain why JMeter was used in one sentence.
- Group eight scenarios into read-only, authenticated and controlled mutation workloads.
- State the highest tested concurrency: 200 threads for read-only, 100 for authenticated and 10 for controlled mutation scenarios.
- Explicitly explain that mutation load was bounded to protect demonstration data; it is not a commercial-capacity claim.

### Slide 10 — 3,197 Sampler Executions, 0 Observed JMeter Errors

- Lead with 3,197 sampler executions, 0 observed JMeter errors and 0.00% observed error rate.
- Include a directly labelled P90 response-time comparison, with emphasis on Product Detail 3,659 ms, Product List 3,400 ms, Login 3,116 ms and Homepage 2,457 ms.
- Include lighter mutation scenarios without implying that unlike workload categories are directly comparable.
- State the interpretation: the tested path remained stable, while multi-second P90 values identify optimisation priorities.

### Slide 11 — Objectives Achieved, within Clear Project Boundaries

- Return attention from JMeter to the complete FYP.
- Show that Build, Analyse and Evaluate were achieved.
- State the main boundaries: single Google Cloud VM, HTTP only, simulated payment and bounded academic workloads.

### Slide 12 — E-Commerce as a Measurable Network Testbed

- State the project contribution: a working application, a documented cloud request path and measurable network-performance evidence.
- Mention concise future directions such as HTTPS and performance optimisation.
- End with “Thank you” and “Questions”.

## Visual Direction

The approved direction is **Evidence-led Editorial**, enhanced with the disciplined use of large system screenshots associated with a product showcase.

- Canvas: warm off-white or very light stone.
- Primary typography: deep navy.
- Accent: restrained copper or warm brown for rules, highlights and important figures.
- Secondary text and structures: blue-grey and neutral stone.
- Backgrounds remain light throughout; dark technical slides are excluded because they are less reliable in projected presentation conditions.
- Use large claims, short supporting copy, thin rules and asymmetric editorial compositions.
- Avoid gradients, glow, glass effects, excessive rounded cards, dense dashboards, decorative icons and AI-template styling.
- Use one main composition per slide rather than repeated grids of small UI panels.
- Use project screenshots only when they demonstrate a function or implementation outcome. Screenshots should be large, cropped deliberately and checked for private data.
- Body text must remain comfortably readable at 16:9 presentation scale; titles must remain on one line where intended.

## Interaction and HTML Behaviour

The deliverable will be a self-contained local HTML presentation using standard HTML, CSS and minimal JavaScript.

- Fixed 16:9 slide canvas that scales to the available browser viewport.
- Keyboard navigation with Arrow keys, Page Up/Page Down, Home and End.
- Clickable previous/next controls that remain visually unobtrusive.
- Slide number and progress indicator.
- Fullscreen support when permitted by the browser.
- Presenter notes or the verbatim script remain separate from audience-facing slide content.
- No external fonts, analytics or network dependencies are required for rendering.
- Reduced-motion preferences are respected.

## Content and Evidence Sources

The canonical content source is `report/D8.pdf`, supported by project files, screenshots and retained testing evidence. Quantitative claims must remain bounded and use the report's terminology.

Approved headline evidence:

- 35 summarised result rows.
- 3,197 JMeter sampler executions.
- 0 observed JMeter errors.
- 0.00% overall observed JMeter error rate.
- Highest tested concurrency of 200 read-only threads, 100 authenticated threads and 10 controlled-mutation threads.

The presentation must not relabel sampler executions as users or test runs, must not claim that the system generally has zero errors, and must not claim commercial-scale capacity.

## Speaker Script and Defence Preparation

The accompanying English script will be written slide by slide and include:

- Exact audience-facing narration.
- Time target per slide.
- Natural transitions between sections.
- Live-demonstration action cues and recovery wording.
- Correct bounded language for testing claims.

An additional JMeter defence quick-reference will define thread, ramp-up, loop, sampler, average response time, P90, throughput and error rate. It will include likely panel questions and concise answers based only on the implemented report evidence.

## Verification

Before delivery:

- Render and inspect every slide at 16:9 desktop dimensions.
- Check for clipping, unintended overlap, poor wrapping, low contrast and unreadable charts.
- Verify keyboard navigation, scaling and fullscreen behaviour.
- Confirm all local assets resolve without external requests.
- Confirm the title, presenter name, matric number and evidence values exactly match the approved design.
- Confirm the spoken timing is close to 10 minutes and the JMeter section remains limited to approximately two minutes.
- Scan for prohibited or exaggerated performance claims.

## Deliverables

- A standalone English HTML slide presentation and its local assets.
- An English slide-by-slide verbatim defence script.
- A concise JMeter defence quick-reference with likely questions and answers.
