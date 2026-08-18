import ollama from "ollama";
import type { ResearchStateType } from "../state";
import { REVIEW_PROMPT, REVIEW_SYSTEM_PROMPT } from "../../prompt";


export async function answerReviewer(state: ResearchStateType) {

    const prompt = REVIEW_PROMPT
        .replace("{USER_QUERY}", state.query)
        .replace("{RESEARCH_SUMMARY}", state.searchSummary)
        .replace("{GENERATED_ANSWER}", state.answer)
        .replace("{HISTORY}", state.conversationHistory);

    const response = await ollama.chat({
        model: "qwen3.5:9b",

        messages: [
            {
                role: "system",
                content: REVIEW_SYSTEM_PROMPT,
            },
            {
                role: "user",
                content: prompt,
            },
        ],

        think: false,

        format: "json",

    });

    if (
        !response.message.content ||
        response.done_reason === "length"
    ) {
        throw new Error(
            `Reviewer failed: ${response.done_reason}`
        );
    }

    const review = JSON.parse(response.message.content);

    return {
        reviewPassed: review.passed,
        reviewFeedback: review.feedback,
    };
}

// export function routeAfterAnswer(state: ResearchStateType) {
//     if (state.answerAttempts > 2) {
//         return "end";
//     }

//     return "review";
// }

export function routeAfterReview(state: ResearchStateType) {
    if (state.reviewPassed || state.answerAttempts > 2) {
        return "end";
    }

    return "regenerate";
}