const OPENROUTER_API_KEY = "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";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callOpenRouter(messages: Message[], model = "google/gemini-2.0-flash-001"): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
    },
    body: JSON.stringify({ model, messages, max_tokens: 1500 }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response received.";
}

const AGENT_PROMPTS = {
  intake: `You are the Intake Agent for NyayMitra AI, an Indian legal aid assistant. Analyze the user's legal problem and produce a structured summary:
1. Category of legal issue (Labour, Consumer, Property, RTI, Family, Criminal, etc.)
2. Key facts identified
3. Urgency level (Low/Medium/High)
4. Jurisdiction hints (which state/central laws may apply)
Be concise, output in bullet points. Reply in the same language the user wrote in.`,

  research: `You are the Legal Research Agent for NyayMitra AI. Based on the intake summary and original problem, identify:
1. Relevant Indian laws, acts, and sections (e.g., "Section 14 of Consumer Protection Act, 2019")
2. Key legal rights the person has
3. Relevant landmark judgments if any
4. Time limitations or deadlines to act
Be specific with section numbers. Use simple language a common person can understand. Reply in the same language as the original problem.`,

  drafter: `You are the Document Drafter Agent for NyayMitra AI. Based on the legal research, draft:
1. A template legal notice or complaint letter the user can send
2. Key points to include when approaching authorities
3. Step-by-step action plan (what to do first, second, etc.)
Keep it practical, actionable, and in simple language. Reply in the same language as the original problem.`,

  scheme: `You are the Scheme Radar Agent for NyayMitra AI. Based on the user's situation, identify:
1. Relevant government schemes they can benefit from
2. Free legal aid options (NALSA, DLSA, legal aid clinics)
3. Relevant helpline numbers and online portals
4. NGOs or organizations that can help
Be specific with names, websites, and phone numbers where possible. Reply in the same language as the original problem.`,
};

export type AgentName = "intake" | "research" | "drafter" | "scheme";

export interface AgentResult {
  agent: AgentName;
  response: string;
}

export async function runAgentPipeline(
  userProblem: string,
  category: string | null,
  onAgentStart: (index: number) => void,
  onAgentComplete: (index: number, result: AgentResult) => void,
): Promise<AgentResult[]> {
  const agents: AgentName[] = ["intake", "research", "drafter", "scheme"];
  const results: AgentResult[] = [];
  const categoryHint = category ? ` [Category: ${category}]` : "";

  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    onAgentStart(i);

    const messages: Message[] = [
      { role: "system", content: AGENT_PROMPTS[agent] },
    ];

    if (i === 0) {
      messages.push({ role: "user", content: userProblem + categoryHint });
    } else {
      // Include previous agent outputs as context
      const context = results.map(r => `[${r.agent.toUpperCase()} AGENT OUTPUT]:\n${r.response}`).join("\n\n");
      messages.push({ role: "user", content: `Original problem: ${userProblem}${categoryHint}\n\n${context}\n\nNow do your part.` });
    }

    try {
      const response = await callOpenRouter(messages);
      const result: AgentResult = { agent, response };
      results.push(result);
      onAgentComplete(i, result);
    } catch (err) {
      const errorResult: AgentResult = { agent, response: `Error: ${(err as Error).message}` };
      results.push(errorResult);
      onAgentComplete(i, errorResult);
    }
  }

  return results;
}
