const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = require("express").Router();

router.post("/register",async (req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        });
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
});

router.post("/login",async (req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(user){
            const validPassword = await bcrypt.compare(req.body.password,user.password);
            if(validPassword){
                res.status(200).json(user);
            }else{
                res.status(400).json("Wrong Password");
            }
        }else{
            res.status(400).json("User not found");
        }

    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;