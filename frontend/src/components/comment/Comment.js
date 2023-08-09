import React from 'react';
const Comment = ({comment}) => {
  return(
    <article 
        data-cy="comment" 
        key={ comment._id }
    >
        <p>
            { comment.text } 
        </p>
        <p>
            By: { comment.authorId } 
        </p>
        <p>
            Date: { comment.commentDate }
        </p>
    </article>
  )
}
export default Comment;