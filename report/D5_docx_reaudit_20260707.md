# D5 Revised DOCX Re-Audit - 2026-07-07

## Audited File

- Source DOCX: `/Users/rufeng/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_optdhuc1rizz22_dca5/temp/drag/D5_update_20260707_v2(1).docx`
- Main guideline: `report/guidelines/d5-NT- guidelines.pdf`
- Project evidence baseline: current repository documentation, deployment files, database schema, D5/D6/D7 drafts, and Phase 6 JMeter records.
- Review principle applied: each paragraph should justify its position, use a general-to-detail structure where needed, place claims near supporting evidence, avoid repeated appendix explanations, and mark limitations as boundaries rather than anxiety-reducing disclaimers.

## Overall Verdict

This revised D5 is much closer to the current project than the previous DOCX. The central chapters now mostly describe the actual cloud-hosted R Mall system: Vue 2 frontend, Spring Boot backend, Nginx reverse proxy on Google Cloud, MySQL, Redis, email verification, simulated payment, and JMeter evaluation.

However, it is not yet a clean pass under a strict D5 format and project-fit audit. I would mark it as a conditional pass only after cleanup. The remaining problems are concentrated in generated front matter, stale lists, appendix material, page count, and a few residual wording issues rather than the main Chapter 1-3 argument.

## Evidence Snapshot

| Item | Observation | Audit Meaning |
|---|---:|---|
| Extracted paragraphs | 884 | Large document; requires pruning discipline. |
| Tables | 18 | Enough structured design material, but stale table references must be removed. |
| Media files | 19 | Figure coverage is likely sufficient. |
| Word app page count | 68 | Above the 30-50 page D5 guideline range. |
| Rendered PNG pages | 75 | Render succeeds, but layout length still exceeds the expected range. |
| Word count | 14,820 | More controlled than the old version, but still long for D5. |
| References detected | about 19 entries | Minimum count is now satisfied, though relevance must be cleaned. |

## Passed Areas

### 1. D5 Macro-Structure

The document contains the required D5 shell: declaration, acknowledgement, Malay abstract, English abstract, table of contents, list of tables, list of figures, abbreviations, Chapter 1 Project Planning, Chapter 2 Literature Review, Chapter 3 Methodology, References, and Appendix.

This satisfies the broad proposal-report structure required by the NT D5 guideline.

### 2. Current Project Alignment in the Main Body

The main technical body is now mostly aligned with the real project. It describes the public HTTP deployment, Google Cloud VM, Nginx forwarding to Spring Boot on loopback port `9191`, MySQL/Redis data services, Vue storefront/admin client, SMTP email verification, order creation, simulated payment, and JMeter testing.

This is a major improvement over the previous DOCX, which still treated Docker, OAuth, Alipay, custom telemetry, and callback processing as implemented system features.

### 3. Network Technology Relevance

The revised body now has a defensible Network Technology angle. It covers browser-to-server HTTP flow, reverse proxy routing, OSI/protocol mapping, database communication, Redis session/cache use, and JMeter workload design.

The best D5 argument is no longer "commercial e-commerce completeness"; it is "a bounded cloud e-commerce platform used to evaluate client-server communication and network performance under controlled workloads." This is the correct direction.

### 4. Render Failure Fixed

The local LibreOffice headless rendering issue has been resolved. The revised DOCX successfully rendered to:

- PDF: `/private/tmp/d5_docx_reaudit_render/D5_update_20260707_v2(1).pdf`
- Page PNGs: `/private/tmp/d5_docx_reaudit_render/page-1.png` through `/private/tmp/d5_docx_reaudit_render/page-75.png`

Representative page images were generated as valid `1414 x 2000` PNG files, so the previous `libfontconfig.1.dylib` render blocker no longer prevents review.

## Blocking or Near-Blocking Issues

### 1. Page Count Exceeds the D5 Format Range

The guideline expects about 30-50 pages, while this DOCX reports 68 pages in Word metadata and renders as 75 PNG pages. This is the clearest remaining format risk.

Recommended fix: reduce repeated explanation, move nonessential material out of the main submission, shorten appendix content, and remove stale survey material. The strongest target is to bring the document below 55 pages, ideally near 50.

### 2. TOC, List of Figures, and List of Tables Still Contain Stale Items

The main body has improved, but the generated lists still expose old project assumptions. Examples found in extracted text include:

- `Authentication Interface (OAuth 2.0)`
- `Sequence Diagram for User Authentication (OAuth 2.0)`
- `WAN Gateway`
- `Secure Callback Processing`
- `Network_Trace_Log (Telemetry Core)`
- `Telemetry entities`

These entries are dangerous because examiners usually scan the front matter first. Even if the body later says these features are excluded, stale entries in lists make the report look internally inconsistent.

Recommended fix: delete or rename the source headings/tables/figures, then update all Word fields: table of contents, list of figures, and list of tables.

### 3. Appendix Survey Is Still Not Project-Aligned

The appendix still contains a needs assessment survey framed around high-concurrency e-commerce infrastructure, containerized hosting, OAuth/Alipay implementation, secure callbacks, and a custom latency dashboard. These do not match the final project scope.

If the survey was not actually conducted, it should not be presented as evidence. If it is kept, it must be reframed as a proposed requirements-validation instrument and cleaned so it refers only to the implemented system: cloud VM deployment, HTTP/Nginx routing, email verification, simulated payment, Redis-backed session/cache behavior, and JMeter performance evaluation.

Recommended fix: either remove this appendix or rewrite it as a short Appendix A/B supporting instrument. It should supplement Chapter 3, not repeat or contradict the body.

### 4. One Residual Cross-Chapter Error Remains

The methodology section contains wording equivalent to "The Chapter 4 should contain the complete executed values..." This is not suitable inside D5 because D5 should present the proposed or planned evaluation method, while detailed executed testing belongs to D7 or the final testing chapter.

Recommended fix: change this wording to refer to "D7 Testing" or "the later testing report", and keep D5 focused on the evaluation design, metrics, test parameters, and interpretation criteria.

### 5. AI Declaration Still Overstates the Prompted Scope

The AI declaration/prompt wording still mentions a secure containerized e-commerce infrastructure and Nginx load balancing. The project uses Nginx reverse proxying, not a documented load-balanced or containerized production architecture.

Recommended fix: make the declaration factual. It can say AI was used for grammar refinement, structure review, and alignment with Network Technology proposal-report criteria.

## Reference Section Review

The revised DOCX now has a real reference list with about 19 entries, which resolves the old version's missing-bibliography failure.

The remaining issue is relevance, not count. Some references still support Docker, OAuth, microservices, or containerization more than this actual implementation. A few such references can remain in the literature review if they are used for comparison or scope exclusion, but they should not dominate the bibliography.

Recommended replacement emphasis:

- HTTP/REST and browser-server communication.
- Nginx reverse proxy and web server performance.
- MySQL transactional consistency for web applications.
- Redis session/cache behavior.
- Spring Boot web application architecture.
- Apache JMeter load testing methodology.
- Cloud VM deployment or small-scale cloud-hosted web systems.

## Paragraph-Level Writing Audit

The revised core chapters are substantially better than the old draft. Most project claims are now placed near supporting design or implementation evidence.

The remaining paragraph-level problem is over-retention. Some parts explain what is not implemented, why it is not implemented, and how that boundary should be understood more than once. A limitation only needs to mark the boundary clearly. It does not need to repeatedly defend the author.

Practical rule for the next edit:

- Keep one paragraph for the judgement.
- Keep one evidence block or figure/table that supports it.
- Delete repeated explanation if the same boundary has already been stated in scope, methodology, or appendix.

## Required Fix Checklist Before Treating D5 as Passed

1. Update TOC, List of Figures, and List of Tables after deleting stale headings, figures, and tables.
2. Remove or rewrite all visible OAuth, Alipay, Docker/containerized, WAN gateway, secure callback, telemetry, and `Network_Trace_Log` front-matter/list entries unless explicitly framed as excluded comparison material.
3. Rewrite or remove the appendix survey so it no longer claims OAuth/Alipay/containerization/custom dashboard evidence.
4. Reduce page count toward the 30-50 page guideline range.
5. Replace the "Chapter 4" testing wording with D7/testing-report wording.
6. Align the AI declaration with the actual project and actual writing assistance.
7. Clean the reference list so most sources support the implemented stack and NT analysis.

## Decision for D6

I do not recommend starting the final D6 rewrite from this DOCX as a fully approved D5 yet. The main body is close enough that D6 planning can continue, but the D5 file itself should first receive the cleanup above.

If the listed fixes are made, especially the stale front-matter/list entries and appendix rewrite, this D5 should be able to pass the project-fit audit.

