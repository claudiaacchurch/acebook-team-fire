import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import Grid from "@mui/material/Grid";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
const CreatePost = ({ setPosts, token, setToken }) => {
  const [message, updateMessage] = useState();
  const [image, updateImage] = useState();
  const submitPost = (e) => {
    e.preventDefault();
    fetch("/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        image,
      }),
    }).then((res) => {
      if (res.status === 201) {
        setPosts((prev) => [
          {
            message,
            image,
          }, ...prev
        ]);
        res.json().then((data) => {
          window.localStorage.setItem("token", data.token);
          setToken(window.localStorage.getItem("token"));
        });
      }
    });
  };
  return (
    <Grid>
      <Card style={{ maxWidth: 400, padding: "", margin: "10px auto" }}>
        <CardContent>
          {/* <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            gutterBottom
          >
            What's on your mind?
          </Typography> */}
          <form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField id='message'
                  onChange={(e) => updateMessage(e.target.value)}
                  multiline
                  rows={2}
                  placeholder="What's on your mind today?"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField id="image"
                  onChange={(e) => {
                    updateImage(e.target.value);
                  }}
                  rows={1}
                  placeholder="Image URL"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button id="submit"
                  onClick={submitPost}
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Grid>
  );
};
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
      body: JSON.stringify({ likes: post.likes})
    });
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      let data = await response.json();
      const updatedPosts = posts.map(p => {
        if (p._id === post._id) {
          return { ...p, likes: p.likes + 1};
        }
        return p;
      });
      setPosts(updatedPosts);
      window.localStorage.setItem("token", data.token);
      setToken(window.localStorage.getItem("token"));
      navigate('/posts')
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
        <CreatePost
            setPosts={setPosts}
            token={token}
            setToken={setToken}
          />
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