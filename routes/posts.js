const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//crete a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//update post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            return res.status(200).json("the post has been updated");

        } else {
           return  res.status(403).json("you can update only your post");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});
router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
//like dislike post
router.put("/:id/like",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("The post has been liked");

        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            return res.status(200).json("the post has benen disliked");
        }
    }catch(err){
        return res.status(500).json(err);
    }
});

//get a post
router.get("/:id",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);

    }catch(err){
        return res.status(500).json(err);
    }

});

//get timeline posts
router.get("/timeline/all",async(req,res)=>{
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id});
        const freindPosts = await Promise.all(
            currentUser.followings.map((freindId)=>{
                return Post.find({userId:freindId});
            })
        );
        return res.status(200).json(userPosts.concat(...freindPosts));
    }catch(err){
        return res.status(500).json(err);
    }
});

module.exports = router;