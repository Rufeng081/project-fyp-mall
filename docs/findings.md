# Findings & Decisions

## Requirements
- Enable global Codex hooks by setting `codex_hooks = true`.
- Store this project's `task_plan.md`, `findings.md`, and `progress.md` in `docs/`.

## Research Findings
- `planning-with-files` global hooks use `resolve-plan-dir.sh`.
- The resolver checks `.planning/.active_plan` and `.planning/<plan-id>/` before falling back to root-level planning files.
- Pointing `.planning/docs` to `docs/` lets hooks read `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md` without changing the installed global hook scripts.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Configure active plan id as `docs` | Keeps plan state project-specific and readable. |
| Keep global hook scripts unchanged | Avoids creating a forked global hook setup for one project. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Global config edit requires explicit user approval | User provided explicit approval in the follow-up request. |

## Resources
- `/Users/rufeng/.codex/config.toml`
- `/Users/rufeng/.codex/hooks/resolve-plan-dir.sh`
- `/Users/rufeng/Desktop/project-fyp-mall/docs/`
