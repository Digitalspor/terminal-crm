import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AGENT_SERVER_URL =
  process.env.AGENT_SERVER_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const { agent, ...params } = await request.json();

    if (!agent) {
      return NextResponse.json(
        { error: "agent parameter required" },
        { status: 400 },
      );
    }

    const validAgents = [
      "email-analyzer",
      "task-planner",
      "task-executor",
      "client-responder",
      "invoice-drafter",
    ];

    if (!validAgents.includes(agent)) {
      return NextResponse.json(
        { error: `Invalid agent. Valid: ${validAgents.join(", ")}` },
        { status: 400 },
      );
    }

    const response = await fetch(`${AGENT_SERVER_URL}/api/agents/${agent}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Agent proxy error:", error);
    return NextResponse.json(
      { error: "Failed to communicate with agent server" },
      { status: 502 },
    );
  }
}
