import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

    async function getPost() {
        try {
            const response = await axios.get(
                `/api/posts/${id}`
            );

            const post = response.data;
            setTitle(post.title);
            setBody(post.body);
            setAuthor(post.author);
        } 
        catch(error) {
        setMessage("Could not load post");
        }
    }

    useEffect(()=>{
        getPost();
    },[]);

    async function handleSubmit(e) {
        e.preventDefault();
        const user = localStorage.getItem("user");

        if(user !== author) {
            setMessage(
                "You can only edit your own posts"
            );
            return;
        }

        const updatedPost = {
            title,
            body,
            author:user
        };

        try {
            const response = await axios.put(
                `http://localhost:8000/posts/${id}`,
                updatedPost
            );

            if(response.data.success) {
                setMessage(
                    "Post updated successfully"
                );
                setTimeout(()=>{
                    navigate("/");
                },1000);
            }

            else {
                setMessage(response.data.message);
            }
        }
        catch(error) {
            setMessage("Update failed");
        }
    }

    return (

        <div className="form-container">

            <h2 className="page-title">
                Edit Blog Post
            </h2>

                <form onSubmit={handleSubmit}>

                    <label>
                        Title
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        required
                    />

                    <label>
                        Content
                    </label>

                    <textarea
                        value={body}
                        onChange={(e)=>setBody(e.target.value)}
                        required
                    />

                    <button
                        className="btn btn-success"
                        type="submit"
                    >
                        Save Changes
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
export default EditPost;