import React, { useState } from 'react';
const Post = ({post, updateLikes}) => {

  const [token, setToken] = useState(window.localStorage.getItem("token"));

  return(
    <article data-cy="post" key={ post._id }>{post._id} {post.message} { post.likes }
      <button class={"like-btn-"+ post._id} onClick={() => updateLikes(post)}>Like</button>
    </article>
  )
}
export default Post;