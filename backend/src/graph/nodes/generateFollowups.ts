import { FOLLOWUP_PROMPT, FOLLOWUP_SYSTEM_PROMPT } from "../../prompt";
import type { ResearchStateType } from "../state";
import ollama from "ollama";
import { z } from "zod";

// const FollowUpSchema = z.object({
//   followUpQuestions: z.array(z.string())
// });


export async function generateFollowUps(state: ResearchStateType) {
  const context = state.searchResults.map((results) => `
        TITLE:${results.title},
        URL:${results.url},
        Content:${results.content}
    `).join("\n\n")
  const userPrompt = FOLLOWUP_PROMPT
    .replace("{WEB_SEARCH_RESULTS}", context)
    .replace("{USER_QUERY}", JSON.stringify(state.query))

  const response = await ollama.chat({
    model: "qwen3.5:9b",
    messages: [
      { role: "system", content: FOLLOWUP_SYSTEM_PROMPT },
      { role: "user", content: userPrompt }
    ],
    "think": "low",
  })

//   const parsed = FollowUpSchema.parse(
//   JSON.parse(response.message.content)
// );


  return {
    followUpQuestions: response.message.content
  }
}
