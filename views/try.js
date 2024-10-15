import express from "express";
import {handler} from "./errorr.js";
let app = express();

app.listen(3003,()=>{
    console.log("Port Open");
});

const midhandler = (req,res,next)=>{
    if (req.query.q =="go"){
        next();
    }
    throw new handler(401,"Access Denied");
}
app.get("/api",midhandler,(req,res)=>{
    res.send("Data");
});
app.get("/hii",(req,res)=>{
    abcd=abcd;
})
app.use((err,req,res,next)=>{
    let {status = 400,message = "An error"} =err;
    res.status(status).send(message);
    next(err);
});