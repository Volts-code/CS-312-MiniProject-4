const express = require("express");
const fs = require("fs");
const router = express.Router();
const postsFile = "./data/posts.json";

function readPosts() {
    const data = fs.readFileSync(
        postsFile,
        "utf-8"
    );
    return JSON.parse(data);
}

function savePosts(posts) {
    fs.writeFileSync(
        postsFile,
        JSON.stringify(posts, null, 2)
    );
}

// Get all the posts
router.get("/posts", (req,res)=>{
    const posts = readPosts();
    res.json(posts);
});

// Get single post
router.get("/posts/:id", (req,res)=>{
    const posts = readPosts();
    const post = posts.find(
        item => item.id == req.params.id
    );

    if(!post){
        return res.status(404).json({
            message:"Post not found"
        });
    }
    res.json(post);
});

// Create Post
router.post("/posts", (req,res)=>{
    const {
        title,
        body,
        author
    } = req.body;

    const posts = readPosts();
    const newPost = {
        id: Date.now(),
        title,
        body,
        author
    };

    posts.push(newPost);
    savePosts(posts);
    res.json({
        success:true,
        message:"Post created",
        post:newPost
    });
});

// Update edit post
router.put("/posts/:id", (req,res)=>{
    const posts = readPosts();
    const post = posts.find(
        item => item.id == req.params.id
    );

    if(!post){
        return res.json({
            success:false,
            message:"Post not found"
        });
    }

    if(post.author !== req.body.author){
        return res.json({
            success:false,
            message:"You cannot edit this post"
        });
    }

    post.title = req.body.title;
    post.body = req.body.body;
    savePosts(posts);
    res.json({
        success:true,
        message:"Post updated"
    });
});

// Deletes Post
router.delete("/posts/:id", (req,res)=>{
    const posts = readPosts();
    const post = posts.find(
        item => item.id == req.params.id
    );

    if(!post){
        return res.json({
            success:false,
            message:"Post not found"
        });
    }

    if(post.author !== req.body.author){
        return res.json({
            success:false,
            message:"You cannot delete this post"
        });
    }

    const updatedPosts = posts.filter(
        item => item.id != req.params.id
    );
    savePosts(updatedPosts);

    res.json({
        success:true,
        message:"Post deleted"
    });
});
module.exports = router;