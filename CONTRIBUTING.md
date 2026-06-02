# Contributing to express-safe-kit

Thank you for helping improve **express-safe-kit**!

## Getting started

```bash
git clone https://github.com/ahmad8969/express-safe-kit.git
cd express-safe-kit
npm install
```

## Development workflow

```bash
npm run dev      # watch build
npm run lint     # strict TypeScript
npm test         # unit tests
npm run test:coverage
npm run build
```

## Pull request guidelines

1. Open an issue for large changes first.
2. Keep PRs focused — one feature or fix per PR.
3. Add or update tests for behavior changes.
4. Maintain **zero runtime dependencies** unless discussed in an issue.
5. Run `npm run lint`, `npm test`, and `npm audit` before submitting.
6. Update `README.md` and `CHANGELOG.md` when user-facing behavior changes.

## Code style

- TypeScript strict mode — no `any`, no `@ts-ignore`
- Prefer small, readable functions
- Comment only non-obvious logic
- Match existing file structure under `src/middleware`

## Reporting bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- Node.js version
- Express version (4 or 5)
- Minimal reproduction code

## Feature requests

Roadmap items live in `docs/ROADMAP.md`. Comment on an issue before implementing large features.

## License

By contributing, you agree your contributions will be licensed under the MIT License.
