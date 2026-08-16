import 'dotenv/config';
import express from "express";
import { tavily } from "@tavily/core";
import cors from "cors";
import { graph } from "./graph/graph.js";
import { middleware } from './middleware.js';
import { prisma } from '../db.js';
import type { Request } from "express"
export const tavily_client = tavily({ apiKey: process.env.TAVIL_API_KEY });
const app = express();
app.use(express.json());
app.use(cors());
app.get("/conversations",middleware,async(req,res)=>{
    try {
        const userId = req.userId
        if (!userId) {
            return res.json({
                message: "User Id not found"
            })
        }
        const conversations = await prisma.conversation.findMany({
            where: {
                userId: userId
            },select: {
            id: true,
            title: true,
            slug: true
        }
        })
    
        res.json({
            conversations
        })
    } catch (error) {
       res.json("Error in getting all conversations") 
    }
})

app.get("/conversations/:conversationId",middleware,async(req,res)=>{
    try {
        const conversationId = req.params.conversationId as string;;
        if (!req.userId) {
            return res.json({
                message: "User Id not found"
            })
        }
        if (!conversationId) {
            return res.json({
                message: "Conversation Id not found"
            })
        }
        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId,
                userId: req.userId
            },
            select: {
                id: true,
                title: true,
                slug: true,
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    },
                    take: 20
                }
            }
        });
        if(!conversation) return res.json({message:"Did not find conversations"})
        
        res.json(conversation)
    } catch (error) {
        res.json("Error in getting conversation with id")
    }
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

