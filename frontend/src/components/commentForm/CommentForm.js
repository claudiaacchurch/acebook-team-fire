import React, {useState} from 'react';

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
      <input data-cy="comment-text" type = "text" value = {comment} onChange={handleChange} placeholder = "Add Comment"/>
      <button type = "submit" data-cy="submit-comment">Add Comment </button>
    </form>
  );
}
  
  export default CommentForm;