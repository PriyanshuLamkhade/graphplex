import express from "express";
import { tavily } from "@tavily/core";
import 'dotenv/config';
import cors from "cors";
import { graph } from "./graph/graph.js";

export const tavily_client = tavily({ apiKey: process.env.TAVIL_API_KEY });
const app = express();
app.use(express.json());
app.use(cors());

app.post("/conversation", async (req, res) => {
    //GET QUERY FROM USER
    const { query } = req.body

    const result = await graph.invoke({
        query: query,
    });


    //MAKE SURE USER HAS ENOUGH TOKENS TO MAKE REQUEST

    //CHECK IF WE HAVE WEB SEARCH INDEXED FOR THE QUERY

    //IF NOT MAKE WEB SEARCH 
    //DO SOME CONTEXT ENGINEERING ON THE PROMPT  + WEB SEARCH RESULTS

    // HIT THE LLM AND STREAM BACK THE RESPONSE TO THE USER

    //ALSO STREAM BACK THE RESOURCES AND THE FOLLOW UP QUESTIONS TO THE USER(WICH WE CAN DO THAT FROM DIFFERENT PARALLEL LLM CALL)


    res.json(result)
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});