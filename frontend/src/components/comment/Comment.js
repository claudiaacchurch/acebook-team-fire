import React from 'react';

// const currentDate = new Date();
// const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

const Comment = ({comment, index}) => {
  return(
    <article 
        data-cy="comment" 
        key={ index }
    >
        <p>
            { comment.text } 
        </p>
        <p>
            By: { comment.username } 
        </p>
        <p>
            Date: { comment.commentDate }
        </p>
    </article>
  )
}
export default Comment;