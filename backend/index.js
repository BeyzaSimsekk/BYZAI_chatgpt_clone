import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ImageKit from 'imagekit';
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL
}));

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

app.get("/api/upload", (req,res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
})

app.listen(port, () => {
    connect()
    console.log(`Server running on ${port}`)
})