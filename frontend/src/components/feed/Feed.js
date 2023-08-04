import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import Grid from "@mui/material/Grid";
import Navbar from "../navbar/Navbar";


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
  }, []);

  if (token) {
    return (
      <>
        <Navbar navigate={navigate} />
        <div id="feed" role="feed">
          <h3>Welcome back! here's what you missed</h3>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: "100vh" }}
          >
            <Grid item xs={3}>
              {posts.map((post) => (
                <Post post={post} key={post._id} />
              ))}
            </Grid>
          </Grid>
        </div>
      </>
    );
  } else {
    navigate("/login");
  }
};

export default Feed;
