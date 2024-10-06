import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { listing } from "./models/list-schema.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wander-lust");
}

main().then(()=> console.log("connected to DB"))
.catch((err)=> console.log("Error while connecting to DB",err));

let port = 3030;
app.listen(port,()=>{
    console.log("listening on Port:",port);
});
app.get("/",(req,res)=>{
    res.send("response recieved");
});
app.get("/listings",async (req,res)=>{
  let data = await listing.find();
  console.log(data);
});