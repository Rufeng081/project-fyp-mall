# Video Presentation Content Alignment Design

## Purpose

Align the R Mall presentation landing page with the final `report/D8.pdf` while keeping the page concise enough for a three-minute innovation video.

## Authoritative Report Sections

- Chapter 1, pages 1-6: project background, problem statement, proposed solution, and the three project objectives.
- Chapter 4, Tables 4.17 and 4.18: overall JMeter results and highest-concurrency performance results.
- Chapter 4, sections 4.11.6 and 4.11.7: supported interpretation and limitations.
- Chapter 5, section 5.2: achievement of the three objectives.

## Approved Content Changes

### Chapter terminology

Replace every landing-page reference to `Phase 6` with reader-facing Chapter 4 terminology. The headline label becomes `Chapter 4 test summary`, and the results source names Chapter 4, Tables 4.17 and 4.18.

### Project background

Identify R Mall as a cloud-based small e-commerce platform developed both to support core shopping workflows and to provide a realistic client-server-database workload for Network Technology analysis. State the problem concisely: functional correctness alone does not explain the deployed request path or performance under concurrent access.

### Project objectives

Use concise versions that preserve the meaning of D8 section 1.4:

1. Design and develop a cloud-based small e-commerce platform that supports core online shopping functions.
2. Implement and analyse the network communication mechanisms used by the platform in a cloud environment.
3. Evaluate the network performance of the deployed platform under different test parameters using Apache JMeter.

### Results and limitations

Retain the verified values of 35 summarized rows, 3,197 sampler executions, 0 JMeter errors, 0.00% observed error rate, the stated thread boundaries, and the Table 4.18 P90 values. Keep the single-VM HTTP academic-prototype boundary in natural presentation language. Replace `reproducible` with `measured` because D8 demonstrates retained measurements rather than a formal reproducibility study.

### Presentation hygiene

The visible page must not contain AI self-reference, internal evidence-policy language, discarded-claim notes, author identity, institution identity, email addresses, matric numbers, or public IP addresses. Source and scope statements are allowed because they are project evidence and limitations from D8, not internal AI commentary.

## Verification

- Automated content verification must fail if visible `Phase 6` text remains or if the exact three report-aligned objectives are missing.
- Existing evidence-value, privacy, accessibility, visual-style, anchor, and deployment checks must remain green.
- Desktop and mobile browser review must confirm that the revised text remains legible and no internal wording appears.
- The deployed URL and original storefront must both return successful HTTP responses after deployment.
