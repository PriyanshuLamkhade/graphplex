import { StateSchema } from "@langchain/langgraph";
import * as z from "zod"
export const ResearchState = new StateSchema({
    query: z.string(),
    searchResults: z.array(
        z.object({
            title: z.string(),
            url: z.string(),
            content: z.string(),
            score: z.number(),
        })
    ).default([]),
    searchSummary:z.string(),
    // for /followups
    conversationHistory: z.string().default(""),
    answer: z.string().default(""),
    followUpQuestions: z.string(),
    answerAttempts : z.number().default(0),
    reviewPassed : z.boolean().default(false),
    reviewFeedback:z.string().default(""),
    reanswer: z.string().default(""),
})

export type ResearchStateType = typeof ResearchState.State;