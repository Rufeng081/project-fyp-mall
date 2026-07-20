# R Mall Video Presentation Landing Page Design

## Purpose

Create a standalone, public presentation canvas for the R Mall innovation video. The page supports the opening, project framing, methodology, deployed request-path explanation, and verified JMeter results. It is not a replacement for the customer storefront or administrator application.

The production URL is `http://34.143.225.11/LandingPage/`.

## Audience and Recording Context

The primary audience is the project evaluator watching a screen recording of no more than three minutes. The page must therefore prioritize immediate comprehension at 1920×1080, large typography, strong contrast, and predictable scrolling. It should also remain usable as a normal public webpage if an evaluator opens the URL directly.

## Content Structure

The page uses one smooth-scrolling document with a compact sticky chapter header.

1. **Opening:** Project title, one-sentence positioning, and a precisely labelled Phase 6 summary.
2. **Problem and objectives:** The gap between local feature demonstrations and deployed network evidence, followed by the three project objectives.
3. **Methodology:** Requirements, development, cloud deployment, verification, and performance testing as five iterative stages.
4. **Deployed request path:** Browser to Nginx to Spring Boot to MySQL and Redis, with short role descriptions.
5. **Performance evidence:** Formal Phase 6 scope, test matrix, verified headline metrics, P90 response-time comparison, interpretation, and limitations.
6. **Closing:** Three achieved outcomes and the academic-prototype boundary.

The page will not contain a marketing contact form, pricing, testimonials, fabricated social proof, decorative statistics, or a duplicate interactive mall.

## Visual Direction

The approved direction is **Navy and Architectural Stone**.

- Background: warm architectural off-white.
- Primary text and structural emphasis: deep navy.
- Secondary surfaces and data bars: low-saturation blue-grey and stone.
- Typography: locally available system sans-serif fonts for reliable offline and cloud rendering.
- Layout: flat sections, thin rules, restrained square or lightly rounded surfaces, generous spacing, and direct data labels.
- Motion: limited to smooth anchor navigation and subtle reveal behavior; reduced-motion preferences disable nonessential motion.

The design explicitly excludes purple accents, gradients, glow, glass effects, floating shapes, generated illustrations, excessive rounded cards, decorative dashboards, and other visual patterns that could make the page appear AI-templated.

## Evidence and Claims

Every quantitative claim must be traceable to retained project evidence. Canonical sources are:

- `report/thesis-materials/test-results/results/aggregate-results.csv`
- `report/thesis-materials/test-results/results/summary-tables.md`
- `report/thesis-materials/test-results/results/charts/p90-response-time-ms.svg`
- `report/thesis-materials/test-results/results/charts/throughput-per-second.svg`
- `report/thesis-materials/test-results/records/phase-6-jmeter-execution-record-2026-06-16.md`
- `report/thesis-materials/test-results/reports/phase-6-jmeter-performance-evaluation-report.md`

Approved headline values are:

| Claim | Exact meaning |
| --- | --- |
| 35 | Summarized Phase 6 result rows |
| 3,197 | Total JMeter sampler executions across the 35 rows |
| 0 | JMeter errors observed in those retained Phase 6 results |
| 0.00% | Overall observed error rate in the retained Phase 6 results |
| 200 threads | Highest tested read-only concurrency for homepage, product-list, and product-detail scenarios |
| 100 threads | Highest tested authenticated concurrency for login and order-history scenarios |
| 10 threads | Highest tested controlled-mutation concurrency for cart, order, and simulated-payment scenarios |

The label `3,197 test runs`, the label `3,197 users`, the absolute statement `the system has zero errors`, and commercial capacity claims are prohibited. The page must use the terms `sampler executions`, `observed`, `tested`, and the relevant scenario and thread count.

The P90 chart will compare values at the highest tested concurrency for each selected scenario and display scenario, thread count, units, and value directly:

| Scenario | Threads | P90 response time |
| --- | ---: | ---: |
| Simulated payment | 10 | 441 ms |
| Place order | 10 | 1,882 ms |
| Order history | 100 | 1,986 ms |
| Homepage | 200 | 2,457 ms |
| Login | 100 | 3,116 ms |
| Product list | 200 | 3,400 ms |
| Product detail | 200 | 3,659 ms |

The interpretation will state that the tested journeys remained error-free in the retained run while response time became multi-second in heavier scenarios. Results apply to the tested single-VM HTTP academic prototype and do not establish production or commercial capacity.

## Images and Privacy

Existing project screenshots may be used only when they support a stated project function. Candidate images include the storefront, product catalogue, cart, order history, and administrator product or order management views.

Before inclusion, each image must be checked for names, organization branding, email addresses, phone numbers, delivery addresses, verification codes, IP addresses, account identifiers, and personal photographs. Any image that cannot be safely cropped or redacted will not be used. Generic product imagery and role labels such as `Administrator` are acceptable only when they contain no personal identity.

## Technical Architecture

The landing page will be a dependency-free static site stored in a dedicated repository directory. HTML provides semantic document structure, CSS provides the responsive design system and print-safe layout, and a small JavaScript file handles chapter state and optional reveal behavior.

No backend endpoint, database table, external analytics service, external font request, form submission, or third-party JavaScript library is required. The existing Vue and Spring Boot applications remain unchanged.

Nginx will serve the built static directory from an explicit `/LandingPage/` location before the existing root SPA fallback. The path must work with and without the trailing slash, with `/LandingPage` redirecting to `/LandingPage/`.

## Responsive and Accessibility Requirements

- Readable at 1920×1080 for recording and at 375, 768, 1024, and 1440 CSS pixels for direct browsing.
- No horizontal scrolling.
- Body text contrast of at least 4.5:1 and data graphics contrast of at least 3:1.
- Semantic heading order, landmark regions, descriptive chart summary, and keyboard-reachable chapter links.
- Visible focus states and a skip-to-content link.
- Direct numeric labels so chart meaning does not depend on color.
- `prefers-reduced-motion` support.
- System-font fallbacks and no external network dependencies for rendering.

## Verification

Local verification will check:

- Required sections and exact evidence values are present.
- Prohibited and misleading phrases are absent.
- All local assets resolve and no external requests are required.
- HTML structure and internal anchor targets are valid.
- The page has no horizontal overflow at the required viewport widths.
- The existing Vue production build and deployment checks still pass.
- The Nginx configuration passes `nginx -t` on the VM.

Production verification will check:

- `http://34.143.225.11/LandingPage` redirects to the canonical trailing-slash URL.
- `http://34.143.225.11/LandingPage/` returns the landing page successfully.
- The existing storefront and `/api/` behavior remain available.
- A public browser session can load the page without authentication.

## Publishing and Deployment

Only files created or modified for this landing page, its design documentation, tests, and deployment configuration will be committed. Existing untracked report artifacts remain untouched.

After local verification, the scoped change will be committed and pushed to the existing GitHub remote. The Google Cloud VM will then receive the committed version, place the static landing-page files in a dedicated web directory, install the reviewed Nginx configuration, validate it, and reload Nginx. Deployment must not overwrite the existing storefront or backend service.

