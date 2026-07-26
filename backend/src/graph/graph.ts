import { END, START, StateGraph } from "@langchain/langgraph";
import { ResearchState } from "./state";
import { webSearch } from "./nodes/webSearch";
import { generateAnswer } from "./nodes/answer";

const builder = new StateGraph(ResearchState)
    .addNode("webSearch", webSearch)
    .addNode("generateAnswer", generateAnswer)
    .addEdge(START,"webSearch")
    .addEdge("webSearch","generateAnswer")
    .addEdge("generateAnswer",END)

export const graph = builder.compile()