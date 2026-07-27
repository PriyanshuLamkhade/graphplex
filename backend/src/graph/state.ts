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
    answer: z.string().default(""),
    followUpQuestions: z.string()

})

export type ResearchStateType = typeof ResearchState.State;