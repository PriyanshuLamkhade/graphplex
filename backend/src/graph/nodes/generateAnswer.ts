import ollama from "ollama";
import type { ResearchStateType } from "../state";
import { ANSWER_PROMPT, ANSWER_SYSTEM_PROMPT } from "../../prompt";

export async function generateAnswer(state: ResearchStateType) {
    const webSearch = state.searchResults.map((results) => `
        TITLE:${results.title},
        URL:${results.url},
        Content:${results.content}
    `).join("\n\n")

    let context = "";

    if (state.conversationHistory) {
        context += `
CONVERSATION HISTORY:
${state.conversationHistory}
`;
    }

    if (state.searchSummary) {
        context += `
RESEARCH SUMMARY:
${state.searchSummary}
`;
    }

    let userPrompt = ANSWER_PROMPT
        .replace("{WEB_SEARCH_RESULTS}", webSearch)
        .replace("{USER_QUERY}", JSON.stringify(state.query))
        .replace("{CONTEXT}", context);

    const response = await ollama.chat({
        model: "qwen3.5:9b",
        messages: [
            { role: "system", content: ANSWER_SYSTEM_PROMPT },
            { role: "user", content: userPrompt }
        ],
        think: false,
        options: {
            num_predict: 1024
        },
    })

    return {
        answer: response.message.content,
        answerAttempts: state.answerAttempts + 1
    };
}