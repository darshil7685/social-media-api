const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            min:30,
            max:20,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            uinque:true,
        },
        password:{
            type:String,
            required:true,
        },
        profilePicture:{
            type:String,
            default:"",
        },
        coverPicture:{
            type:String,
            default:"",
        },
        followers:{
            type:Array,
            default:[],
        },
        followings:{
            type:Array,
            default:[],
        },
        isAdmin:{
            type:Boolean,
            default:false,
        },
        desc:{
            type:String,
            max:50,
        }
    },
    { timestamps:true}
);

module.exports= new mongoose.model("User",userSchema);

