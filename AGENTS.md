# AGENTS.md

shotsnap is an npm package for Node.js that takes website screenshots by calling a hosted screenshot API (`https://shotsnap.vercel.app/api/screenshot`) and returns the image as a Buffer.

## Verify a change

CI (`.github/workflows/ci.yml`) runs these on the latest Node LTS:

- `npm ci`
- `npm run build` (tsc into `build/`)
- `npm test` (Jest with ts-jest)
- `npm run docs:build`

## Gotchas

- `npm test` calls the live screenshot API and needs network access. If it fails, check the service before blaming your change.
- `npm run build` writes `build/` (package `main` is `build/src/index.js`), and `.gitignore` does not cover it. Keep it out of commits.
- Both `package-lock.json` and `yarn.lock` are committed. CI and publishing use `npm ci`. When dependencies change, update both, as the last deps fix did.
- `docs/.vitepress/cache` is committed. The build leaves it alone, but the VitePress dev server rewrites it, so keep those changes out of commits.
- Every screenshot goes through the hosted API. There is no local browser or proxy mode, and `shotsnap-puppeteer` does not exist, so don't document either.
- `generated.txt` was written by an old GitHub Actions job (commits named "Builded by GH Actions", last one in 2023). Nothing writes it now.
- Publishing runs when a GitHub release is created: `npm ci && npm run build`, then `npm publish` with the `NPM_TOKEN` secret.

## Docs site

- VitePress source lives in `docs/`, with the config in `docs/.vitepress/config.mts` and base `/shotsnap/`. It is served at https://halitsever.github.io/shotsnap/ with `.html` page URLs.
- `.github/workflows/docs.yml` deploys on every push to `main`.
- A new page needs `title` and `description` lines in its frontmatter, one H1, a sidebar entry in the config and a line in `docs/public/llms.txt`. The sitemap, canonical and `og:url` tags are generated.

## Conventions

- Commit messages are a conventional-commit subject line in English, with no body and no trailer.
- Work on a branch and open a PR against `main`. The owner merges.
- New text carries no emoji. Code comments stay short, one line where possible, and explain why.
- The README follows the owner's template. Every image served from `halitsever-api.vercel.app` stays byte-for-byte. Only the `title=` value of `api/repo-title` and the link around `api/issue` may be corrected.
- The owner bumps versions and publishes to npm.
