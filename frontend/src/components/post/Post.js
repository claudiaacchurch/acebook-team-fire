import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Avatar from "@mui/material/Avatar";

const Post = ({ post }) => {
  console.log(post.image);
  if (post.image) {
    return (
      <Card sx={{ maxWidth: 345, minWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            width="140"
            image="/static/images/cards/contemplative-reptile.jpg"
            alt=""
          />
          <CardContent>
            <Typography gutterBottom variant="body2" component="div">
              <Avatar
                alt="Bradley Holmes"
                src="https://scontent-lcy1-2.xx.fbcdn.net/v/t39.30808-1/310285225_1513744109030996_9039978547407087346_n.jpg?stp=dst-jpg_p148x148&_nc_cat=110&ccb=1-7&_nc_sid=dbb9e7&_nc_ohc=qR3B1Jh19EEAX9fP8_u&_nc_ht=scontent-lcy1-2.xx&oh=00_AfDtHueOr5WdHds3xZ6Jc7KPD811DKCvDcC5eLvlCp5Ygg&oe=64D17777"
              />
              Bradley Holmes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  } else {
    return (
      <Card sx={{ maxWidth: 345, minWidth: 345 }}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Bradley Holmes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
};

export default Post;
