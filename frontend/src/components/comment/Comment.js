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
            By: { comment.username } 
        </p>
        <p>
            Date: {  new Date(comment.commentDate)
        .toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'shortGeneric',
            timeZone: 'GMT'
        })}
        </p>
    </article>
  )
}
export default Comment;