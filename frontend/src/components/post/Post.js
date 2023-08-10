import React, {useState} from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import CommentForm from '../commentForm/CommentForm';

const Post = ({ post, updateLikes }) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  const submitComment = async (commentText) => {
    let response = await fetch('/users/@me', {method: 'GET',headers: {'Authorization': `Bearer ${token}`}});
    let data = await response.json();
    window.localStorage.setItem("token", data.token);
    setToken(window.localStorage.getItem("token"));
    const comment = {text: commentText, authorName: data.username, commentDate: new Date()};
    response = await fetch(`/posts/${post._id}`, 
                          {method: 'PATCH', 
                          headers: {
                            Authorization: `Bearer ${token}`}, 
                            'Content-type' : "application/json",
                          body: JSON.stringify({'comments':comment})});
  }

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
              <CommentForm submitComment = {submitComment}/>
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
              <CommentForm submitComment = {submitComment}/>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
};



export default Post;
