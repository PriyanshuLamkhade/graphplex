import 'dotenv/config';
import express from "express";
import { tavily } from "@tavily/core";
import cors from "cors";
import { graph } from "./graph/graph.js";
import { middleware } from './middleware.js';
import { prisma } from '../db.js';
import { webSearch } from './graph/nodes/webSearch.js';
import { summaryWebSearch } from './graph/nodes/summaryWebSearch.js';
import { contextualizeQuery } from './ContextualizeQuery.js';
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

app.post("/conversation_ask",async (req, res) => {
    try {
        const { query } = req.body
        const userId = "388729c8-8c2d-4406-b357-86c65ad0bbf0"
        if(!userId){
            return res.json({
                    message: "User Id not found"
                })
        }
    
        const conversation = await prisma.conversation.create({
            data:{
                userId:userId,
                title:query.slice(0, 80)
            }
        })
       await prisma.message.create({
            data:{
                content:query,
                role: "User",
                conversationId : conversation.id
            }
        })

        const webSearchResults = await webSearch(query)
        
        const summaryWebSearchResult= await summaryWebSearch(query,webSearchResults)

        const result = await graph.invoke({
            query: query,
            searchResults: webSearchResults,
            searchSummary: summaryWebSearchResult,
        },{
        configurable: {
            thread_id: conversation.id
        }
    }
    );
        const finalAnswer = result.reanswer || result.answer;
       
        
        const assistantMessage = await prisma.message.create({
            data: {
                content: finalAnswer,
                role: "Assistant",
                conversationId: conversation.id,
                searchResults:webSearchResults.map(result => result.url),
                searchSummary:summaryWebSearchResult
            }
        });
        
        return res.json({   
            conversation: {
                id: conversation.id,
                title: conversation.title,
            },
            message: {
                id: assistantMessage.id,
                role: assistantMessage.role,
                content: assistantMessage.content,
                
            },
            searchResults: webSearchResults,
            followUpQuestions: result.followUpQuestions,
            reuslt:result
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong while processing the request",
        });
    }
});

app.post("/conversation_ask/follow_up", async (req, res) => {
    try {
        const {conversationId,query} = req.body
        const userId = "388729c8-8c2d-4406-b357-86c65ad0bbf0"
    
        const conversation = await prisma.conversation.findFirst({
            where:{
                userId:userId, id:conversationId
            },include:{
                messages:{
                    orderBy:{createdAt:"desc"},
                    take:2
                }
    
            }
        })
        if(!conversation){
            return res.json({message:"Couldnot find conversation"})
        }
        const conversationHistory = conversation.messages
        .reverse()
        .map(message => `${message.role}: ${message.content}`)
        .join("\n\n");

        await prisma.message.create({
            data:{
                content:query,
                role: "User",
                conversationId : conversation.id
            }
        })
        const conversationForQueries = await prisma.conversation.findFirst({
            where:{
                userId:userId, id:conversationId
            },include:{
                messages:{
                    where: {
                        role: "User"
                    },
                    orderBy:{createdAt:"desc"},
                }
    
            }
        })
        if(!conversationForQueries){
            return res.json({message:"Couldnot find conversation"})
        }
        const previousQueries = conversationForQueries.messages
        .reverse()
        .map(message => message.content)
        .join("\n");
        
        const modelGeneratedQuery = (await contextualizeQuery(query, previousQueries)).trim() || query;
        console.log("ORIGINAL QUERY:", query);
        console.log("CONTEXTUALIZED QUERY:", modelGeneratedQuery);

        const webSearchResults = await webSearch(modelGeneratedQuery)
        
        const summaryWebSearchResult= await summaryWebSearch(query,webSearchResults)

        const result = await graph.invoke({
                query: query,
                conversationHistory:conversationHistory,
                searchResults: webSearchResults,
                searchSummary: summaryWebSearchResult,
            },{
            configurable: {
                thread_id: conversation.id
            }
        })
        if(!result){
            return res.json({message:"Results not found"})
        }
        const finalAnswer = result.reanswer || result.answer;
    
        const assistantMessage = await prisma.message.create({
            data: {
                content: finalAnswer,
                role: "Assistant",
                conversationId: conversation.id,
                searchResults: webSearchResults.map(result => result.url),
                searchSummary: summaryWebSearchResult
            }
        });
    
        res.json({
            conversation: {
                    id: conversation.id,
                    title: conversation.title,
                },
            message: {
                    id: assistantMessage.id,
                    role: assistantMessage.role,
                    content: assistantMessage.content,
                },
            followUpQuestions: result.followUpQuestions,
            reuslt:result
        })
    } catch (error) {
        console.log(error)
        res.json({
            message:"Something wrong finding answer for followup",
        })
    }

})

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});


    //MAKE SURE USER HAS ENOUGH TOKENS TO MAKE REQUEST

    //CHECK IF WE HAVE WEB SEARCH INDEXED FOR THE QUERY

    //IF NOT MAKE WEB SEARCH 
    //DO SOME CONTEXT ENGINEERING ON THE PROMPT  + WEB SEARCH RESULTS

    // HIT THE LLM AND STREAM BACK THE RESPONSE TO THE USER

    //ALSO STREAM BACK THE RESOURCES AND THE FOLLOW UP QUESTIONS TO THE USER(WICH WE CAN DO THAT FROM DIFFERENT PARALLEL LLM CALL)

