const express = require("express");
const fs = require("fs");
const router = express.Router();
const usersFile = "./data/users.json";

function readUsers() {
    const data = fs.readFileSync(
        usersFile,
        "utf-8"
    );
    return JSON.parse(data);
}

function saveUsers(users) {
    fs.writeFileSync(
        usersFile,
        JSON.stringify(users, null, 2)
    );
}

// Sign up
router.post("/signup", (req, res)=>{
    const {
        user_id,
        password,
        name
    } = req.body;

    const users = readUsers();
    const existingUser = users.find(
        user => user.user_id === user_id
    );

    if(existingUser){
        return res.json({
            success:false,
            message:"User already exists"
        });
    }

    const newUser = {
        id: Date.now(),
        user_id,
        password,
        name
    };

    users.push(newUser);
    saveUsers(users);
    res.json({
        success:true,
        message:"Account created"
    });
});









// Sign in
router.post("/signin", (req,res)=>{
    const {
        user_id,
        password
    } = req.body;

    const users = readUsers();
    const user = users.find(
        item =>
        item.user_id === user_id &&
        item.password === password
    );

    if(user){
        return res.json({
            success:true,
            user
        });
    }

    res.json({
        success:false,
        message:"Invalid username or password"
    });
});
module.exports = router;