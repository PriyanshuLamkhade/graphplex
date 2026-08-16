import 'dotenv/config';
import express from "express";
import { tavily } from "@tavily/core";
import cors from "cors";
import { graph } from "./graph/graph.js";
import { middleware } from './middleware.js';

export const tavily_client = tavily({ apiKey: process.env.TAVIL_API_KEY });
const app = express();
app.use(express.json());
app.use(cors());
app.get("/conversations",middleware,async(req,res)=>{
    res.json({
        userId : req.userId
    })
})

app.get("/conversations/:conversationId",middleware,async(req,res)=>{

})

app.post("/perplexity_ask",middleware, async (req, res) => {
    //GET QUERY FROM USER
    const { query } = req.body

    const result = await graph.invoke({
        query: query,
    });


    res.json(result)
});

app.post("/perplexity_ask/follow_up",middleware, async (req, res) => {

})

app.listen(3001, () => {
    console.log("Server is running on port 3000");
});


    //MAKE SURE USER HAS ENOUGH TOKENS TO MAKE REQUEST

    //CHECK IF WE HAVE WEB SEARCH INDEXED FOR THE QUERY

    //IF NOT MAKE WEB SEARCH 
    //DO SOME CONTEXT ENGINEERING ON THE PROMPT  + WEB SEARCH RESULTS

    // HIT THE LLM AND STREAM BACK THE RESPONSE TO THE USER

    //ALSO STREAM BACK THE RESOURCES AND THE FOLLOW UP QUESTIONS TO THE USER(WICH WE CAN DO THAT FROM DIFFERENT PARALLEL LLM CALL)

