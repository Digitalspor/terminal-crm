import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  throw new Error("Missing ANTHROPIC_API_KEY");
}

export const anthropic = new Anthropic({
  apiKey,
});

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  options?: { maxTokens?: number },
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: options?.maxTokens || 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.text || "";
}

export async function callClaudeJSON<T>(
  systemPrompt: string,
  userMessage: string,
  options?: { maxTokens?: number },
): Promise<T> {
  const response = await callClaude(systemPrompt, userMessage, options);

  // Extract JSON from response (handle markdown code blocks)
  let jsonStr = response;
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  return JSON.parse(jsonStr) as T;
}
