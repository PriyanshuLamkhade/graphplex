import ollama from "ollama";
import type { ResearchStateType } from "../state";

export async function regenerateAnswer(state: ResearchStateType) {

    const prompt = REGENERATE_PROMPT
        .replace("{USER_QUERY}", state.query)
        .replace("{RESEARCH_SUMMARY}", state.searchSummary)
        .replace("{PREVIOUS_ANSWER}", state.answer)
        .replace("{REVIEWER_FEEDBACK}", state.reviewFeedback);

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
You are an expert AI assistant.

Your task is to improve an existing answer using reviewer feedback.

Rules:

- Use ONLY the provided research summary as factual evidence.
- Never use outside knowledge.
- Preserve all correct information from the previous answer.
- Correct only the issues identified by the reviewer.
- Do not introduce unsupported facts.
- Do not remove useful information unless it is incorrect.
- If reviewer feedback conflicts with the research summary, trust the research summary.

Your goal is to produce a more accurate version of the answer while changing as little as necessary.
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

Rewrite the answer by fixing only the issues identified in the reviewer feedback.

Requirements:

- Preserve accurate information.
- Remove unsupported claims.
- Improve factual correctness.
- Base every statement only on the research summary.

Return only the improved answer.
`;