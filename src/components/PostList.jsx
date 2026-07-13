import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const user = localStorage.getItem("user");

  async function getPosts() {

        try {
            const response = await axios.get(
                "/api/posts"
            );
            setPosts(response.data);
        } 
        catch(error) {
            setMessage("Could not load posts");
        }
    }
        useEffect(()=>{
            getPosts();
        },[]);

    async function deletePost(id, author) {
        if(user !== author) {
            setMessage("You can only delete your own posts");
            return;
        }

        try {
            const response = await axios.delete(
                `/api/posts/${id}`,
                {
                    data: {
                        author:user
                    }
                }
            );

            if(response.data.success) {
                setMessage("Post deleted");
                getPosts();
            }
        } 
        catch(error) {
            setMessage("Delete failed");
        }
    }

    return (

        <div>
            <h2 className="page-title">
                Blog Posts
            </h2>
            {
                message &&
                <div className="alert alert-info">
                    {message}
                </div>
            }

            {
                posts.length === 0 ?
                (
                    <p>
                        No posts available.
                    </p>
                )
                :
                posts.map((post)=>(
                    <div
                        className="blog-card"
                        key={post.id}
                    >

                        <h3 className="blog-title">
                            {post.title}
                        </h3>

                        <p className="blog-body">
                            {post.body}
                        </p>

                        <p className="blog-author">
                            <strong>
                                Author:
                            </strong>
                            {" "}
                            {post.author}
                        </p>

                        {

                            user === post.author &&
                            <>
                                <div className="mt-3">
                                    <Link
                                        to={`/edit/${post.id}`}
                                        className="btn btn-warning me-3"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                    className="btn btn-danger"
                                        onClick={()=>deletePost(
                                            post.id,
                                            post.author
                                        )}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                ))
            }
        </div>
    );
}
export default PostList;