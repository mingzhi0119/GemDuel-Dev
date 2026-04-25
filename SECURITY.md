# Security Policy

Gem Duel is an Electron + React desktop app in a monorepo, so the most security-sensitive areas are `apps/desktop/electron/**`, `packages/shared/src/logic/actionValidation/**`, `packages/shared/src/logic/network**`, `apps/desktop/src/hooks/onlineManager/**`, `tools/scripts/**`, and the release and dependency governance docs and snapshots.

## How to Report a Security Issue

- Prefer a private GitHub security advisory for anything that could expose users, credentials, IPC boundaries, release artifacts, or supply-chain data.
- Use the private advisory intake URL: <https://github.com/mingzhi0119/GemDuel-Dev/security/advisories/new>.
- If an advisory is not available, use the repo owner's private maintainer channel rather than a public issue.
- Conduct concerns that are not security vulnerabilities should follow [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
- Include the affected path, a short reproduction, expected impact, and whether the issue is local, remote, or dependency-related.
- Do not publish exploit details publicly until a fix is ready and the disclosure has been coordinated.

## What to Include

- Affected version or commit SHA
- Renderer, Electron main/preload, networking, or release workflow impact
- Logs or screenshots only if they are redacted
- Whether the issue touches IPC, authentication, update flow, secrets, or dependency policy

## Response Goals

- Acknowledge reports promptly.
- Confirm scope before broad disclosure.
- Land fixes with matching updates to `docs/governance/` or `tools/governance/` when a documented contract changes.
