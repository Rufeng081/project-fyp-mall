# D5 DOCX Audit - 2026-07-07

## Audited File

`/Users/rufeng/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_optdhuc1rizz22_dca5/temp/drag/D5_update_20260420_v1(1).docx`

## Guideline Basis

The audit uses the Network Technology D5 proposal-report requirements in `report/guidelines/d5-NT- guidelines.pdf` and the extracted criteria previously provided in the conversation. D5 should contain:

- Abstract.
- Chapter 1: Project Planning.
- Chapter 2: Literature Review.
- Chapter 3: Methodology, combining D3 and D4 material.
- References.
- Appendix.
- Minimum 30 pages and maximum 50 pages.
- At least 10 recent and diverse references, including journal references.
- Network Technology treatment through protocols, OSI model, topology, testing, parameters, and analysis.

## Audit Verdict

The submitted D5 DOCX does **not** currently pass the format and project-fit audit.

The document has the broad D5 shell: declaration, acknowledgement, Malay and English abstracts, table of contents, Chapter 1, Chapter 2, Chapter 3, References, and Appendix. However, it contains major blocking issues that prevent it from being used as the approved D5 for the current project. The most serious issues are not small language problems; they are claim-evidence and project-scope conflicts.

## Blocking Issues

### 1. Project Fit Failure

The document repeatedly describes a different project architecture from the current implemented system.

Unsupported or stale claims found in the DOCX include:

| Term / claim family | Count in extracted DOCX text | Current project status |
|---|---:|---|
| Docker / container / containerized | 62 / 104 | Not implemented in current project deployment. |
| OAuth 2.0 / WeChat | 36 / 21 | Not implemented. Current project uses email verification, JWT, and Redis session state. |
| Alipay Sandbox | 36 | Not implemented. Current payment is simulated in the application. |
| HTTPS / 443 / HTTP-versus-HTTPS | 22 / 5 / 5 | Current public deployment is HTTP only on Nginx port 80. |
| Network_Trace_Log | 10 | No such table exists in current database. JMeter files are the performance evidence. |
| Telemetry / latency dashboard | 28 | Not implemented as a real-time UI module. |
| WAN callback / secure callback processing | 45 callback references | Not implemented; no external payment callback flow exists. |

These claims conflict with the current repository evidence: Vue 2 SPA, Spring Boot REST backend, MySQL, Redis, Nginx reverse proxy on Google Cloud VM, Brevo SMTP email verification, simulated payment, and Apache JMeter performance testing.

### 2. References Section Is Empty or Not Properly Present

The extracted document reaches a `References` heading and then immediately enters `NEEDS ASSESSMENT SURVEY`. No usable bibliography entries were found under the actual References section.

This fails the D5 requirement for at least 10 recent and diverse references, including journal references, in GAYA UKM style.

### 3. Page Count Exceeds D5 Guideline

The DOCX application properties report:

| Property | Extracted value |
|---|---:|
| Pages | 86 |
| Words | 21,618 |
| Characters | 123,226 |

The D5 guideline states a page range of 30-50 pages. Even allowing for front matter and appendix, this file is too long for the stated format.

### 4. Chapter 3 Mixes Requirement, Design, and Unsupported Implementation Claims

Chapter 3 includes many required D3/D4-like elements, including user needs, requirements, OSI model, system model, architecture, database, algorithms, and interface design. However, the substance is built around unsupported architecture:

- Docker bridge network IPs such as `172.17.0.x`.
- Nginx container and Spring Boot container topology.
- OAuth 2.0 authentication interface.
- Alipay callback verification.
- Telemetry table and dashboard.
- Port 443 / HTTPS assumptions.

These cannot remain in the current thesis because they would place claims far away from evidence and describe a system that was not implemented.

### 5. Abstract and Keywords Overclaim the Project

The Malay abstract and several early sections frame the project as a containerized, microservice-like, high-concurrency, WAN-integrated system with real-time telemetry. This is not the current project boundary.

The abstract should instead describe a bounded cloud-based small e-commerce platform evaluated over HTTP using Nginx, Spring Boot, MySQL, Redis, and Apache JMeter.

### 6. Appendix Repeats an Unproven Needs Assessment

The appendix contains a needs-assessment survey aimed at network engineers, system administrators, DevOps engineers, and backend developers, but the report does not provide enough evidence that such a survey was actually conducted with the stated `N=15`.

If the survey is real, it needs respondent evidence and a clear method. If not, it should be removed or converted into a proposed requirement-validation instrument, not presented as completed evidence.

## Format Elements That Are Present

The following D5 structural elements are present in broad form:

- Declaration.
- Acknowledgement.
- Malay abstract.
- English abstract.
- Table of contents.
- List of tables.
- List of illustrations.
- List of abbreviations.
- Chapter 1: Project Planning.
- Chapter 2: Literature Review.
- Chapter 3: Methodology.
- References heading.
- Appendix heading.

The structural shell is therefore recoverable, but the content inside the shell is not currently acceptable.

## Required Fix Direction

Use `report/D5_update_20260707_v4.md` as the safer current D5 base because it is aligned with the implemented project. If this DOCX must be retained, it needs a substantive rewrite:

1. Replace Docker/container/microservice topology with the current Google Cloud VM + Nginx + Spring Boot + MySQL + Redis deployment.
2. Replace OAuth/WeChat with current email verification, JWT, and Redis session handling.
3. Replace Alipay Sandbox and callback verification with simulated payment and transactional order/payment state update.
4. Replace `Network_Trace_Log` and telemetry dashboard with retained JMeter CSV, Markdown, SVG chart, execution record, and Phase 6 report evidence.
5. Remove HTTPS/443 and HTTP-versus-HTTPS claims unless HTTPS is implemented and tested later.
6. Rebuild the References section with at least 10 valid references in GAYA UKM style.
7. Reduce length toward the 30-50 page guideline by moving detail to appendix or deleting unsupported design material.
8. Keep each paragraph to one role: context, gap, approach, evidence, implication, or limitation.

## Decision Gate for D6

Because this D5 DOCX does not pass, D6 generation should not proceed as a consequence of this specific file passing. D6 can still be drafted later if the user explicitly asks to proceed despite this audit, or after D5 is corrected using the current project-aligned D5 version.

## Render / Layout Note

DOCX visual rendering initially failed because the local LibreOffice headless runtime expected Homebrew-style `fontconfig` and `freetype` dynamic-library paths. This local dependency issue was repaired by adding compatibility symlinks from `/opt/homebrew/opt/fontconfig/lib/libfontconfig.1.dylib` and `/opt/homebrew/opt/freetype/lib/libfreetype.6.dylib` to the bundled Codex runtime libraries. After the repair, `render_docx.py` successfully generated a PDF and 85 page PNG files under `/private/tmp/d5_docx_audit_render`.
