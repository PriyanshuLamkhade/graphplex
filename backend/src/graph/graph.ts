import { END, START, StateGraph } from "@langchain/langgraph";
import { ResearchState } from "./state";
import { generateAnswer } from "./nodes/generateAnswer";
import { generateFollowUps } from "./nodes/generateFollowups";
import { answerReviewer, routeAfterReview } from "./nodes/reviwerAnswer";
import { regenerateAnswer } from "./nodes/regenerateAnswer";
import { MemorySaver } from "@langchain/langgraph";

const builder = new StateGraph(ResearchState)
    .addNode("generateAnswer", generateAnswer)
    .addNode("generateFollowUps", generateFollowUps)
    .addNode("answerReviewer",answerReviewer)
    .addNode("regenerateAnswer",regenerateAnswer)

    .addEdge(START,"generateAnswer")
    .addEdge(START,"generateFollowUps")
    .addEdge("generateAnswer","answerReviewer")

    .addConditionalEdges("answerReviewer", routeAfterReview, {
        end: END,
        regenerate: "regenerateAnswer"
    })
    .addEdge("regenerateAnswer",END)
    .addEdge("generateFollowUps",END)


const checkpointer = new MemorySaver();
export const graph = builder.compile({
    checkpointer
})