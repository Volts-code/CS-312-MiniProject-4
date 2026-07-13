import React from "react";
import BlogPostForm from "./BlogPostForm";
import PostList from "./PostList";

function Home() {
    return (

        <div>

            <h1 className="page-title">
                Welcome to the Blog
            </h1>

            <BlogPostForm/>

            <hr/>

            <PostList/>

        </div>
    );
}
export default Home;