const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                req.body.password = await bcrypt.hash(req.body.password,10);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
             return res.status(200).json(user);
        }catch(err){
            return res.status(500).json(err);
        }

    }else{
        return res.status(403).json("You can update only your account");
    }
});

//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  });

  //get a user
  router.get("/:id",async(req,res)=>{
      try{
          const user = await User.findById(req.params.id);
          res.status(200).json(user);
      }catch(err){
          res.status(500).json(err);
      }
  });
  //follow a user
  router.put("/:id/follow",async(req,res)=>{
      if(req.body.userId !== req.params.id){
          try{
              const user =await User.findById(req.params.id);
              const currentUser = await User.findById(req.body.userId);
              if(!user.followers.includes(req.body.userId)){
                  await user.updateOne({$push:{followers:req.body.userId}});
                  await currentUser.updateOne({$push:{followings:req.params.id}});
                  return res.status(200).json("user have been followed");
              }else{
                  return res.status(403).json("you already follow this user");
              }
          }catch(err){
              res.status(500).json(err);
          }


      }else{
          res.status(403).json("you cant follow yourself");
      }
  });
  //unfollow a user
  router.put("/:id/unfollow",async(req,res)=>{
      if(req.params.id !== req.body.userId){
          try{
              const currentUser = await User.findById(req.body.userId);
              const user = await User.findById(req.params.id);
              if(user.followers.includes(req.body.userId)){
                  await user.updateOne({$pull :{followers:req.body.userId}});
                  await currentUser.updateOne({$pull:{followings:req.params.id}});
                  return res.status(200).json("user has been unfollowed");

              }else{
                  return res.status(403).json("you dont follow this user");
              }
          }catch(err){
              return res.status(500).json(err);
          }

      }else{
          res.status(403).json("you cant unfollow yourself");
      }
  });






module.exports=router;
