# Phase 6 JMeter Execution Record - 2026-06-16

## Purpose

This record tracks the execution of Phase 6: Apache JMeter network performance testing and evaluation for the cloud-deployed FYP mall system.

## Scope

- Execute the approved Phase 6 JMeter plan in `docs/testing/jmeter/phase-6-jmeter-performance-evaluation-plan.md`.
- Prepare JMeter CLI locally if unavailable.
- Run smoke tests for all existing `.jmx` files.
- Run controlled read-only, authentication, and mutation performance tests.
- Generate result summaries, tables, charts, and final Phase 6 report.
- Keep all important operations, findings, and evidence in `/docs`.

## Safety Rules

- Do not print or store database, SMTP, or VM secret values.
- Back up the live MySQL database before mutation tests.
- Keep mutation load controlled to avoid unnecessary demo-data pollution.
- Interpret results as academic prototype performance, not commercial capacity.

## Operation Log

| Time (+08) | Action | Result |
|---|---|---|
| 14:42 | Started Phase 6 execution from the approved JMeter plan. | Confirmed Java 17 is available and `jmeter` is not installed locally. |
| 14:42 | Created JMeter results directory structure. | Added `docs/testing/jmeter/results/phase6-smoke`, `phase6-load`, and `phase6-summary/charts`. |
| 14:42 | Added local results ignore rules. | Raw `.jtl`, `.log`, and generated HTML reports are excluded; summary Markdown/CSV and selected images can be tracked. |
| 14:43 | Downloaded Apache JMeter 5.6.3 and SHA512 checksum from official Apache endpoints. | Initial sandbox DNS failed; sandbox-external download succeeded. |
| 14:44 | Verified SHA512 and extracted JMeter. | Hash matched official checksum; `tools/downloads/apache-jmeter-5.6.3/bin/jmeter --version` reports 5.6.3. |
| 14:45 | Validated existing JMeter XML and inspected thread groups/assertions. | XML is valid, but plans are fixed at 1 thread/1 loop and mostly lack business response assertions. Parameterization and assertions are required before reliable load execution. |
| 14:49 | Parameterized all eight `.jmx` files and inserted sampler-level assertions. | `THREADS`, `RAMP_UP`, and `LOOPS` are now CLI-controlled. Assertions check homepage HTML for `id="app"` and backend JSON responses for `"code":"200"`. `xmllint --noout docs/testing/jmeter/*.jmx` passed. |
| 14:50 | Ran one-user homepage validation with JMeter. | Sandboxed execution failed with `java.net.SocketException: Operation not permitted`; sandbox-external JMeter run succeeded with 4 samples and 0 errors. |
| 14:51 | Created live MySQL backup before mutation tests. | VM-side backup file created at `/opt/project-fyp-mall/backups/electronic_mall_phase6_before_20260616_1452.sql` without exporting DB contents to the repo. |
| 14:51 | Recorded mutation baseline counts. | Before mutation smoke/load: `t_order=3`, `cart=3`, `good_standard(3, Chair).store=500`. |
| 14:53 | Ran all eight JMeter smoke plans. | 21 total samples across homepage, product list/detail, login, add-to-cart, place-order, simulated payment, and order history; all JTL files show 0 errors. |
| 14:54 | Recorded post-smoke mutation effects. | After smoke: `t_order=5`, `cart=4`, Chair stock `499`, paid orders `3`, pending orders `1`. Effects match one add-to-cart, one pending order, and one paid order scenario. |
| 14:55 | Checked VM health before load tests. | `nginx`, `project-fyp-mall.service`, `mysql`, and `redis-server` were active; load average was `0.00, 0.00, 0.00`. |
| 14:55-15:03 | Ran read-only load matrix. | `01_homepage`, `02_product_list`, and `03_product_detail` were tested at 10, 50, 100, and 200 threads with 0 JTL errors. |
| 15:03 | Checked VM health after read-only load. | Core services remained active; load average was `0.18, 0.21, 0.11`. |
| 15:04-15:06 | Ran authenticated load matrix. | `04_login` and `08_order_history` were tested at 10, 50, and 100 threads with 0 JTL errors. |
| 15:07 | Checked VM health after authenticated load. | Core services remained active; load average was `0.01, 0.11, 0.08`. |
| 15:07-15:09 | Ran controlled mutation load matrix. | `05_add_to_cart`, `06_place_order`, and `07_simulated_payment` were tested at 1, 5, and 10 threads with 0 JTL errors. |
| 15:09 | Recorded post-mutation data impact and VM health. | `t_order=37`, `cart=25`, Chair stock `483`, paid orders `19`, pending orders `17`; core services remained active. |
| 15:11 | Generated retained Phase 6 summaries and charts. | Wrote `aggregate-results.csv`, `summary-tables.md`, `p90-response-time-ms.svg`, and `throughput-per-second.svg` under `docs/testing/jmeter/results/phase6-summary/`. |
| 15:12 | Wrote final Phase 6 report. | Added `docs/reports/phase-6-jmeter-performance-evaluation-report.md`. |
| 15:14 | Ran final local verification. | `xmllint --noout docs/testing/jmeter/*.jmx`, `node tools/check-database-schema.js`, `node tools/phase6-summarize-jmeter.js`, `git diff --check`, `mvn -q test`, `mvn -q package`, `npm run check:auth`, `npm run check:deployment`, and `npm run build` all exited 0. |
| 15:15 | Ran final VM health/log check. | `nginx`, `project-fyp-mall.service`, `mysql`, and `redis-server` were active; load average was `0.08, 0.05, 0.07`; backend journal had no warning/error entries in the last 15 minutes and Nginx error log printed no entries. |

## Current Status

Complete.

## Findings

- Apache JMeter CLI is not currently installed in the local shell.
- Local Java version is 17.0.12, which satisfies Apache JMeter 5.6.3's Java 8+ requirement.
- Official Apache JMeter download page lists Apache JMeter 5.6.3 as the current release and recommends integrity verification.
- Downloaded JMeter artifacts are stored under `tools/downloads/`, which is ignored by Git.
- Existing `.jmx` files needed load parameters and response assertions before Phase 6 load results could be trusted; this was addressed before smoke/load execution.
- Phase 6 mutation scenarios use the demo account and live test product variant `good_id=3`, `standard=Chair`, so live data changes must be interpreted as controlled test effects.
- Smoke testing confirms all eight planned user journeys are executable against the cloud demo endpoint before load testing.
- Official Phase 6 JMeter execution summarized 3197 sampler executions with 0 JMeter errors.
- Read-only browsing tolerated the planned 10/50/100/200 thread matrix with 0.00% error rate in the tested ramp-up pattern.
- Authenticated login/order-history scenarios tolerated the planned 10/50/100 thread matrix with 0.00% error rate.
- Controlled mutation scenarios tolerated the planned 1/5/10 thread matrix with 0.00% error rate.
- The VM services remained active after read-only, authenticated, and mutation load phases.

## Verification Evidence

Smoke evidence:

| Plan | Samples | JTL Errors |
|---|---:|---:|
| `01_homepage.jmx` | 4 | 0 |
| `02_product_list.jmx` | 1 | 0 |
| `03_product_detail.jmx` | 2 | 0 |
| `04_login.jmx` | 1 | 0 |
| `05_add_to_cart.jmx` | 2 | 0 |
| `06_place_order.jmx` | 4 | 0 |
| `07_simulated_payment.jmx` | 5 | 0 |
| `08_order_history.jmx` | 2 | 0 |

Load and mutation evidence:

| Category | Result |
|---|---:|
| Summarized result rows | 35 |
| Total official sampler executions | 3197 |
| Total JMeter errors | 0 |
| Overall observed error rate | 0.00% |
| Load and mutation sampler executions | 3176 |
| Load and mutation errors | 0 |

Retained evidence files:

- `docs/testing/jmeter/results/phase6-summary/aggregate-results.csv`
- `docs/testing/jmeter/results/phase6-summary/summary-tables.md`
- `docs/testing/jmeter/results/phase6-summary/charts/p90-response-time-ms.svg`
- `docs/testing/jmeter/results/phase6-summary/charts/throughput-per-second.svg`
- `docs/reports/phase-6-jmeter-performance-evaluation-report.md`

Final local verification:

| Check | Result |
|---|---|
| `xmllint --noout docs/testing/jmeter/*.jmx` | Passed |
| `node tools/check-database-schema.js` | Passed |
| `node tools/phase6-summarize-jmeter.js` | Passed; 35 rows written |
| `git diff --check` | Passed; only known CRLF/LF warning for `ElectronicMallVue/src/router/index.js` |
| `mvn -q test` | Passed |
| `mvn -q package` | Passed |
| `npm run check:auth` | Passed |
| `npm run check:deployment` | Passed |
| `npm run build` | Passed with existing Browserslist and asset-size warnings |

## Errors Encountered

| Time (+08) | Error | Attempt | Resolution |
|---|---|---|---|
| 14:43 | Sandbox DNS could not resolve Apache download hosts. | Retried downloads outside the sandbox with approval. | Download succeeded and SHA512 matched. |
| 14:50 | Sandboxed JMeter could not open public endpoint sockets. | Inspected JTL failure messages. | Reran JMeter outside the network sandbox; homepage validation passed. |
