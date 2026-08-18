import ollama from "ollama";
import type { ResearchStateType } from "../state";

export async function regenerateAnswer(state: ResearchStateType) {

    const prompt = REGENERATE_PROMPT
        .replace("{USER_QUERY}", state.query)
        .replace("{RESEARCH_SUMMARY}", state.searchSummary)
        .replace("{PREVIOUS_ANSWER}", state.answer)
        .replace("{REVIEWER_FEEDBACK}", state.reviewFeedback)
        .replace("{HISTORY}", state.conversationHistory);

    const response = await ollama.chat({
        model: "qwen3.5:9b",

        messages: [
            {
                role: "system",
                content: REGENERATE_SYSTEM_PROMPT,
            },
            {
                role: "user",
                content: prompt,
            },
        ],

        think: false,

        options: {
            num_predict: 1024,
        },
    });

    return {
        reanswer: response.message.content,
        answerAttempts: state.answerAttempts + 1,
    };
}
const REGENERATE_SYSTEM_PROMPT = `
You are an answer correction assistant.

Your task is to correct an existing answer using the reviewer feedback.

Rules:

- Use ONLY the provided research summary as factual evidence.
- Never use outside knowledge.
- Treat the research summary as the only factual source.
- Use conversation history only to understand the context of the current query.
- Do not use conversation history as evidence for new factual claims.

IMPORTANT:
- Every issue identified by the reviewer MUST be fixed.
- Remove unsupported claims identified by the reviewer.
- Do not preserve a claim just because it appeared in the previous answer.
- Do not introduce new claims while fixing the answer.
- If a claim cannot be supported by the research summary, remove it.
- Preserve supported information from the previous answer when possible.
- Answer the user's CURRENT query directly.

Return ONLY the corrected answer.
`;
const REGENERATE_PROMPT = `
## USER QUERY

{USER_QUERY}

## RESEARCH SUMMARY

{RESEARCH_SUMMARY}

## PREVIOUS ANSWER

{PREVIOUS_ANSWER}

## REVIEWER FEEDBACK

{REVIEWER_FEEDBACK}

## CONVERSATION HISTORY

{HISTORY}

Rewrite the previous answer.

You MUST fix every issue identified in REVIEWER FEEDBACK.

Any claim explicitly identified as unsupported by the reviewer must be
removed unless it is directly supported by the RESEARCH SUMMARY.

Do not invent replacement information.

Do not add new factual claims.

Use the conversation history only to understand the user's context.

Return only the corrected answer.
`;