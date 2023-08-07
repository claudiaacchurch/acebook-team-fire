import React from 'react';
const Comment = ({comment}) => {
  return(
    <article data-cy="comment" key={ comment._id }>{ comment.message } Comment Author { comment.author_name } Datetime { comment.datetime }</article>
  )
}
export default Comment;