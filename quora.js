import express from "express";
import path from 'path';
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import mongoose, { modelNames } from "mongoose";
import { faker } from '@faker-js/faker';

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/quora');
}

main().then(()=>{
    console.log("connection Successfull");
}).catch(()=>{
    console.log("Error in Connection !");
});

function createRandomUser() {
    return {
      avatar: faker.image.avatar()
    };
  }

const chatschema = mongoose.Schema({
    username :{
        type: String,
        required :true
    },
    content:{
        type:String,
        required :true
    },
    date:{
        type:Date,
        required:true
    },
    avatar:{
        type:String,
        required:true
    }
});

let post = mongoose.model("post",chatschema);


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

let port = 3030;
app.listen(port,()=>{
    console.log("listening on Port:",port);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public/css")));


app.get("/quora",async(req,res)=>{
    let data =await post.find();
    res.render("quora.ejs",{data});
});
app.get("/quora/new",(req,res)=>{
    res.render("quora-form.ejs");
});

app.get("/quora/:id",async(req,res)=>{ //details
    let {id:userid} =req.params;
    let postfind = await post.findOne({_id:userid});

    res.render("quora-details.ejs",{postfind});
});
app.patch("/quora/:id",async(req,res)=>{  //update
    let {id} = req.params;  
    let newcontent =req.body.content;
    await post.updateOne({_id:id},{content:newcontent})
    res.redirect("/quora?posted=done");
});
app.get("/quora/:id/edit",async(req,res)=>{ //update
    let {id} = req.params;
    let postfind = await post.findOne({_id:id});
    res.render("quora-edit.ejs",{postfind});
});

app.get("/quora/:id/delete",async(req,res)=>{   //delete-form
    let {id}=req.params;
    let postfind = await post.findOne({_id:id});
    res.render("quora-delete",{postfind});
})

app.delete("/quora/:id",async(req,res)=>{ //delete
    let id =req.params.id;  
    let pass = req.body.password;
    let postfind = await post.findOne({_id:id});
    if(pass == postfind.username){
       await post.deleteOne({_id:id});
        res.redirect("/quora?post=deleted");
    }
    else{
        res.redirect("/quora?pass=wrong");
    }
})

app.post("/quora",async(req,res)=>{  //create
    try{
        let {username, content} =req.body;
        let newPost=  new post({username,content,date:new Date(),avatar:createRandomUser().avatar});
        console.log(newPost);
        await newPost.save();
    
        res.redirect("/quora?posted=true");
    }
    catch(err){
        console.log(err);
        res.status(500).send("Every Field is Mandatory..");
    }
});
app.get("*",(req,res)=>{
    res.send("No_path");
});



