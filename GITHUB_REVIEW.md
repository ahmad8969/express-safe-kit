# GitHub Review — express-safe-kit v0.1.0

**Date:** 2026-06-02

## Workflows

### 1. CI (required) ✅

**File:** `.github/workflows/ci.yml`

| Step | Action |
|------|--------|
| Trigger | push/PR to main, master |
| Matrix | Node 18, 20, 22 |
| Install | `npm ci` |
| Verify | `node scripts/prepublish.mjs` |

Covers: install, lint, test, coverage, audit, build.

### 2. Security (required) ✅

**File:** `.github/workflows/security.yml`

| Step | Action |
|------|--------|
| Trigger | push, PR, weekly Monday 06:00 UTC |
| Node | 22 |
| Verify | `npm audit` |

### 3. Publish (optional) — not included

**Recommendation:** Add after first successful npm publish:

```yaml
# .github/workflows/publish.yml (future)
# on:
#   release:
#     types: [published]
# uses: actions/setup-node with registry-url
# run: npm publish --provenance --access public
```

Requires `NPM_TOKEN` secret.

## Templates ✅

- Bug report
- Feature request
- Pull request template

## Branch protection (recommended)

After first push:

- Require CI status check
- Require PR reviews for external contributors (optional for solo)

## Verdict

**GitHub CI and security workflows are sufficient for v0.1.0.**
