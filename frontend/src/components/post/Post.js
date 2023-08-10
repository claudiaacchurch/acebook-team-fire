import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { CardActionArea } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import CommentForm from "../commentForm/CommentForm";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const Post = ({ post, updateLikes }) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  const submitComment = async (commentText) => {
    let response = await fetch("/users/@me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    let data = await response.json();
    window.localStorage.setItem("token", data.token);
    setToken(window.localStorage.getItem("token"));
    const comment = {
      text: commentText,
      authorName: data.username,
      commentDate: new Date(),
    };
    response = await fetch(`/posts/${post._id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comments: comment }),
    });
  };

  if (post.image) {
    return (
      <Card
        sx={{ maxWidth: 400, minWidth: 400 }}
        style={{ marginBottom: "10px" }}
      >
        <CardActionArea>
          <CardContent>
            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ marginBottom: "10px" }}
            >
              <Grid item>
                <Avatar
                  width="70"
                  src={
                    post.user?.profilePic ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
                  }
                />
              </Grid>
              <Grid item>
                <Typography variant="h6">{post.user?.username}</Typography>
              </Grid>
            </Grid>
            {/* <Typography gutterBottom variant="body2" component="div">
              <Avatar
                width="70"
                alt="Bradley Holmes"
                src={post.user?.profilePic || "none"}
              />
              <Typography variant="h5">{post.user?.username}</Typography>
            </Typography> */}
            <Typography data-cy="post" variant="body2" color="text.secondary">
              {post.message}
            </Typography>
            <CardMedia
              style={{ marginTop: "2px" }}
              component="img"
              width="140"
              image={post.image}
              alt=""
              sx={{ marginBottom: "5px" }}
            />
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <p>
                  <b>{post.likes}</b>
                </p>
              </Grid>
              <Grid item>
                <ThumbUpIcon
                  className={`like-btn-${post._id}`}
                  onClick={() => updateLikes(post)}
                  sx={{ marginRight: 3 }}
                />
              </Grid>
              <Grid item>
                <CommentForm submitComment={submitComment} />
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  } else {
    return (
      <Card
        sx={{ maxWidth: 400, minWidth: 400 }}
        style={{ marginBottom: "10px" }}
      >
        <CardActionArea>
          <CardContent>
            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ marginBottom: "10px" }}
            >
              <Grid item>
                <Avatar
                  width="70"
                  src={
                    post.user?.profilePic ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
                  }
                />
              </Grid>
              <Grid item>
                <Typography variant="h6">{post.user?.username}</Typography>
              </Grid>
            </Grid>
            <Typography data-cy="post" variant="body2" color="text.secondary">
              {post.message}
            </Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <p>
                  <b>{post.likes}</b>
                </p>
              </Grid>
              <Grid item>
                <ThumbUpIcon
                  className={`like-btn-${post._id}`}
                  onClick={() => updateLikes(post)}
                  sx={{ marginRight: 3 }}
                />
              </Grid>
              <Grid item sx={12}>
                <CommentForm submitComment={submitComment} />
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
};

export default Post;
