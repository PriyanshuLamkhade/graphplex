import ollama from "ollama";
import type { ResearchStateType } from "../state";
import { ANSWER_PROMPT, ANSWER_SYSTEM_PROMPT } from "../../prompt";

export async function generateAnswer(state: ResearchStateType) {
    const context = state.searchResults.map((results) => `
        TITLE:${results.title},
        URL:${results.url},
        Content:${results.content}
    `).join("\n\n")

    let userPrompt = ANSWER_PROMPT
        .replace("{WEB_SEARCH_RESULTS}", context)
        .replace("{USER_QUERY}", JSON.stringify(state.query))

    const response = await ollama.chat({
        model: "qwen3.5:9b",
        messages: [
            { role: "system", content: ANSWER_SYSTEM_PROMPT },
            { role: "user", content: userPrompt }
        ],
        think: "low",
        options: {
            num_predict: 1024
        },
    })

    return {
        answer: response.message.content,
        answerAttempts:state.answerAttempts + 1
    };
}