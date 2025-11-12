# Repository Guidelines

## Project Structure & Module Organization
- `src-web/`: React + TypeScript UI (Vite) with co-located Vitest specs (`*.test.tsx`) and public assets under `src-web/public/`.
- `src-tauri/`: Tauri host plus Rust crates (`yaak-*` for crypto, sync, plugins) alongside SQLite migrations and icons.
- `packages/`: Shared TypeScript libraries—common models, plugin runtime, and runtime types—consumed across workspaces.
- `plugins/`: Plugin workspaces (auth, importers, template functions) that bundle with the app.
- Repo configs (`tsconfig.json`, `eslint.config.cjs`, `rustfmt.toml`) and helper scripts in `scripts/` keep workspaces aligned; installers land in `dist/`.

## Build, Test, and Development Commands
- `npm install && npm run bootstrap` installs deps and vendors Node/protoc/tooling so Tauri builds stay offline.
- `npm start` or `make dev` launches the desktop client; `npm run app-build` or `make build` produces installers.
- `npm run build` recompiles all workspaces, while `npm run build --workspace <pkg>` targets a single package.
- `npm run test` runs Vitest suites; `cargo test -p yaak-<crate>` exercises individual Rust crates.
- `npm run lint`, `npm run icons`, and `npm run migration` handle linting, asset generation, and SQLite migrations.

## Coding Style & Naming Conventions
- TypeScript follows Prettier (2-space indent, single quotes) plus ESLint rules for type-only imports and React hooks; run `npm run lint -- --fix` before pushing.
- Components use `PascalCase`, hooks/helpers `camelCase`, config constants `SCREAMING_SNAKE_CASE`; prefer `src-web`-rooted imports over deep relatives.
- Rust code must satisfy `cargo fmt` + `cargo clippy` defaults; keep modules small and favor descriptive enum/struct names.

## Testing Guidelines
- Place Vitest files next to implementation (`collections-pane.test.ts`), assert user-facing behavior, and mock plugin calls via `packages/plugin-runtime`.
- Rust crates keep unit tests inline and integration suites under `src-tauri/<crate>/tests/`; every bug fix needs a regression test or documented manual scenario.

## Commit & Pull Request Guidelines
- Mirror current history: short, imperative commit subjects and optional scope prefixes (e.g., `core: fix indent guide hover`).
- Each PR should link related issues (`Closes #123`), describe risk, list verification commands (`npm test`, `cargo test`), and attach UI screenshots when visible changes occur.
- Keep PRs narrowly focused and squash noisy WIP commits before review because the project is only accepting bug-fix contributions.

## Security & Configuration Tips
- Secrets remain in the OS keychain; never commit `.env` overrides, license blobs, or sqlite files from production.
- Re-run `npm run bootstrap` whenever upgrading Node, Rust, or plugin dependencies to refresh vendored binaries and keep deterministic builds.
