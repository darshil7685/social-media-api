const express = require("express");
const app = express();

const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

mongoose.connect("mongodb://localhost:27017/Apisocialmedia",{
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("connection successful");
}).catch((error)=>{
    console.log("Connection not successful",error);
});

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);



app.listen(8000,()=>{
    console.log("server is running");
})