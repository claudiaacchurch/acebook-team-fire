import React, { useState, useEffect } from "react";
import Post from "../post/Post";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("/users/@me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setUser(data);
      window.localStorage.setItem("token", data.token);
      setToken(window.localStorage.getItem("token"));
      if (data && data.userId) {
        await getUserPosts(data);
      }
    };
    fetchProfile();
  }, []);

  const getUserPosts = async (user) => {
    let response = await fetch(`/posts/user/${user.userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    ) {
      let data = await (await response).json();
      setPosts(data.posts);
      window.localStorage.setItem("token", data.token);
      setToken(window.localStorage.getItem("token"));
    } else {
      console.log(response.status);
    }
  };

  const updateLikes = async (post) => {
    let response = await fetch(`/posts/${post._id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: post.likes }),
    });
    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    ) {
      let data = await response.json();
      const updatedPosts = posts.map((p) => {
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

  return (
    <div>
      <article data-cy="user" key={user.userId}>
        <p>{user.userId}</p>
        <p>
          <img
            width="30"
            src={
              user.profilePic ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
            }
            alt="User’s Profile"
          />
        </p>
        <p>Username: {user.username}</p>
      </article>

      <div>
        <h2>Your posts</h2>
        {posts?.map((post) => (
          <Post
            post={post}
            key={post._id}
            updateLikes={() => updateLikes(post)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
