import React, { useState } from "react";
import axios from "axios";

function BlogPostForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
        e.preventDefault();
        const user = localStorage.getItem("user");

        if(!user) {
        setMessage("Please sign in before creating a post");
        return;
        }

        const newPost = {
        title,
        body,
        author: user
        };

        try {

            const response = await axios.post(
                "/api/posts",
                newPost
            );

            if(response.data.success) {
                setMessage("Post created successfully");
                setTitle("");
                setBody("");

                window.location.reload();
            }
            else {
                setMessage(response.data.message);
            }
        } 
            catch(error) {
                setMessage("Server error");
            }
    }

    return (

        <div className="form-container">

            <h3>
                Create New Blog Post
            </h3>

            <form onSubmit={handleSubmit}>
                <label>
                    Title
                </label>

                <input
                    type="text"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    placeholder="Enter blog title"
                    required
                />

                <label>
                    Content
                </label>

                <textarea
                    value={body}
                    onChange={(e)=>setBody(e.target.value)}
                    placeholder="Write your blog content"
                    required
                />
                
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Create Post
                </button>
            </form>

            {
                message &&
                <div className="alert alert-info mt-3">
                {message}
                </div>
            }
        
        </div>
    );
}
export default BlogPostForm;
