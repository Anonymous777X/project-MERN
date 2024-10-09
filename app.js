import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";  
import { listing } from "./models/list-schema.js";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public/css")));
app.use(express.static(path.join(__dirname,"public/js")));

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
//index
app.get("/listings",async (req,res)=>{
  let data = await listing.find();
  res.render("index.ejs",{data});
});

//Create
app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
});
app.post("/listings",async (req,res)=>{
    let {listings}= req.body;
    await new listing(listings).save();
    res.redirect("/listings?posted=true");

});

//update
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let data = await listing.findById(id);
    res.render("edit.ejs",{data});
});
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let data = req.body.listings;
    await listing.findByIdAndUpdate(id,data);
    res.redirect("/listings?post=updated");
});

//delete
app.delete("/listings/:id/delete",async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings?post=deleted");

})

//show details
app.get("/listings/:id",async(req,res)=>{
    let id =req.params.id;
    let data= await listing.findOne({_id:id});
    res.render("show.ejs",{data});
});
