---
summary: "Complete parameter reference for openclaw.json configuration file"
read_when:
  - Looking up a specific config parameter
  - Understanding allowed values and defaults
  - Validating configuration structure
title: "openclaw.json Parameter Reference"
---

# openclaw.json Complete Parameter Reference

This document lists **every parameter** in `~/.openclaw/openclaw.json`, with type, allowed values, defaults, and descriptions. Config format is **JSON5** (comments and trailing commas allowed). All fields are optional.

For task-oriented setup, see [Configuration](/gateway/configuration). For channel-specific details, see [Configuration Reference](/gateway/configuration-reference).

---

## File Location and Format

| Item | Value |
|------|-------|
| Default path | `~/.openclaw/openclaw.json` |
| Override | `OPENCLAW_CONFIG_PATH` environment variable |
| Format | JSON5 (JSON with comments, trailing commas) |
| Validation | Strict schema; unknown keys cause startup failure |

---

## Top-Level Sections

| Section | Description |
|---------|-------------|
| `meta` | System-managed metadata |
| `env` | Environment variables and shell import |
| `wizard` | Onboarding wizard state |
| `diagnostics` | Tracing, telemetry, cache inspection |
| `logging` | Log levels, destinations, redaction |
| `cli` | CLI presentation (banner, tagline) |
| `update` | Update channel and auto-update |
| `browser` | Browser/CDP runtime |
| `ui` | UI accent color and assistant |
| `secrets` | Secret management |
| `skills` | Skills loading and entries |
| `plugins` | Plugin configuration |
| `models` | Model providers and catalog |
| `nodeHost` | Node host capabilities |
| `agents` | Agent defaults and list |
| `tools` | Tool access policy |
| `bindings` | Routing and ACP bindings |
| `broadcast` | Broadcast routing |
| `audio` | Audio transcription |
| `media` | Media handling |
| `messages` | Message formatting, queue, TTS |
| `commands` | Chat command handling |
| `approvals` | Exec approval forwarding |
| `session` | Session scope, reset, maintenance |
| `web` | Web channel settings |
| `channels` | Channel providers (WhatsApp, Telegram, etc.) |
| `cron` | Cron jobs |
| `hooks` | Hooks and Gmail |
| `discovery` | mDNS and wide-area discovery |
| `canvasHost` | Canvas host server |
| `talk` | Talk mode (voice synthesis) |
| `gateway` | Gateway runtime |
| `memory` | Memory backend |
| `acp` | ACP runtime |

---

## meta

System-managed metadata. Do not edit manually unless debugging.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `meta.lastTouchedVersion` | string | - | Last OpenClaw version that wrote this config |
| `meta.lastTouchedAt` | string | - | ISO timestamp of last config write |

---

## env

Environment import and override.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `env.shellEnv.enabled` | boolean | - | Load vars from login shell (`$SHELL -l -c 'env -0'`) |
| `env.shellEnv.timeoutMs` | number | 15000 | Timeout for shell env resolution (ms) |
| `env.vars` | object | - | Key/value env overrides merged into process |
| `env.<key>` | string | - | Sugar: env vars directly under `env` |

---

## wizard

Setup wizard state (auto-maintained).

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `wizard.lastRunAt` | string | - | ISO timestamp of last wizard run |
| `wizard.lastRunVersion` | string | - | OpenClaw version at last wizard run |
| `wizard.lastRunCommit` | string | - | Source commit (dev builds) |
| `wizard.lastRunCommand` | string | - | Command invoked |
| `wizard.lastRunMode` | string | - | `"local"` or `"remote"` |

---

## diagnostics

Tracing, telemetry, cache inspection.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `diagnostics.enabled` | boolean | - | Master toggle for diagnostics |
| `diagnostics.flags` | string[] | - | Enable by flag (e.g. `["telegram.http"]`, `"*"`) |
| `diagnostics.stuckSessionWarnMs` | number | - | Age threshold for stuck-session warnings (ms) |
| `diagnostics.otel.enabled` | boolean | false | OpenTelemetry export |
| `diagnostics.otel.endpoint` | string | - | Collector endpoint URL |
| `diagnostics.otel.protocol` | string | - | `"http/protobuf"` or `"grpc"` |
| `diagnostics.otel.headers` | object | - | Extra HTTP/gRPC headers |
| `diagnostics.otel.serviceName` | string | - | Service name in telemetry |
| `diagnostics.otel.traces` | boolean | - | Export traces |
| `diagnostics.otel.metrics` | boolean | - | Export metrics |
| `diagnostics.otel.logs` | boolean | - | Export logs |
| `diagnostics.otel.sampleRate` | number | - | Trace sampling rate (0–1) |
| `diagnostics.otel.flushIntervalMs` | number | - | Flush interval (ms) |
| `diagnostics.cacheTrace.enabled` | boolean | false | Log cache trace snapshots |
| `diagnostics.cacheTrace.filePath` | string | - | JSONL output path |
| `diagnostics.cacheTrace.includeMessages` | boolean | true | Include full messages |
| `diagnostics.cacheTrace.includePrompt` | boolean | true | Include prompt |
| `diagnostics.cacheTrace.includeSystem` | boolean | true | Include system prompt |

---

## logging

Log levels, destinations, redaction.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `logging.level` | string | - | `"silent" | "fatal" | "error" | "warn" | "info" | "debug" | "trace"` |
| `logging.file` | string | - | File path for persistence |
| `logging.consoleLevel` | string | - | Console-specific threshold |
| `logging.consoleStyle` | string | - | `"pretty" | "compact" | "json"` |
| `logging.redactSensitive` | string | - | `"off"` or `"tools"` |
| `logging.redactPatterns` | string[] | - | Custom regex patterns for masking |

**Env override:** `OPENCLAW_LOG_LEVEL` overrides `logging.level`.

---

## cli

CLI presentation.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `cli.banner.taglineMode` | string | - | `"random" | "default" | "off"` |

---

## update

Update channel and auto-update.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `update.channel` | string | - | `"stable" | "beta" | "dev"` |
| `update.checkOnStart` | boolean | true | Check for updates on gateway start |
| `update.auto.enabled` | boolean | false | Background auto-update |
| `update.auto.stableDelayHours` | number | 6 | Min delay before stable auto-apply |
| `update.auto.stableJitterHours` | number | 12 | Stable rollout jitter |

---

## browser

Browser/CDP runtime.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `browser.enabled` | boolean | - | Enable browser capability |
| `browser.cdpUrl` | string | - | Remote CDP WebSocket URL |
| `browser.color` | string | - | Accent color |
| `browser.executablePath` | string | - | Browser executable path |
| `browser.headless` | boolean | - | Force headless mode |
| `browser.noSandbox` | boolean | - | Disable Chromium sandbox |
| `browser.attachOnly` | boolean | - | Attach-only mode (no local launch) |
| `browser.cdpPortRangeStart` | number | - | Start CDP port for auto-allocation |
| `browser.defaultProfile` | string | - | Default profile name |
| `browser.relayBindHost` | string | - | Relay bind IP |
| `browser.profiles.<name>.cdpPort` | number | - | Per-profile CDP port |
| `browser.profiles.<name>.cdpUrl` | string | - | Per-profile CDP URL |
| `browser.profiles.<name>.driver` | string | - | `"openclaw"` or `"extension"` |
| `browser.profiles.<name>.attachOnly` | boolean | - | Per-profile attach-only |
| `browser.profiles.<name>.color` | string | - | Per-profile color |
| `browser.evaluateEnabled` | boolean | - | Enable browser evaluate |
| `browser.snapshotDefaults.mode` | string | - | Snapshot extraction mode |
| `browser.ssrfPolicy.dangerouslyAllowPrivateNetwork` | boolean | - | Allow private network |
| `browser.ssrfPolicy.allowedHostnames` | string[] | - | Hostname allowlist |
| `browser.remoteCdpTimeoutMs` | number | - | Remote CDP connect timeout |
| `browser.remoteCdpHandshakeTimeoutMs` | number | - | CDP handshake timeout |

---

## ui

UI accent and assistant.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `ui.seamColor` | string | - | Accent color (hex) |
| `ui.assistant.name` | string | - | Assistant display name |
| `ui.assistant.avatar` | string | - | Avatar (emoji, text, or URL) |

---

## secrets

Secret management. See [Secrets](/gateway/secrets).

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `secrets.profiles` | object | - | Named secret profiles |
| `secrets.apply` | object | - | Apply targets and rules |

---

## skills

Skills loading and entries.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `skills.load.extraDirs` | string[] | - | Extra skill directories |
| `skills.load.watch` | boolean | - | Watch for skill filesystem changes |
| `skills.load.watchDebounceMs` | number | - | Debounce for reloads |
| `skills.install.nodeManager` | string | - | `"npm" | "pnpm" | "yarn" | "bun"` |
| `skills.entries.<key>.enabled` | boolean | - | Enable/disable skill |
| `skills.entries.<key>.apiKey` | string | - | Skill API key |
| `skills.entries.<key>.env` | object | - | Key/value env for skill |
| `skills.entries.<key>.config` | object | - | Skill-specific config |

---

## plugins

Plugin configuration.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `plugins.entries.<id>.enabled` | boolean | - | Enable plugin |
| `plugins.entries.<id>.config` | object | - | Plugin config |

---

## models

Model catalog and providers.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `models.mode` | string | `"merge"` | `"merge"` or `"replace"` |
| `models.providers.<id>.baseUrl` | string | - | Provider API base URL |
| `models.providers.<id>.apiKey` | string | - | API key |
| `models.providers.<id>.auth` | string | - | `"api-key" | "token" | "oauth" | "aws-sdk"` |
| `models.providers.<id>.api` | string | - | Adapter: `openai-completions`, `anthropic-messages`, etc. |
| `models.providers.<id>.headers` | object | - | Extra HTTP headers |
| `models.providers.<id>.models` | array | - | Model list |

---

## nodeHost

Node host capabilities.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `nodeHost.browserProxy.enabled` | boolean | - | Expose browser proxy |
| `nodeHost.browserProxy.allowProfiles` | string[] | - | Profile allowlist |

---

## agents

Agent defaults and list. See [Configuration Reference](/gateway/configuration-reference#agent-defaults).

### agents.defaults

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `agents.defaults.workspace` | string | `~/.openclaw/workspace` | Default workspace |
| `agents.defaults.repoRoot` | string | - | Repo root for system prompt |
| `agents.defaults.skipBootstrap` | boolean | - | Skip bootstrap file creation |
| `agents.defaults.bootstrapMaxChars` | number | 20000 | Max chars per bootstrap file |
| `agents.defaults.bootstrapTotalMaxChars` | number | 150000 | Max total bootstrap chars |
| `agents.defaults.bootstrapPromptTruncationWarning` | string | `"once"` | `"off" | "once" | "always"` |
| `agents.defaults.imageMaxDimensionPx` | number | 1200 | Max image dimension |
| `agents.defaults.userTimezone` | string | - | IANA timezone |
| `agents.defaults.timeFormat` | string | `"auto"` | `"auto" | "12" | "24"` |
| `agents.defaults.model` | string/object | - | Primary model or `{ primary, fallbacks }` |
| `agents.defaults.imageModel` | string/object | - | Vision model |
| `agents.defaults.pdfModel` | string/object | - | PDF model |
| `agents.defaults.models` | object | - | Model catalog |
| `agents.defaults.maxConcurrent` | number | 1 | Max parallel agent runs |
| `agents.defaults.heartbeat.every` | string | `"30m"` | Heartbeat interval |
| `agents.defaults.heartbeat.model` | string | - | Heartbeat model |
| `agents.defaults.heartbeat.includeReasoning` | boolean | - | Include reasoning |
| `agents.defaults.heartbeat.lightContext` | boolean | false | Light bootstrap context |
| `agents.defaults.heartbeat.suppressToolErrorWarnings` | boolean | false | Suppress tool errors |
| `agents.defaults.compaction.mode` | string | - | `"default" | "safeguard"` |
| `agents.defaults.compaction.reserveTokensFloor` | number | 24000 | Reserve tokens |
| `agents.defaults.compaction.identifierPolicy` | string | `"strict"` | `"strict" | "off" | "custom"` |
| `agents.defaults.compaction.postCompactionSections` | string[] | - | Sections to re-inject |
| `agents.defaults.sandbox.mode` | string | - | `"off" | "non-main" | "all"` |
| `agents.defaults.sandbox.scope` | string | - | `"session" | "agent" | "shared"` |
| `agents.defaults.sandbox.workspaceAccess` | string | - | `"none" | "ro" | "rw"` |
| `agents.defaults.typingMode` | string | - | `"never" | "instant" | "thinking" | "message"` |
| `agents.defaults.typingIntervalSeconds` | number | 6 | Typing interval |

### agents.list[]

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `agents.list[].id` | string | - | Agent ID (required) |
| `agents.list[].default` | boolean | - | Default agent |
| `agents.list[].name` | string | - | Display name |
| `agents.list[].workspace` | string | - | Workspace path |
| `agents.list[].agentDir` | string | - | Agent directory |
| `agents.list[].model` | string/object | - | Model override |
| `agents.list[].identity.name` | string | - | Identity name |
| `agents.list[].identity.avatar` | string | - | Avatar path/URL |
| `agents.list[].identity.emoji` | string | - | Emoji |
| `agents.list[].identity.theme` | string | - | Theme |
| `agents.list[].groupChat.mentionPatterns` | string[] | - | Mention regex patterns |
| `agents.list[].sandbox` | object | - | Sandbox override |
| `agents.list[].runtime.type` | string | - | `"embedded"` or `"acp"` |
| `agents.list[].runtime.acp` | object | - | ACP runtime defaults |
| `agents.list[].tools.profile` | string | - | Tool profile |
| `agents.list[].tools.alsoAllow` | string[] | - | Extra allowed tools |
| `agents.list[].tools.deny` | string[] | - | Denied tools |

---

## tools

Tool access policy. See [Configuration Reference](/gateway/configuration-reference#tools).

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `tools.profile` | string | - | `"minimal" | "coding" | "messaging" | "full"` |
| `tools.allow` | string[] | - | Tool allowlist |
| `tools.deny` | string[] | - | Tool denylist |
| `tools.alsoAllow` | string[] | - | Extra allowed tools |
| `tools.byProvider` | object | - | Per-provider overrides |
| `tools.exec.host` | string | - | Exec host strategy |
| `tools.exec.security` | string | - | Security posture |
| `tools.exec.ask` | string | - | Approval strategy |
| `tools.exec.backgroundMs` | number | 10000 | Background exec timeout |
| `tools.exec.timeoutSec` | number | 1800 | Exec timeout |
| `tools.exec.notifyOnExit` | boolean | true | Notify on exit |
| `tools.exec.approvalRunningNoticeMs` | number | - | Notice delay before approval |
| `tools.exec.applyPatch.enabled` | boolean | false | Enable apply_patch |
| `tools.exec.applyPatch.workspaceOnly` | boolean | true | Restrict to workspace |
| `tools.elevated.enabled` | boolean | false | Enable elevated exec |
| `tools.elevated.allowFrom` | object | - | Sender allowlist per channel |
| `tools.agentToAgent.enabled` | boolean | false | Enable agent_to_agent |
| `tools.agentToAgent.allow` | string[] | - | Target agent allowlist |
| `tools.agentToAgent.deny` | string[] | - | Target agent denylist |
| `tools.subagents.tools.allow` | string[] | - | Subagent tool allow |
| `tools.subagents.tools.deny` | string[] | - | Subagent tool deny |
| `tools.sandbox.tools.allow` | string[] | - | Sandbox tool allow |
| `tools.sandbox.tools.deny` | string[] | - | Sandbox tool deny |
| `tools.sessions.visibility` | string | `"tree"` | `"self" | "tree" | "agent" | "all"` |
| `tools.web.search.enabled` | boolean | - | Enable web_search |
| `tools.web.search.provider` | string | - | `"brave" | "gemini" | "grok" | "kimi" | "perplexity"` |
| `tools.web.search.apiKey` | string | - | Brave API key |
| `tools.web.search.maxResults` | number | 5 | Max results |
| `tools.web.search.timeoutSeconds` | number | - | Timeout |
| `tools.web.fetch.enabled` | boolean | - | Enable web_fetch |
| `tools.web.fetch.maxChars` | number | - | Max chars returned |
| `tools.web.fetch.timeoutSeconds` | number | - | Timeout |
| `tools.loopDetection.enabled` | boolean | false | Enable loop detection |
| `tools.loopDetection.historySize` | number | 30 | History window |
| `tools.loopDetection.warningThreshold` | number | 10 | Warning threshold |
| `tools.loopDetection.criticalThreshold` | number | 20 | Critical threshold |
| `tools.loopDetection.globalCircuitBreakerThreshold` | number | 30 | Hard stop |
| `tools.fs.workspaceOnly` | boolean | false | Restrict FS tools to workspace |

---

## bindings

Routing and ACP bindings.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `bindings[].type` | string | `"route"` | `"route"` or `"acp"` |
| `bindings[].agentId` | string | - | Target agent ID |
| `bindings[].match.channel` | string | - | Channel ID (required) |
| `bindings[].match.accountId` | string | - | Account selector |
| `bindings[].match.peer.kind` | string | - | `"direct" | "group" | "channel"` |
| `bindings[].match.peer.id` | string | - | Conversation ID |
| `bindings[].match.guildId` | string | - | Discord guild ID |
| `bindings[].match.teamId` | string | - | Team/workspace ID |
| `bindings[].acp.mode` | string | - | ACP session mode |
| `bindings[].acp.label` | string | - | ACP label |
| `bindings[].acp.cwd` | string | - | Working directory |
| `bindings[].acp.backend` | string | - | ACP backend |

---

## broadcast

Broadcast routing.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `broadcast.strategy` | string | - | `"parallel"` or `"sequential"` |
| `broadcast.<sourcePeerId>` | string[] | - | Destination peer IDs |

---

## audio

Audio transcription.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `audio.transcription.command` | string[] | - | Command + args for transcription |
| `audio.transcription.timeoutSeconds` | number | - | Timeout |

---

## media

Media handling.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `media.preserveFilenames` | boolean | - | Preserve original filenames |
| `media.ttlHours` | number | - | Retention window for cleanup |

---

## messages

Message formatting, queue, TTS. See [Configuration Reference](/gateway/configuration-reference#messages).

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `messages.responsePrefix` | string | - | Response prefix or `"auto"` |
| `messages.ackReaction` | string | - | Ack reaction (e.g. `"👀"`) |
| `messages.ackReactionScope` | string | - | `"group-mentions" | "group-all" | "direct" | "all"` |
| `messages.removeAckAfterReply` | boolean | false | Remove ack after reply |
| `messages.queue.mode` | string | - | `"collect" | "steer" | "followup" | "queue" | "interrupt"` |
| `messages.queue.debounceMs` | number | 1000 | Debounce time |
| `messages.queue.cap` | number | 20 | Queue cap |
| `messages.queue.drop` | string | - | `"old" | "new" | "summarize"` |
| `messages.inbound.debounceMs` | number | 2000 | Inbound debounce |
| `messages.groupChat.historyLimit` | number | - | Group history limit |
| `messages.tts.auto` | string | - | `"off" | "always" | "inbound" | "tagged"` |
| `messages.tts.mode` | string | - | `"final"` or `"all"` |
| `messages.tts.provider` | string | - | TTS provider |

---

## commands

Chat command handling.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `commands.native` | string | `"auto"` | `"auto"` or boolean |
| `commands.text` | boolean | true | Parse /commands |
| `commands.bash` | boolean | false | Allow `!` (bash) |
| `commands.bashForegroundMs` | number | 2000 | Bash foreground timeout |
| `commands.config` | boolean | false | Allow /config |
| `commands.debug` | boolean | false | Allow /debug |
| `commands.restart` | boolean | false | Allow /restart |
| `commands.allowFrom` | object | - | Per-provider allowlist |
| `commands.useAccessGroups` | boolean | true | Use access groups |

---

## approvals

Exec approval forwarding.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `approvals.exec.enabled` | boolean | false | Forward exec approvals |
| `approvals.exec.mode` | string | - | `"session" | "targets" | "both"` |
| `approvals.exec.agentFilter` | string[] | - | Agent allowlist |
| `approvals.exec.sessionFilter` | string[] | - | Session key filters |
| `approvals.exec.targets[].channel` | string | - | Target channel |
| `approvals.exec.targets[].to` | string | - | Destination |
| `approvals.exec.targets[].accountId` | string | - | Account selector |
| `approvals.exec.targets[].threadId` | string | - | Thread ID |

---

## session

Session scope, reset, maintenance.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `session.scope` | string | - | `"per-sender"` |
| `session.dmScope` | string | - | `"main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer"` |
| `session.identityLinks` | object | - | Map canonical IDs to provider peers |
| `session.reset.mode` | string | - | `"daily"` or `"idle"` |
| `session.reset.atHour` | number | 4 | Hour for daily reset |
| `session.reset.idleMinutes` | number | 60 | Idle minutes |
| `session.resetByType` | object | - | Per-type overrides |
| `session.resetTriggers` | string[] | - | Triggers (e.g. `["/new", "/reset"]`) |
| `session.store` | string | - | Sessions store path |
| `session.parentForkMaxTokens` | number | 100000 | Max parent tokens for fork |
| `session.maintenance.mode` | string | - | `"warn"` or `"enforce"` |
| `session.maintenance.pruneAfter` | string | `"30d"` | Age cutoff |
| `session.maintenance.maxEntries` | number | 500 | Max entries |
| `session.maintenance.rotateBytes` | string | `"10mb"` | Rotate size |
| `session.threadBindings.enabled` | boolean | true | Thread-bound sessions |
| `session.threadBindings.idleHours` | number | 24 | Idle auto-unfocus |
| `session.threadBindings.maxAgeHours` | number | 0 | Max age |
| `session.sendPolicy.rules` | array | - | Deny rules |
| `session.sendPolicy.default` | string | `"allow"` | Default |

---

## web

Web channel settings.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `web.enabled` | boolean | - | Enable web channel |
| `web.heartbeatSeconds` | number | 60 | Heartbeat interval |
| `web.reconnect.initialMs` | number | 2000 | Initial reconnect delay |
| `web.reconnect.maxMs` | number | 120000 | Max backoff |
| `web.reconnect.factor` | number | 1.4 | Backoff multiplier |
| `web.reconnect.jitter` | number | 0.2 | Jitter (0–1) |
| `web.reconnect.maxAttempts` | number | 0 | Max attempts (0 = unlimited) |

---

## channels

Channel providers. Each has its own config block. See [Configuration Reference](/gateway/configuration-reference#channels) for full channel details.

### Common channel fields

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `channels.<provider>.enabled` | boolean | true | Enable channel |
| `channels.<provider>.dmPolicy` | string | `"pairing"` | `"pairing" | "allowlist" | "open" | "disabled"` |
| `channels.<provider>.allowFrom` | string[] | - | Sender allowlist |
| `channels.<provider>.groupPolicy` | string | `"allowlist"` | `"allowlist" | "open" | "disabled"` |
| `channels.<provider>.groupAllowFrom` | string[] | - | Group allowlist |
| `channels.<provider>.historyLimit` | number | - | History limit |
| `channels.<provider>.mediaMaxMb` | number | - | Max media size (MB) |
| `channels.<provider>.configWrites` | boolean | true | Allow config writes |

### channels.defaults

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `channels.defaults.groupPolicy` | string | - | Fallback group policy |
| `channels.defaults.heartbeat.showOk` | boolean | - | Show healthy in heartbeat |
| `channels.defaults.heartbeat.showAlerts` | boolean | - | Show degraded in heartbeat |
| `channels.defaults.heartbeat.useIndicator` | boolean | - | Compact indicator |

### channels.modelByChannel

Channel-specific model overrides:

```json5
{
  channels: {
    modelByChannel: {
      telegram: { "-1001234567890": "anthropic/claude-opus-4-6" },
    },
  },
}
```

---

## cron

Cron jobs.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `cron.jobs` | array | - | Cron job definitions |

---

## hooks

Hooks and Gmail. See [Gmail Hooks](/hooks/gmail).

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `hooks.gmail` | object | - | Gmail hook config |
| `hooks.mappings` | array | - | Hook mappings |

---

## discovery

mDNS and wide-area discovery.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `discovery.mdns.mode` | string | `"minimal"` | `"minimal" | "full" | "off"` |
| `discovery.wideArea.enabled` | boolean | false | Wide-area discovery |

---

## canvasHost

Canvas host server.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `canvasHost.enabled` | boolean | - | Enable canvas host |
| `canvasHost.root` | string | - | Served root directory |
| `canvasHost.port` | number | - | HTTP port |
| `canvasHost.liveReload` | boolean | - | Live reload |

---

## talk

Talk mode (voice synthesis).

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `talk.provider` | string | - | `"elevenlabs"` etc. |
| `talk.providers.<id>.voiceId` | string | - | Voice ID |
| `talk.providers.<id>.voiceAliases` | object | - | Voice alias map |
| `talk.providers.<id>.modelId` | string | - | Model ID |
| `talk.providers.<id>.outputFormat` | string | - | Output format |
| `talk.providers.<id>.apiKey` | string | - | API key |
| `talk.voiceId` | string | - | Legacy ElevenLabs voice |
| `talk.modelId` | string | - | Legacy model |
| `talk.outputFormat` | string | - | Legacy format |
| `talk.apiKey` | string | - | Legacy API key |
| `talk.interruptOnSpeech` | boolean | true | Stop on user speech |
| `talk.silenceTimeoutMs` | number | - | Silence before send |

---

## gateway

Gateway runtime. See [Configuration Reference](/gateway/configuration-reference#gateway).

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `gateway.port` | number | 18789 | TCP port |
| `gateway.mode` | string | - | `"local"` or `"remote"` |
| `gateway.bind` | string | - | `"auto" | "lan" | "loopback" | "custom" | "tailnet"` |
| `gateway.customBindHost` | string | - | Bind host when `custom` |
| `gateway.controlUi.enabled` | boolean | - | Serve Control UI |
| `gateway.controlUi.basePath` | string | - | URL prefix |
| `gateway.controlUi.root` | string | - | Asset root |
| `gateway.controlUi.allowedOrigins` | string[] | - | Allowed origins |
| `gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback` | boolean | - | Host-header fallback |
| `gateway.controlUi.dangerouslyDisableDeviceAuth` | boolean | - | Disable device auth |
| `gateway.auth.mode` | string | - | `"none" | "token" | "password" | "trusted-proxy"` |
| `gateway.auth.token` | string | - | Bearer token |
| `gateway.auth.password` | string | - | Password |
| `gateway.auth.allowTailscale` | boolean | - | Allow Tailscale identity |
| `gateway.auth.rateLimit` | object | - | Rate limit config |
| `gateway.trustedProxies` | string[] | - | Proxy CIDR allowlist |
| `gateway.allowRealIpFallback` | boolean | - | x-real-ip fallback |
| `gateway.tools.allow` | string[] | - | Gateway tool allow |
| `gateway.tools.deny` | string[] | - | Gateway tool deny |
| `gateway.channelHealthCheckMinutes` | number | - | Health check interval |
| `gateway.tailscale.mode` | string | - | `"off" | "serve" | "funnel"` |
| `gateway.tailscale.resetOnExit` | boolean | - | Reset on exit |
| `gateway.remote.url` | string | - | Remote WebSocket URL |
| `gateway.remote.token` | string | - | Remote auth token |
| `gateway.remote.password` | string | - | Remote password |
| `gateway.remote.tlsFingerprint` | string | - | TLS fingerprint pin |
| `gateway.remote.transport` | string | - | `"direct"` or `"ssh"` |
| `gateway.remote.sshTarget` | string | - | `user@host` |
| `gateway.remote.sshIdentity` | string | - | SSH identity file |
| `gateway.reload.mode` | string | - | `"off" | "restart" | "hot" | "hybrid"` |
| `gateway.reload.debounceMs` | number | - | Debounce |
| `gateway.tls.enabled` | boolean | - | TLS termination |
| `gateway.tls.autoGenerate` | boolean | - | Auto-generate cert |
| `gateway.tls.certPath` | string | - | Cert path |
| `gateway.tls.keyPath` | string | - | Key path |
| `gateway.tls.caPath` | string | - | CA path |
| `gateway.nodes.browser.mode` | string | - | `"auto" | "manual" | "off"` |
| `gateway.nodes.browser.node` | string | - | Pinned node |
| `gateway.nodes.allowCommands` | string[] | - | Extra allowed commands |
| `gateway.nodes.denyCommands` | string[] | - | Denied commands |

---

## memory

Memory backend.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `memory.backend` | string | - | `"builtin"` or `"qmd"` |
| `memory.citations` | string | - | `"auto" | "on" | "off"` |
| `memory.qmd.command` | string | - | QMD executable path |
| `memory.qmd.searchMode` | string | - | `"query" | "search" | "vsearch"` |
| `memory.qmd.includeDefaultMemory` | boolean | - | Index default memory |
| `memory.qmd.paths` | array | - | Custom paths |
| `memory.qmd.sessions.enabled` | boolean | false | Index sessions |
| `memory.qmd.update.interval` | string | - | Update interval |
| `memory.qmd.limits.maxResults` | number | 6 | Max results |
| `memory.qmd.limits.maxSnippetChars` | number | 700 | Snippet length |
| `memory.qmd.limits.timeoutMs` | number | 4000 | Query timeout |

---

## acp

ACP runtime.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `acp.enabled` | boolean | - | Enable ACP |
| `acp.dispatch.enabled` | boolean | true | Enable dispatch |
| `acp.backend` | string | - | ACP backend id |
| `acp.defaultAgent` | string | - | Fallback agent |
| `acp.allowedAgents` | string[] | - | Agent allowlist |
| `acp.maxConcurrentSessions` | number | - | Max concurrent sessions |
| `acp.stream.coalesceIdleMs` | number | - | Coalesce idle |
| `acp.stream.maxChunkChars` | number | - | Max chunk size |
| `acp.stream.repeatSuppression` | boolean | true | Suppress repeats |
| `acp.stream.deliveryMode` | string | - | `"live"` or `"final_only"` |
| `acp.stream.maxOutputChars` | number | - | Max output chars |
| `acp.runtime.ttlMinutes` | number | - | Idle TTL |

---

## auth

Authentication profiles for provider credentials.

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `auth.profiles` | object | - | Named profiles |
| `auth.order` | object | - | Order per provider |

---

## Special Keys

| Key | Type | Description |
|-----|------|-------------|
| `$schema` | string | JSON Schema URL (optional; for editor support) |
| `$include` | string/object | Include another config file |

---

## Related Docs

- [Configuration](/gateway/configuration) — Overview and common tasks
- [Configuration Reference](/gateway/configuration-reference) — Full channel and feature details
- [Configuration Examples](/gateway/configuration-examples) — Copy-paste configs
