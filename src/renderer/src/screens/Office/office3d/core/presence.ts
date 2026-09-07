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
