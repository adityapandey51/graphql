import express from "express";
import { ApolloServer } from "@apollo/server";
import {expressMiddleware} from "@apollo/server/express4"
import cors from "cors";
import {TODOS} from "./todos.js";
import {USERS} from "./users.js";

async function startServer(){
    const app=express();
    const server=new ApolloServer({
        typeDefs:`
            type User{
                id:ID!
                name:String!
                userName:String!
                email:String!
                phone:String!
            }
            type Todo{
                id:ID!
                title:String!
                completed:Boolean
                userId:ID
                user:User
            }
            type Query{
                getTodos:[Todo]
                getAllUsers:[User]
                getUserById(id:ID!):User
            }
        `,
        resolvers:{
            Todo:{
                user:(todo)=>(USERS.find(e=>e.id===todo.userId))
            },
            Query:{
                getTodos:()=>(TODOS),
                getAllUsers:()=>(USERS),
                getUserById:(parent,{id})=>(USERS.find(e=>e.id===id))
            }
        },
    });
    app.use(express.json());
    app.use(cors());

    await server.start()
    app.use("/graphql",expressMiddleware(server))


    app.listen(8000,()=>{
        console.log("server started on port 8000")
    })
}

startServer();