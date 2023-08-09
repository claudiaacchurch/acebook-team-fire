import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Avatar from "@mui/material/Avatar";

const Post = ({ post, updateLikes }) => {
  if (post.image) {
    return (
      <Card
        sx={{ maxWidth: 400, minWidth: 400 }}
        style={{ marginBottom: "10px" }}
      >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="body2" component="div">
              <Avatar
                width="70"
                alt="Bradley Holmes"
                src={post.user?.profilePic || "none"}
              />
              <Typography variant="h5">{post.user?.username}</Typography>
            </Typography>
            <Typography data-cy= "post" variant="body2" color="text.secondary">
              {post.message}
            </Typography>
            <Typography data-cy= "post" variant ="body2" color="text.secondary">
              Likes: {post.likes}
            </Typography>
            <CardMedia
              style={{ marginTop: "2px" }}
              component="img"
              width="140"
              image={post.image}
              alt=""
            />
              <button className={"like-btn-"+ post._id}
              onClick={() => updateLikes(post)}>Like</button>
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
            <Typography gutterBottom variant="h5" component="div">
              {post.user?.username}
            </Typography>
            <Typography data-cy= "post" variant="body2" color="text.secondary">
              {post.message}
            </Typography>
            <Typography data-cy= "post" variant ="body2" color="text.secondary">
              Likes: {post.likes}
            </Typography>
          <button className={"like-btn-"+ post._id}
              onClick={() => updateLikes(post)}>Like</button>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
};

export default Post;

