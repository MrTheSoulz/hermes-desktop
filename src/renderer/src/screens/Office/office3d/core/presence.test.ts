// @vitest-environment node
import { describe, expect, it } from "vitest";
import { agentGatewayActive } from "./presence";

describe("Office gateway presence", () => {
  it("shows an online gateway as present even with no running cards", () => {
    // @lat: [[office-3d-interiors#Gateway presence#Online without running cards]]
    expect(agentGatewayActive({ status: "idle", gatewayRunning: true })).toBe(
      true,
    );
  });

  it("lets an explicit gateway-down override a working activity status", () => {
    // @lat: [[office-3d-interiors#Gateway presence#Explicit gateway-down overrides working status]]
    expect(
      agentGatewayActive({ status: "working", gatewayRunning: false }),
    ).toBe(false);
  });

  it("falls back to the legacy activity status when gatewayRunning is undefined", () => {
    // @lat: [[office-3d-interiors#Gateway presence#Undefined falls back to activity status]]
    expect(agentGatewayActive({ status: "working" })).toBe(true);
    expect(agentGatewayActive({ status: "idle" })).toBe(false);
    expect(agentGatewayActive({ status: "error" })).toBe(false);
  });
});
