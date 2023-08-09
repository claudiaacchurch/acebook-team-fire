import React from 'react';
const Post = ({post, updateLikes}) => {

  return(
    <article data-cy="post" key={ post._id }>{post.message} { post.likes }
      <button id="like-button" class={"like-btn-"+ post._id} onClick={() => updateLikes(post)}>Like</button>
    </article>
  )
}
export default Post;