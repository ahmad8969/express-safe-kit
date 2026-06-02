# Package Size Report — express-safe-kit v0.1.0

**Date:** 2026-06-02  
**Command:** `npm pack --dry-run`

## Summary

| Metric | Value |
|--------|-------|
| **Packed size** | **17.1 kB** |
| **Unpacked size** | **101.7 kB** |
| **Files in tarball** | **9** |

## Included files ✅

| File | Approx. size |
|------|----------------|
| `LICENSE` | 1.1 kB |
| `README.md` | 10.9 kB |
| `package.json` | 1.8 kB |
| `dist/index.js` | 12.1 kB (ESM) |
| `dist/index.cjs` | 14.1 kB (CJS) |
| `dist/index.d.ts` | 3.6 kB |
| `dist/index.d.cts` | 3.6 kB |
| `dist/index.js.map` | 27.2 kB |
| `dist/index.cjs.map` | 27.3 kB |

## Excluded files ✅

| Path | Excluded by |
|------|-------------|
| `src/` | `files` whitelist |
| `tests/` | `files` whitelist |
| `coverage/` | `files` whitelist |
| `docs/` | `files` whitelist |
| `examples/` | `files` whitelist |
| `.github/` | `files` whitelist |
| `scripts/` | `files` whitelist |
| `*.md` (except README) | `files` whitelist |
| `src/middleware/roadmap/` | Not imported → not in `dist/` |

## Consumer install impact

- **Zero runtime dependencies** from this package
- Peer: `express` only
- Suitable for edge/serverless cold starts (small footprint)

## Verdict

**Package size is optimal for publish.** No files to remove from tarball.
