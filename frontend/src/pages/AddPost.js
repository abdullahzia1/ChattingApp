import React, { useContext } from "react";
import useAxios from "../utils/useAxios";
import AuthContext from "../context/AuthContext";
import PostContext from "../context/PostContext";

import "./styles/AddPost.css";
const AddPost = () => {
  const { user } = useContext(AuthContext);
  const { posts, setPosts } = useContext(PostContext);

  const api = useAxios();
  const handleInput = async (e) => {
    e.preventDefault();
    const response = await api.post("/api/posts/new", {
      email: user.email,
      title: e.target.title.value,
    });
    setPosts([response.data.newPost, ...posts]);

    // setTimeout(() => {
    //   console.log("Posting from ADD", posts);
    // }, 2000);
  };

  return (
    <>
      <div class="form-container">
        <form onSubmit={handleInput}>
          <input
            type="text"
            name="title"
            placeholder="Enter Title"
            class="form-input"
          />
          <input type="submit" value="Add Post" class="form-submit" />
        </form>
      </div>
      <br />
      <br />
      <div>
        <div class="post-list-header">All Posts</div>
        <div>
          <ul class="post-list">
            {posts.map((post) => (
              <li key={post.post_id} class="post-item">
                {post.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AddPost;
