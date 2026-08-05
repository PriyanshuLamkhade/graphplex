import { tavily_client } from "../..";
import type { ResearchStateType } from "../state";

export async function webSearch(state:ResearchStateType){
    const queryResults = await tavily_client.search(state.query, {
        searchDepth: "advanced"
    });

    return {
        searchResults : queryResults.results.slice(0,4).map((result)=>({
            title:result.title,
            url:result.url,
            content:result.content,
            score:result.score
        })),
    }
}