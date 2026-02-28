import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";

const ENV_PROXY_KEYS = [
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "ALL_PROXY",
  "http_proxy",
  "https_proxy",
  "all_proxy",
] as const;

let applied = false;

export function hasEnvProxy(): boolean {
  for (const key of ENV_PROXY_KEYS) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim()) {
      return true;
    }
  }
  return false;
}

/**
 * Install a global undici dispatcher that honours HTTPS_PROXY / HTTP_PROXY
 * env vars. Node.js native `fetch()` (undici-based) does **not** read these
 * variables on its own; an explicit `EnvHttpProxyAgent` dispatcher is needed.
 *
 * Safe to call multiple times (idempotent). Returns true when the dispatcher
 * was installed (or was already installed from a prior call).
 */
export function installGlobalProxyDispatcher(connectOptions?: {
  autoSelectFamily?: boolean;
  autoSelectFamilyAttemptTimeout?: number;
}): boolean {
  if (!hasEnvProxy()) {
    return false;
  }

  const agent = new EnvHttpProxyAgent(
    connectOptions
      ? {
          connect: {
            ...(connectOptions.autoSelectFamily !== undefined
              ? { autoSelectFamily: connectOptions.autoSelectFamily }
              : {}),
            ...(connectOptions.autoSelectFamilyAttemptTimeout !== undefined
              ? { autoSelectFamilyAttemptTimeout: connectOptions.autoSelectFamilyAttemptTimeout }
              : {}),
          },
        }
      : {},
  );

  try {
    setGlobalDispatcher(agent);
    applied = true;
    return true;
  } catch {
    return false;
  }
}

export function isGlobalProxyInstalled(): boolean {
  return applied;
}

export function resetGlobalProxyStateForTests(): void {
  applied = false;
}
