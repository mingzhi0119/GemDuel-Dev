# Security Policy

Gem Duel is an Electron + React desktop app, so the most security-sensitive areas are `electron/**`, `src/logic/actionValidation/**`, `src/logic/network**`, `src/hooks/onlineManager/**`, and the release and dependency governance scripts.

## How to report a security issue

- Prefer a private GitHub security advisory for anything that could expose users, credentials, IPC boundaries, release artifacts, or supply-chain data.
- If an advisory is not available, use the repo owner's private maintainer channel rather than a public issue.
- Include the affected path, a short reproduction, expected impact, and whether the issue is local, remote, or dependency-related.
- Do not publish exploit details publicly until a fix is ready and the disclosure has been coordinated.

## What to include

- Affected version or commit SHA
- Renderer, Electron main/preload, networking, or release workflow impact
- Logs or screenshots only if they are redacted
- Whether the issue touches IPC, authentication, update flow, secrets, or dependency policy

## Response goals

- Acknowledge reports promptly.
- Confirm scope before broad disclosure.
- Land fixes with matching updates to `docs/governance/` or `governance/` when a documented contract changes.
