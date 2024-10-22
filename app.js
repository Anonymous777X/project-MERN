import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";  
import { listing } from "./models/list-schema.js";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { wrapAsync } from "./utils/wrapAsync.js";
import { expressError } from "./utils/expressError.js";
import { joiSchema } from "./joi-schema.js"; 

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

function validateschema(req, res, next) {
    let { error } = joiSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map(err => err.message).join(",");
        console.log(errorMessage)
        // Remove "listings." from the error message if it exists
        errorMessage = errorMessage.replace(/"listings\.|"/g, '').replace(/^(\w)/, (c) => c.toUpperCase());

        throw new expressError(400, errorMessage);
    } else {
        next();
    }
}


//index
app.get("/listings",wrapAsync(async (req,res)=>{
  let data = await listing.find();
  res.render("index.ejs",{data});
}));

//Create
app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
});
app.post("/listings",validateschema ,wrapAsync(async(req,res,next)=>{
  
    let {listings}= req.body;
    await new listing(listings).save();
    res.redirect("/listings?posted=true");
}));

//update
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let data = await listing.findById(id);
    res.render("edit.ejs",{data});
}));
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let data = req.body.listings;
    await listing.findByIdAndUpdate(id,data);
    res.redirect("/listings?post=updated");
}));

//delete
app.delete("/listings/:id/delete",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings?post=deleted");

}));

//show details
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let id =req.params.id;
    let data= await listing.findOne({_id:id});
    res.render("show.ejs",{data});
}));

app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found!"))
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="oops! something went wrong."} = err;
    res.status(statusCode).render("error.ejs",{message}); 
})
