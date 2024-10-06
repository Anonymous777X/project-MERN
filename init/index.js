import mongoose from "mongoose";
import { listing } from "../models/list-schema.js";
import { data } from "../init/data.js";

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wander-lust");
}

main().then(()=> console.log("connected to DB"))
.catch((err)=> console.log("Error while connecting to DB",err));

async function init() {
    try {
        await listing.deleteMany({});
        console.log("All Data Deleted");

        await listing.insertMany(data);
        console.log("New Data inserted");
    } catch (err) {
        console.log("Error while initializing:", err);
    }
}

init()

