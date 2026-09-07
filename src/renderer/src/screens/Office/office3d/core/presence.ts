import type { OfficeAgent } from "./types";

/**
 * Resolve gateway presence independently from Kanban activity. Explicit profile
 * metadata wins; older callers without it retain the legacy status fallback.
 */
export function agentGatewayActive(
  agent: Pick<OfficeAgent, "gatewayRunning" | "status">,
): boolean {
  return agent.gatewayRunning ?? agent.status === "working";
}

/** Detect metadata changes that the live render object must receive. */
export function agentRenderStateChanged(
  before:
    | Pick<OfficeAgent, "gatewayRunning" | "position" | "status">
    | undefined,
  after: Pick<OfficeAgent, "gatewayRunning" | "position" | "status">,
): boolean {
  return (
    !before ||
    before.status !== after.status ||
    before.position !== after.position ||
    before.gatewayRunning !== after.gatewayRunning
  );
}
