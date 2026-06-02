# Publish Checklist — express-safe-kit v0.1.0

Use this checklist immediately before `npm publish`.

## Build & quality

- [ ] `npm install` completes without errors
- [ ] `npm run lint` passes (strict TypeScript)
- [ ] `npm test` passes (all tests)
- [ ] `npm run test:coverage` meets thresholds (≥90%)
- [ ] `npm audit` reports **0 vulnerabilities**
- [ ] `npm run build` succeeds

## Package artifacts

- [ ] `dist/index.js` exists (ESM)
- [ ] `dist/index.cjs` exists (CJS)
- [ ] `dist/index.d.ts` exists (types)
- [ ] `package.json` `exports` map is correct
- [ ] `files` field includes `dist`, `README.md`, `LICENSE`

## API & compatibility

- [ ] `expressSafeKit()` default API unchanged for explicit configs
- [ ] `res.success` / `res.error` / `res.created` / `res.noContent` typed via augmentation
- [ ] Express 4 and 5 peer range documented
- [ ] Production CORS behavior documented (breaking-adjacent default change)

## Documentation

- [ ] README complete (install, production, security, FAQ)
- [ ] `SECURITY.md` present
- [ ] `CONTRIBUTING.md` present
- [ ] `CHANGELOG.md` updated for v0.1.0
- [ ] `docs/ROADMAP.md` current
- [ ] Examples run (`examples/basic-server.ts`, etc.)

## npm metadata

- [ ] `name`: `express-safe-kit`
- [ ] `version`: `0.1.0`
- [ ] `repository`, `homepage`, `bugs`, `funding` filled in
- [ ] `keywords` optimized
- [ ] `engines.node`: `>=18`
- [ ] `author` and LICENSE correct

## GitHub (recommended)

- [ ] Issue templates enabled
- [ ] PR template enabled
- [ ] `CODE_OF_CONDUCT.md` committed
- [ ] GitHub Security Advisories enabled
- [ ] Discussions enabled (optional, recommended)

## Publish commands

```bash
npm run lint
npm test
npm run test:coverage
npm audit
npm run build
npm pack --dry-run
npm publish --access public
```

## Post-publish

- [ ] Create GitHub release from tag `v0.1.0`
- [ ] Verify package page on npmjs.com
- [ ] Smoke-test install: `npm install express-safe-kit express`
