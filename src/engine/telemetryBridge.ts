/**
 * telemetryBridge.ts
 * JexyDev Autonomous Studio — SSE Telemetry Bridge
 *
 * Attempts to connect to a live SSE endpoint (VITE_SSE_URL).
 * On failure or absence of the env var, silently falls back to
 * the built-in autonomous engine simulation. Zero console errors
 * in fallback mode — static deployments work flawlessly.
 */

import type { TelemetryEntry } from '../types/studio';

type TelemetryHandler = (entry: TelemetryEntry) => void;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Attempts to establish an SSE connection to VITE_SSE_URL.
 * Returns a cleanup function. If the URL is not configured or
 * the connection fails, this is a no-op and falls back gracefully.
 */
export function connectSSETelemetry(onEntry: TelemetryHandler): () => void {
  const sseUrl = import.meta.env.VITE_SSE_URL as string | undefined;

  if (!sseUrl || sseUrl.trim() === '') {
    // No SSE URL configured — silent fallback, no console error.
    return () => { /* no-op */ };
  }

  let eventSource: EventSource | null = null;
  let isDisposed = false;

  try {
    eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event: MessageEvent) => {
      if (isDisposed) return;
      try {
        const raw = JSON.parse(event.data as string) as {
          agent?: string;
          level?: string;
          message?: string;
        };

        const entry: TelemetryEntry = {
          id: generateId(),
          timestamp: new Date(),
          agent: (raw.agent as TelemetryEntry['agent']) ?? 'SYSTEM',
          level: (raw.level as TelemetryEntry['level']) ?? 'INFO',
          message: raw.message ?? '(empty message)',
        };

        onEntry(entry);
      } catch {
        // Malformed SSE payload — silently skip.
      }
    };

    eventSource.onerror = () => {
      // SSE connection error — close silently, fall back to built-in simulation.
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    };
  } catch {
    // EventSource constructor threw (e.g., invalid URL) — silent fallback.
    eventSource = null;
  }

  return () => {
    isDisposed = true;
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
}
