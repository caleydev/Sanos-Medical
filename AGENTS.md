<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project handoff

New here? Read [`HANDOFF.md`](./HANDOFF.md) first — it has the current build
status, architecture, conventions, gotchas, and what's left. The requirements
live in [`SPEC.md`](./SPEC.md); setup/deploy in [`README.md`](./README.md);
granular remaining work in [`content/TODO.md`](./content/TODO.md).

All UI copy lives in `messages/{en,es}.json` — never hard-code strings. Verify
changes with `npm run typecheck && npm run lint && npm run build`.
