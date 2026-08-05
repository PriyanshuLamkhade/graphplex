import { END, START, StateGraph } from "@langchain/langgraph";
import { ResearchState } from "./state";
import { webSearch } from "./nodes/webSearch";
import { generateAnswer } from "./nodes/generateAnswer";
import { generateFollowUps } from "./nodes/generateFollowups";
import { answerReviewer, routeAfterReview } from "./nodes/reviwerAnswer";
import { summaryWebSearch } from "./nodes/summaryWebSearch";
import { regenerateAnswer } from "./nodes/regenerateAnswer";

const builder = new StateGraph(ResearchState)
    .addNode("webSearch", webSearch)
    .addNode("generateAnswer", generateAnswer)
    .addNode("generateFollowUps", generateFollowUps)
    .addNode("answerReviewer",answerReviewer)
    .addNode("summaryWebSearch",summaryWebSearch)
    .addNode("regenerateAnswer",regenerateAnswer)

    .addEdge(START,"webSearch")
    .addEdge("webSearch","summaryWebSearch")
    
    .addEdge("summaryWebSearch","generateAnswer")

    .addEdge("webSearch","generateFollowUps")
    .addEdge("generateAnswer","answerReviewer")
    // Passed -> end
    // Failed -> regenerate
    .addConditionalEdges("answerReviewer", routeAfterReview, {
        end: END,
        regenerate: "regenerateAnswer"
    })
    .addEdge("regenerateAnswer",END)
    .addEdge("generateFollowUps",END)

export const graph = builder.compile()