import express from "express";
import { tavily } from "@tavily/core";
import 'dotenv/config';
import cors from "cors";

const client = tavily({ apiKey: process.env.TAVIL_API_KEY });
const app = express();
app.use(express.json());
app.use(cors());

app.get("/conversation", async (req, res) => {
    //GET QUERY FROM USER
    const { query } = req.body
    //MAKE SURE USER HAS ENOUGH TOKENS TO MAKE REQUEST

    //CHECK IF WE HAVE WEB SEARCH INDEXED FOR THE QUERY

    //IF NOT MAKE WEB SEARCH 
    const queryResults = await client.search(query, {
        searchDepth: "advanced"
    });

    const searchResults = queryResults.results
    //DO SOME CONTEXT ENGINEERING ON THE PROMPT  + WEB SEARCH RESULTS

    // HIT THE LLM AND STREAM BACK THE RESPONSE TO THE USER

    //ALSO STREAM BACK THE RESOURCES AND THE FOLLOW UP QUESTIONS TO THE USER(WICH WE CAN DO THAT FROM DIFFERENT PARALLEL LLM CALL)



});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});