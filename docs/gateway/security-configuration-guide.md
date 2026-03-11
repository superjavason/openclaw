---
summary: "Guide to configuring OpenClaw with secure parameters"
read_when:
  - Locking down your gateway deployment
  - Reviewing security-related config options
  - Following security audit recommendations
title: "Security Configuration Guide"
---

# Security Configuration Guide

This guide consolidates **all security-related configuration parameters** in OpenClaw. Use it to configure your gateway with secure defaults and avoid common footguns.

Run `openclaw security audit` (or `--deep`) regularly to validate your config. See [Security](/gateway/security) for the threat model and hardening rationale.

---

## Quick reference: secure baseline

Use this as your starting point, then widen access only as needed:

```json5
{
  gateway: {
    mode: "local",
    bind: "loopback",
    auth: { mode: "token", token: "replace-with-long-random-token" },
  },
  session: { dmScope: "per-channel-peer" },
  tools: {
    profile: "messaging",
    deny: ["group:automation", "group:runtime", "group:fs", "sessions_spawn", "sessions_send"],
    fs: { workspaceOnly: true },
    exec: { security: "deny", ask: "always" },
    elevated: { enabled: false },
  },
  channels: {
    whatsapp: { dmPolicy: "pairing", groups: { "*": { requireMention: true } } },
  },
}
```

---

## 1. Gateway and network

### Bind and exposure

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `gateway.bind` | string | `"loopback"` | `"lan"`, `"tailnet"`, `"custom"` without auth |
| `gateway.port` | number | `18789` (default) | — |
| `gateway.customBindHost` | string | — | `"0.0.0.0"` |

- **Loopback** (default): only local clients. Use SSH tunnels or Tailscale Serve for remote access.
- **Non-loopback** binds expand attack surface; always pair with `gateway.auth` (token/password).

### Authentication

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `gateway.auth.mode` | string | `"token"` or `"password"` | `"none"` |
| `gateway.auth.token` | string | Long random token (e.g. 32+ chars) | Short/predictable |
| `gateway.auth.password` | string | Strong password | Weak/short |
| `gateway.auth.allowTailscale` | boolean | `true` only when using Tailscale Serve | — |
| `gateway.auth.rateLimit` | object | Configure for brute-force protection | Omitted |

- Token: `openssl rand -hex 32`
- Use SecretRef for `gateway.auth.token`/`gateway.auth.password` instead of plaintext when possible ([Secrets](/gateway/secrets)).

### Control UI

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `gateway.controlUi.allowedOrigins` | string[] | Explicit origin list when non-loopback | Omitted for non-loopback |
| `gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback` | boolean | `false` | `true` |
| `gateway.controlUi.dangerouslyDisableDeviceAuth` | boolean | `false` | `true` |
| `gateway.controlUi.allowInsecureAuth` | boolean | `false` | `true` |

- `allowedOrigins` is **required** when the Control UI is reachable beyond loopback.
- `dangerouslyDisableDeviceAuth`: severe downgrade; keep off.

### Trusted proxies

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `gateway.trustedProxies` | string[] | Proxy IP CIDRs (e.g. `["127.0.0.1"]`) | Empty when behind proxy |
| `gateway.allowRealIpFallback` | boolean | `false` | `true` (enables source-IP spoofing risk) |

### Tailscale

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `gateway.tailscale.mode` | string | `"serve"` (not funnel) | `"funnel"` (public internet) |

- **Funnel** exposes the gateway to the public internet. Use only when you fully understand the risk.

### TLS

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `gateway.tls.enabled` | boolean | `true` for non-loopback HTTPS | — |
| `gateway.tls.certPath` | string | Valid cert path | — |
| `gateway.tls.keyPath` | string | Private key path | — |

---

## 2. Channel access

### DM policy (direct messages)

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `channels.<provider>.dmPolicy` | string | `"pairing"` or `"allowlist"` | `"open"` |
| `channels.<provider>.allowFrom` | string[] | Explicit IDs | `["*"]` |

- **pairing** (default): unknown senders get a pairing code; approve via `openclaw pairing approve <channel> <code>`.
- **allowlist**: only listed senders.
- **open**: anyone can DM; requires `allowFrom: ["*"]`. Avoid except for tightly controlled use.

### Group policy

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `channels.<provider>.groupPolicy` | string | `"allowlist"` | `"open"` |
| `channels.<provider>.groupAllowFrom` | string[] | Explicit group IDs | `["*"]` |
| `channels.<provider>.groups."*".requireMention` | boolean | `true` | `false` |

- **allowlist** (default): only configured groups.
- **open**: bypasses group allowlist. Use sparingly.
- **requireMention**: only respond when explicitly mentioned in groups.

### Config writes

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `channels.<provider>.configWrites` | boolean | `false` for untrusted channels | `true` (default) |

- Disables channel-initiated config mutations (e.g. Telegram `/config set`).

---

## 3. Tools

### Tool profile and allow/deny

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `tools.profile` | string | `"minimal"` or `"messaging"` | `"full"` for shared agents |
| `tools.allow` | string[] | Explicit tools only | — |
| `tools.deny` | string[] | `["gateway","cron","sessions_spawn","sessions_send"]` for untrusted | — |
| `agents.list[].tools.profile` | string | Avoid overriding minimal with broader | `"full"` |

- For agents that handle untrusted content, deny `gateway`, `cron`, `sessions_spawn`, `sessions_send`.

### Filesystem

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `tools.fs.workspaceOnly` | boolean | `true` | `false` |
| `tools.exec.applyPatch.enabled` | boolean | `false` or `true` with caution | — |
| `tools.exec.applyPatch.workspaceOnly` | boolean | `true` | `false` |

- `fs.workspaceOnly: true`: restricts read/write/edit/apply_patch to workspace.
- `applyPatch.workspaceOnly: true` (default): keeps apply_patch within workspace.

### Exec

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `tools.exec.security` | string | `"deny"` or `"allowlist"` | `"full"` |
| `tools.exec.ask` | string | `"always"` | `"off"` |
| `tools.exec.host` | string | `"sandbox"` when sandbox enabled | `"gateway"` for untrusted |

- If sandbox mode is off, `exec host=sandbox` resolves to host exec. Enable sandbox or tighten exec policy.

### Elevated (host) exec

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `tools.elevated.enabled` | boolean | `false` | `true` without tight allowlist |
| `tools.elevated.allowFrom` | object | Per-channel explicit IDs | `["*"]` or broad lists |

- Elevated runs on the host and bypasses sandbox. Keep allowlist very tight.

### Subagents and agent-to-agent

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `tools.agentToAgent.enabled` | boolean | `false` | `true` without allowlist |
| `tools.agentToAgent.allow` | string[] | Explicit agent IDs | `["*"]` |
| `tools.subagents.tools.allow` | string[] | Minimal set | Broad |
| `agents.list[].subagents.allowAgents` | string[] | Explicit agents | `["*"]` |

- Deny `sessions_spawn` unless delegation is required.
- Use `sessions_spawn` with `sandbox: "require"` when child must stay sandboxed.

---

## 4. Sandbox

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `agents.defaults.sandbox.mode` | string | `"non-main"` or `"all"` | `"off"` for shared agents |
| `agents.defaults.sandbox.scope` | string | `"agent"` or `"session"` | `"shared"` |
| `agents.defaults.sandbox.workspaceAccess` | string | `"none"` or `"ro"` | `"rw"` for untrusted |
| `agents.defaults.sandbox.docker.network` | string | `"none"` or `"bridge"` | `"host"`, `"container:*"` |
| `agents.defaults.sandbox.docker.dangerouslyAllowContainerNamespaceJoin` | boolean | `false` | `true` |
| `agents.defaults.sandbox.docker.dangerouslyAllowExternalBindSources` | boolean | `false` | `true` |
| `agents.defaults.sandbox.docker.dangerouslyAllowReservedContainerTargets` | boolean | `false` | `true` |

- Build images: `scripts/sandbox-setup.sh`, `scripts/sandbox-browser-setup.sh`.
- Sandbox browser: keep `allowHostControl: false` (default).

---

## 5. Commands

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `commands.bash` | boolean | `false` | `true` |
| `commands.config` | boolean | `false` | `true` |
| `commands.debug` | boolean | `false` | `true` |
| `commands.restart` | boolean | `false` | `true` |
| `commands.allowFrom` | object | Per-provider explicit IDs | `["*"]` |
| `commands.useAccessGroups` | boolean | `true` | `false` |

- `bash: true` enables `! <cmd>` on host shell; requires `tools.elevated.enabled` and sender in `tools.elevated.allowFrom`.

---

## 6. Hooks (webhooks)

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `hooks.token` | string | Long shared secret (32+ chars) | Short token |
| `hooks.allowRequestSessionKey` | boolean | `false` | `true` |
| `hooks.allowedSessionKeyPrefixes` | string[] | `["hook:"]` when needed | Omitted when sessionKey accepted |
| `hooks.gmail.allowUnsafeExternalContent` | boolean | `false` | `true` |
| `hooks.mappings[].allowUnsafeExternalContent` | boolean | `false` | `true` |

- Treat hook payloads as untrusted. Disable unsafe-content bypass flags unless debugging.
- For hook-driven agents: strong model tiers, strict tool policy, sandboxing.

---

## 7. Browser

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `browser.ssrfPolicy.dangerouslyAllowPrivateNetwork` | boolean | `false` for strict SSRF | `true` (default, trusted-operator model) |
| `browser.ssrfPolicy.allowedHostnames` | string[] | Explicit hostnames when strict | — |
| `browser.noSandbox` | boolean | `false` | `true` |
| `gateway.nodes.browser.mode` | string | `"off"` when not needed | `"auto"` |

- Browser control = operator-level access to whatever the profile can reach.
- Use dedicated profile; avoid personal browser with logged-in accounts.
- Strict SSRF: set `dangerouslyAllowPrivateNetwork: false` and use `hostnameAllowlist`/`allowedHostnames`.

---

## 8. Logging and redaction

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `logging.redactSensitive` | string | `"tools"` | `"off"` |
| `logging.redactPatterns` | string[] | Custom patterns for tokens, hostnames | — |

- Default tool-summary redaction helps avoid leaking secrets to logs.

---

## 9. Discovery (mDNS)

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `discovery.mdns.mode` | string | `"minimal"` or `"off"` | `"full"` |
| `discovery.wideArea.enabled` | boolean | `false` | `true` |

- **minimal** (default): omits `cliPath`, `sshPort` from TXT records.
- **full**: advertises filesystem paths and SSH port; use only on trusted LAN.

---

## 10. Session

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `session.dmScope` | string | `"per-channel-peer"` for multi-user | `"main"` when multiple DMs |
| `session.sendPolicy.default` | string | `"allow"` | — |
| `session.sendPolicy.rules` | array | Deny rules as needed | — |

- `per-channel-peer`: isolates DM context per channel+sender.

---

## 11. Plugins

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `plugins.allow` | string[] | Explicit plugin IDs | Omitted (loads all) |
| `plugins.entries.<id>.enabled` | boolean | Enable only trusted | — |

- Plugins run in-process with full gateway privileges. Install only from trusted sources.

---

## 12. Gateway node commands

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `gateway.nodes.allowCommands` | string[] | Minimal set | High-impact (camera, screen, contacts, etc.) |
| `gateway.nodes.denyCommands` | string[] | Deny high-impact | — |

- High-impact commands: camera, screen, contacts, calendar, SMS. Avoid adding them to `allowCommands`.

---

## 13. Gateway HTTP tools

| Parameter | Type | Secure value | Risky value |
|-----------|------|--------------|-------------|
| `gateway.tools.allow` | string[] | Minimal for HTTP API | Broad/dangerous tools |
| `gateway.tools.deny` | string[] | Deny dangerous tools | — |

- HTTP tools invoke runs control-plane agent path. Keep allowlist tight.

---

## Dangerous / break-glass flags

These options explicitly weaken security. Use only for debugging and revert quickly:

| Key | Purpose |
|-----|---------|
| `gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback` | Host-header origin fallback (DNS rebinding risk) |
| `gateway.controlUi.dangerouslyDisableDeviceAuth` | Disable device identity checks |
| `browser.ssrfPolicy.dangerouslyAllowPrivateNetwork` | Allow private/internal networks (default when unset) |
| `channels.*.dangerouslyAllowNameMatching` | Mutable name matching (channel-specific) |
| `agents.*.sandbox.docker.dangerouslyAllowContainerNamespaceJoin` | Allow `container:*` network |
| `agents.*.sandbox.docker.dangerouslyAllowExternalBindSources` | Allow external bind sources |
| `agents.*.sandbox.docker.dangerouslyAllowReservedContainerTargets` | Allow reserved container targets |
| `tools.exec.applyPatch.workspaceOnly: false` | Allow apply_patch outside workspace |

---

## Security audit checklist

When `openclaw security audit` reports findings:

1. **Critical**: fix immediately (e.g. `gateway.bind_no_auth`, `gateway.tailscale_funnel`, `fs.state_dir.perms_world_writable`).
2. **Open + tools**: lock down DMs/groups first (pairing/allowlists), then tighten tool policy.
3. **Public exposure**: ensure auth + bind/firewall are correct.
4. **Browser control**: treat like operator access; keep tailnet-only.
5. **Permissions**: `~/.openclaw` dirs `700`, config/credential files `600`.
6. **Plugins**: use explicit allowlist.

---

## Related docs

- [Security](/gateway/security) — Threat model and hardening
- [Configuration](/gateway/configuration) — Overview and common tasks
- [openclaw.json Parameter Reference](/gateway/openclaw-json-reference) — Full parameter list
- [Configuration Reference](/gateway/configuration-reference) — Channel and feature details
- [Sandboxing](/gateway/sandboxing) — Docker sandbox setup
