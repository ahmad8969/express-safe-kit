# Release Checklist — express-safe-kit v0.1.0

Use this checklist immediately before `npm publish`.

## Build & quality

- [x] Build passes (`npm run build`)
- [x] Tests pass (`npm test` — 44/44)
- [x] Coverage above 90% (99% lines, 92% branches, 100% functions)
- [x] Audit clean (`npm audit` — 0 vulnerabilities)
- [x] Type definitions generated (`dist/index.d.ts`, `dist/index.d.cts`)
- [x] ESM works (`dist/index.js`, `exports.import`)
- [x] CommonJS works (`dist/index.cjs`, `exports.require`)

## Documentation

- [x] README verified (see `README_REVIEW.md`)
- [x] CHANGELOG v0.1.0 entry
- [x] SECURITY.md present
- [x] CONTRIBUTING.md present

## Package

- [x] Package size verified (~17.1 kB packed, 9 files)
- [x] Only dist + README + LICENSE published
- [x] No unfinished exports in public API
- [x] `sideEffects: false` set

## Open source

- [x] LICENSE (MIT)
- [x] CODE_OF_CONDUCT.md
- [x] GitHub issue/PR templates
- [x] CI workflow
- [x] Security audit workflow

## npm metadata

- [x] name, description, keywords
- [x] repository, homepage, bugs
- [x] engines >=18
- [x] peerDependencies express ^4 || ^5
- [x] prepublishOnly gate configured

## Maintainer manual steps

- [ ] Confirm package name available on npm
- [ ] Verify `funding` URL (if used)
- [ ] `npm login`
- [ ] `node scripts/prepublish.mjs`
- [ ] `npm pack --dry-run`
- [ ] `npm publish --access public` (add `--provenance` if desired)
- [ ] Git tag `v0.1.0` + GitHub Release

## Sign-off

**Automated gates:** PASS (2026-06-02)  
**Ready for publish:** YES
