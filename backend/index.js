import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ImageKit from 'imagekit';
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";


dotenv.config();


const port = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB)
        console.log("Connected to MONGODB")
    } catch (error) {
        console.log(error)
    }
}

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
})

// UPLOAD IMAGE
app.get("/api/upload", (req,res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

/* app.get("/api/test", ClerkExpressRequireAuth(), (req,res)=>{
//     const userId = req.auth.userId;
//     console.log(userId);
//     res.send("Success");
}) */

// CREATE A NEW CHAT
app.post("/api/chats", ClerkExpressRequireAuth(), async (req,res) => {
    const userId = req.auth.userId;
    const {text} = req.body;
    try {
        // CREATE A NEW CHAT
      const newChat = new Chat({
        userId:userId,
        history: [{role:"user", parts:[{text}]}]
      });

      const savedChat = await newChat.save();

      // CHECK IF THE USERCHATS EXISTS
      const userChats = await UserChats.find({userId:userId});

      // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
      if(!userChats.length) {
        const newUserChats = new UserChats({
            userId:userId,
            chats:[{
                _id: savedChat._id,
                title: text.substring(0,40),
            }]
        });

        await newUserChats.save();
      } else {
        // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
        await UserChats.updateOne({userId:userId},{
            $push: {
                chats: {
                    _id: savedChat._id,
                    title: text.substring(0,40),
                }
            }
        });

        res.status(201).send(newChat._id);
      }

    } catch (error) {
        console.log(error)
        res.status(500).send("Error creating chat!",{error: error.message})
    }
})

// FETCH USER CHATS
app.get("/api/userchats",ClerkExpressRequireAuth(), async (req,res) => {
    const userId = req.auth.userId;

    try {
        const userChats = await UserChats.findOne({ userId });
        
        // Kullanıcının hiç chat'i yoksa
        if (!userChats) {
            return res.status(200).send([]);
        }
        
        res.status(200).send(userChats.chats);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error fetching userchats!",{error: error.message})
    }
})

// FETCH A SINGLE CHAT
app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req,res) => {
    const userId = req.auth.userId;

    try {
        const chat = await Chat.findOne({ _id:req.params.id, userId });

        res.status(200).send(chat);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error fetching the chat!",{error: error.message})
    }
});

// UPDATE THE CHAT (ADD CONVERSATION)
app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req,res) => {
    const userId = req.auth.userId;

    const {question, answer, img} = req.body;

    const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

    try {
        const updatedChat = await Chat.updateOne({_id: req.params.id, userId},{
            $push: {
                history: {
                    $each: newItems
                }
            }
        })
        res.status(200).send(updatedChat);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error adding conversation!",{error: error.message})
    }
})

// ERROR HANDLER - CLERK
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(401).send("Unauthenticated!");
})

app.listen(port, () => {
    connect()
    console.log(`Server running on ${port}`)
})