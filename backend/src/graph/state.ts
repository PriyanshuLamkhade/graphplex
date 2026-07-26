import { StateSchema } from "@langchain/langgraph";
import * as z from "zod"
export const ResearchState = new StateSchema({
    query : z.string(),
    searchResults : z.array(
        z.object({
            title:z.string(),
            url:z.string(),
            content:z.string(),
        })
    ).default([]),
    answer:z.string().default(""),
    followUpQuestions: z.array(z.string()).default([])

})