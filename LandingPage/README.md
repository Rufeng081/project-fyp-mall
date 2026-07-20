# R Mall Video Presentation Landing Page

This directory contains the standalone presentation canvas used for the R Mall innovation video. It summarizes the project problem, objectives, methodology, deployed request path, and Chapter 4 performance evidence. Its presentation copy aligns with the final D8 report, and it does not replace or modify the customer storefront or administrator application.

## Local Preview

From the repository root, run:

```bash
python3 -m http.server 8088 --directory LandingPage
```

Then open `http://localhost:8088/`.

The page has no external font, analytics, image, stylesheet, or JavaScript dependency. It remains readable when JavaScript is disabled; JavaScript only updates the current chapter indicator.

## Evidence Provenance

The quantitative content is derived from retained JMeter evidence supporting the Chapter 4 presentation layer, including Tables 4.17 and 4.18:

- `report/thesis-materials/test-results/results/aggregate-results.csv`
- `report/thesis-materials/test-results/results/summary-tables.md`
- `report/thesis-materials/test-results/records/phase-6-jmeter-execution-record-2026-06-16.md`
- `report/thesis-materials/test-results/reports/phase-6-jmeter-performance-evaluation-report.md`
- `report/thesis-materials/test-results/results/charts/p90-response-time-ms.svg`
- `report/thesis-materials/test-results/results/charts/throughput-per-second.svg`

The aggregate CSV contains 35 summarized result rows, 3,197 total JMeter sampler executions, and 0 observed JMeter errors. A sampler execution is one recorded HTTP request step; it is not one user and is not one complete test run.

The displayed P90 values use the highest tested concurrency retained for each selected scenario:

| Scenario | Threads | P90 |
| --- | ---: | ---: |
| Simulated payment | 10 | 441 ms |
| Place order | 10 | 1,882 ms |
| Order history | 100 | 1,986 ms |
| Homepage | 200 | 2,457 ms |
| Login | 100 | 3,116 ms |
| Product list | 200 | 3,400 ms |
| Product detail | 200 | 3,659 ms |

The evidence applies only to the tested single-VM HTTP academic prototype, stated thread levels, ramp-up patterns, and retained runs supporting Chapter 4. It does not establish commercial production capacity.

The Chapter 4 tables are the report presentation layer; the retained artifacts listed above provide their supporting evidence. Canonical repository filenames containing `phase-6` remain unchanged because they identify the original evidence files.

## Verification

Run:

```bash
node LandingPage/tests/verify-content.js
```

The verification checks required evidence values, precise terminology, prohibited claims, internal anchors, local assets, privacy-sensitive patterns, accessibility hooks, reduced-motion support, external requests, and disallowed visual patterns.

## Production Location

The Nginx deployment serves this directory at `/LandingPage/`. The path without a trailing slash redirects to the canonical trailing-slash path.
