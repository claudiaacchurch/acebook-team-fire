import React, { useEffect, useState } from "react";
import Post from "../post/Post";

const Feed = ({ navigate }) => {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      fetch("/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          window.localStorage.setItem("token", data.token);
          setToken(window.localStorage.getItem("token"));
          setPosts(data.posts);
        });
    }
  }, [token]);

  const updateLikes = async (post) => {
    let response = await fetch(`/posts/${post._id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: post.likes}),
    });

    if (response.status === 200 || response.status === 201 || response.status === 204) {
      let data = await response.json();


      const updatedPosts = posts.map(p => {
        if (p._id === post._id) {
          return { ...p, likes: p.likes + 1 }; 
        }
        return p;
      });

      setPosts(updatedPosts); 

      window.localStorage.setItem("token", data.token);
      setToken(window.localStorage.getItem("token"));

    } else {
      console.log(response.status);
      throw new Error("Like not added");
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  if (token) {
    return (
      <>
        <h2>Posts</h2>
        <button onClick={logout}>Logout</button>
        <div id="feed" role="feed">
          {posts.map((post) => (
            <Post post={post} key={post._id} updateLikes={updateLikes} />
          ))}
        </div>
      </>
    );
  } else {
    navigate("/login");
  }
};

export default Feed;
