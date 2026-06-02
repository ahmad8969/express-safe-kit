# Release Process — express-safe-kit

## Pre-release checklist

1. Update `CHANGELOG.md` with version section.
2. Ensure README reflects current public API.
3. Run full prepublish gate locally.
4. Verify `package.json` version bump (semver).

## Prepublish gate (`prepublishOnly`)

Publishing runs `scripts/prepublish.mjs`, which executes **in order**:

```bash
npm run lint
npm test
npm run test:coverage   # enforces ≥95% lines/functions, ≥90% branches
npm audit               # must be 0 vulnerabilities
npm run build
```

**Publishing fails if any step exits non-zero.**

## Manual release steps

```bash
# 1. Ensure clean working tree
git status

# 2. Run gate manually (optional, prepublish runs again)
node scripts/prepublish.mjs

# 3. Dry-run pack contents
npm pack --dry-run

# 4. Commit and tag
git add .
git commit -m "chore: release v0.1.0"
git tag v0.1.0
git push origin main --tags

# 5. Publish (first time: --access public)
npm publish --access public

# 6. Create GitHub Release from tag with CHANGELOG notes
```

## Versioning policy (semver)

| Change | Bump |
|--------|------|
| Breaking API | MAJOR |
| New stable feature | MINOR |
| Bug fix, docs | PATCH |

Pre-1.0.0: MINOR may include breaking changes with clear CHANGELOG notes.

## Post-release

1. Verify https://www.npmjs.com/package/express-safe-kit
2. Smoke test: `npm install express-safe-kit express` in fresh project
3. Open GitHub Release with install snippet
4. Monitor issues for 48h

## Rollback

```bash
npm deprecate express-safe-kit@<bad-version> "Reason"
# Publish patch if needed
```

Do not unpublish if version has significant downloads (npm policy).
