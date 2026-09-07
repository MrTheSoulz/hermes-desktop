// @vitest-environment jsdom
import { render } from "@testing-library/react";
import type { RefObject } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OfficeAgent, RenderAgent } from "../core/types";
import type { Workstation } from "../layout";

type AgentLookupRef = RefObject<Map<string, RenderAgent>>;

const modelProbe = vi.hoisted(() => ({
  lookupRef: null as AgentLookupRef | null,
}));

vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
}));

vi.mock("./agents", () => ({
  AgentModel: ({
    agentLookupRef,
  }: {
    agentLookupRef?: AgentLookupRef;
  }): null => {
    modelProbe.lookupRef = agentLookupRef ?? null;
    return null;
  },
}));

vi.mock("./RiggedCharacter", () => ({
  RIGGED_EMPLOYEE_URL: "employee.glb",
  RIGGED_MAN_URL: "agent.glb",
}));

import { AgentsLayer } from "./AgentsLayer";

const workstations: Workstation[] = [];
const idleAgent: OfficeAgent = {
  id: "agent",
  name: "Agent",
  status: "idle",
  color: "#2563eb",
  item: "desk",
  gatewayRunning: false,
  position: "employee",
};

function renderedAgent(): RenderAgent | undefined {
  return modelProbe.lookupRef?.current.get("agent");
}

function renderedGatewayRunning(): boolean | undefined {
  const agent = renderedAgent();
  return agent && "gatewayRunning" in agent ? agent.gatewayRunning : undefined;
}

describe("AgentsLayer gateway reconciliation", () => {
  beforeEach(() => {
    modelProbe.lookupRef = null;
  });

  it.each([
    { before: false, after: true },
    { before: true, after: false },
  ])(
    "refreshes a gateway-only transition from $before to $after",
    ({ before, after }) => {
      // @lat: [[office-3d-interiors#Gateway presence#Gateway-only live refresh]]
      const view = render(
        <AgentsLayer
          agents={[{ ...idleAgent, gatewayRunning: before }]}
          workstations={workstations}
          selectedId={null}
          onSelect={vi.fn()}
        />,
      );

      const liveBefore = renderedAgent();
      expect(renderedGatewayRunning()).toBe(before);
      expect(liveBefore).toBeDefined();
      if (!liveBefore) throw new Error("expected live render agent");
      liveBefore.x = 321;
      liveBefore.frame = 42;

      view.rerender(
        <AgentsLayer
          agents={[{ ...idleAgent, gatewayRunning: after }]}
          workstations={workstations}
          selectedId={null}
          onSelect={vi.fn()}
        />,
      );

      expect(renderedGatewayRunning()).toBe(after);
      expect(renderedAgent()).toMatchObject({ x: 321, frame: 42 });
    },
  );
});
