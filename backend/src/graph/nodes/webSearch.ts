import { tavily_client } from "../..";

export async function webSearch(query: string){
    const queryResults = await tavily_client.search(query, {
        searchDepth: "advanced"
    });

    return queryResults.results.slice(0,4).map((result)=>({
            title:result.title,
            url:result.url,
            content:result.content,
            score:result.score
        }))
    
}