# Task Plan: Project Function Verification And Docs Cleanup

## Goal
Verify the mall project functions, with emphasis on email verification, registration auto-login, and default nickname behavior, then document the industrialized verification workflow and reorganize `docs` without deleting content.

## Current Phase
Phase 5

## Phases

### Phase 1: Requirements And Discovery
- [x] Capture user requirements and constraints
- [x] Read docs history and authentication-related code
- [x] Document findings in `findings.md`
- **Status:** complete

### Phase 2: Verification Plan
- [x] Identify backend and frontend verification commands
- [x] Define feature checklist for email code, registration, login, nickname, and core workflows
- **Status:** complete

### Phase 3: Implementation Fixes If Needed
- [x] Fix any missing or broken behavior found during verification
- [x] Keep edits scoped to existing changes and project patterns
- **Status:** complete

### Phase 4: Test And Functional Verification
- [x] Run backend tests/build
- [x] Run frontend checks/build
- [x] Verify documented feature checklist against code and tests
- **Status:** complete

### Phase 5: Docs Workflow And Organization
- [x] Write standard industrialized verification workflow into `docs`
- [x] Reorganize docs by adding indexes/navigation and consolidating duplicates without deleting files
- [ ] Final review and handoff
- **Status:** in_progress

## Key Questions
1. Does registration via email verification return the same authenticated user/token shape expected by the frontend?
2. Is a newly registered user's `nickname` defaulted to the username?
3. Do email verification controls enforce code TTL, purpose separation, duplicate checks, and reset behavior?
4. Can the current backend/frontend build and targeted checks pass locally?
5. How should `docs` be organized without deleting any existing content?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Treat existing dirty changes as user/provided work | Workspace already contains authentication and docs changes; reverting them would violate the user's constraint. |
| Use additive docs organization | User explicitly forbids deletion without approval, so cleanup will use indexes, summaries, and ordering instead of removing files. |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Login request missing both `account` and `username` throws `NullPointerException` | 1 | Add explicit validation and rerun targeted tests. |

## Notes
- Do not delete any file under `docs` without explicit approval.
- Prefer existing Maven/NPM scripts and current project conventions.
