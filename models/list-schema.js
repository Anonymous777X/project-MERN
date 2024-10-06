import mongoose from "mongoose";


let newschema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://media.istockphoto.com/id/182689167/photo/six-hands-catching-clouds-blue-sky.jpg?s=1024x1024&w=is&k=20&c=AEoj1hPal7IyZTjPOHJxpaOJXqons1B_HeoOk5jOKKU=",
        set:(v)=> v===""
        ? "https://media.istockphoto.com/id/182689167/photo/six-hands-catching-clouds-blue-sky.jpg?s=1024x1024&w=is&k=20&c=AEoj1hPal7IyZTjPOHJxpaOJXqons1B_HeoOk5jOKKU="
         :v,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    }
});

export let listing = mongoose.model("list",newschema);

