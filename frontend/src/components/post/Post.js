import React from 'react';
import Comment from '../comment/Comment';

const Post = ({post}) => {
  return(
    <article 
      data-cy="post" 
      key={ post._id }
    >
      <p className="post-message">{ post.message }</p>
      <p className="post-comments">
        {post.comments.map((comment) => {
          return <Comment comment={comment} />
        })}
      </p>
      { post.comments.text }</article>
  )
}

export default Post;
