# Repository Guidelines

## Project Structure & Module Organization

This is an existing Next.js App Router project with TypeScript, Tailwind CSS 4, and ESLint. Preserve its configuration and keep responsibilities separated using the following layout:

- `src/` — application source code, organized by feature or domain.
- `tests/` — automated tests mirroring the relevant `src/` structure.
- `assets/` — static images, sample data, and other non-code resources.
- `docs/` — project notes, design decisions, and user-facing documentation.

The current landing page uses `src/app/`, `src/components/landing/`, `src/components/three/`, `src/components/media/`, `src/components/ui/`, `src/hooks/`, and `src/lib/`. Public models live in `public/3dmodels/`; do not modify original model assets.

Prefer small, focused modules and keep generated files out of version control.

## Build, Test, and Development Commands

Canonical commands (also documented in README.md):

- `npm ci` — install dependencies.
- `npm run dev` — run Next.js locally.
- `npm run lint` — ESLint.
- `npm run typecheck` — TypeScript without emitting output.
- `npm run build` and `npm run start` — production build and server.
- `npm test` — Playwright regression tests against the production build; build first. Uses installed Chrome on Windows, Playwright Chromium elsewhere.

There is no separate formatter configured; preserve the existing two-space conventions. In PowerShell environments that block npm.ps1, use npm.cmd. When adding tooling, document commands here and in the README. At minimum, provide commands for:

- installing dependencies (for example, `npm install` or `pip install -r requirements.txt`);
- running the application locally (for example, `npm run dev`);
- running the full test suite (for example, `npm test`); and
- formatting and linting (for example, `npm run format` and `npm run lint`).

Run the formatter and tests before opening a pull request.

## Coding Style & Naming Conventions

Use the formatter and linter adopted by the project rather than relying on editor-specific settings. Use four spaces for Python and two spaces for JavaScript/TypeScript or JSON unless the selected toolchain specifies otherwise. Name files and directories consistently; use `kebab-case` for general folders, `PascalCase` for classes or UI components, and `camelCase` for variables and functions. Avoid unexplained abbreviations and keep functions narrowly scoped.

## Testing Guidelines

Playwright tests live under `tests/`; no coverage threshold is configured. Add tests for new behavior and regression cases with descriptive names. Keep tests deterministic: render the actual local GLB, but mock external YouTube transport for layout and player lifecycle tests. Cover responsive widths, scroll expansion, keyboard access, and prefers-reduced-motion. Generated test artifacts are ignored.

## Commit & Pull Request Guidelines

No Git history is available, so existing commit conventions cannot be inferred. Use concise imperative messages, preferably in the form `type: summary` (for example, `feat: add phone validation` or `fix: handle empty input`). Pull requests should explain the motivation, summarize the implementation, list validation commands and results, link related issues, and include screenshots or sample output for user-visible changes.

## Security & Configuration

Never commit passwords, API keys, private certificates, or personal data. Keep local overrides in ignored files such as `.env.local`, provide a sanitized example file, and validate external input at application boundaries.
