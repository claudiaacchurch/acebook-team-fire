import React, { useState } from 'react';
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import Input from "@mui/material/Input"

const CommentForm = ({submitComment}) => {
  const [comment, setComment] = useState('');

  const handleChange = (e) => {
    setComment(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    submitComment(comment);
    setComment('');
  };  

  return(
    <form onSubmit={handleSubmit}>
      <Input data-cy="comment-text" type = "text" value = {comment} onChange={handleChange} placeholder = "Add Comment"/>
      <SendOutlinedIcon type = "submit" data-cy="submit-comment" />
    </form>
  );
}
  
  export default CommentForm;