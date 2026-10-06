# Repository Guidelines

## Project Structure & Module Organization

This repository is currently a clean project root with no source, test, asset, or configuration files detected. As the project grows, keep responsibilities separated using the following layout:

- `src/` — application source code, organized by feature or domain.
- `tests/` — automated tests mirroring the relevant `src/` structure.
- `assets/` — static images, sample data, and other non-code resources.
- `docs/` — project notes, design decisions, and user-facing documentation.

Prefer small, focused modules and keep generated files out of version control.

## Build, Test, and Development Commands

No build or test tooling is configured yet. When adding a toolchain, document the canonical commands here and in the project README. At minimum, provide commands for:

- installing dependencies (for example, `npm install` or `pip install -r requirements.txt`);
- running the application locally (for example, `npm run dev`);
- running the full test suite (for example, `npm test`); and
- formatting and linting (for example, `npm run format` and `npm run lint`).

Run the formatter and tests before opening a pull request.

## Coding Style & Naming Conventions

Use the formatter and linter adopted by the project rather than relying on editor-specific settings. Use four spaces for Python and two spaces for JavaScript/TypeScript or JSON unless the selected toolchain specifies otherwise. Name files and directories consistently; use `kebab-case` for general folders, `PascalCase` for classes or UI components, and `camelCase` for variables and functions. Avoid unexplained abbreviations and keep functions narrowly scoped.

## Testing Guidelines

No testing framework or coverage threshold is configured yet. Add tests for new behavior and regression cases, place them under `tests/`, and use descriptive names such as `test_rejects_invalid_phone_number`. Keep tests deterministic and independent of local machine state.

## Commit & Pull Request Guidelines

No Git history is available, so existing commit conventions cannot be inferred. Use concise imperative messages, preferably in the form `type: summary` (for example, `feat: add phone validation` or `fix: handle empty input`). Pull requests should explain the motivation, summarize the implementation, list validation commands and results, link related issues, and include screenshots or sample output for user-visible changes.

## Security & Configuration

Never commit passwords, API keys, private certificates, or personal data. Keep local overrides in ignored files such as `.env.local`, provide a sanitized example file, and validate external input at application boundaries.
