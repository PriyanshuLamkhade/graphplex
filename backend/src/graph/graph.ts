import { END, START, StateGraph } from "@langchain/langgraph";
import { ResearchState } from "./state";
import { webSearch } from "./nodes/webSearch";
import { generateAnswer } from "./nodes/generateAnswer";
import { generateFollowUps } from "./nodes/generateFollowups";

const builder = new StateGraph(ResearchState)
    .addNode("webSearch", webSearch)
    .addNode("generateAnswer", generateAnswer)
    .addNode("generateFollowUps", generateFollowUps)

    .addEdge(START,"webSearch")

    .addEdge("webSearch","generateAnswer")
    .addEdge("webSearch","generateFollowUps")
    
    .addEdge("generateAnswer",END)
    .addEdge("generateFollowUps",END)

export const graph = builder.compile()