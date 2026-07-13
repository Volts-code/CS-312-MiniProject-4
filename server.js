const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/", authRoutes);
app.use("/", postRoutes);

app.get("/", (req, res)=>{
    res.json({
        message:"Blog API is running"
    });
});

app.listen(PORT, ()=>{
    console.log(
        `Server running on port ${PORT}`
    );
});