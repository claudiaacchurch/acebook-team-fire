import React, {useState} from 'react';
import CommentForm from '../commentForm/CommentForm';

const Post = ({post}) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  const submitComment = async (commentText) => {
    let response = await fetch('users/@me', {headers: {'Authorization': `Bearer ${token}`}});
    let data = await response.json();
    console.log(post);
    window.localStorage.setItem("token", data.token);
    setToken(window.localStorage.getItem("token"));
    const comment = {text: commentText, authorName: data.username, commentDate: new Date()};
    response = await fetch(`/posts/${post._id}`, 
                          {method: 'PATCH', 
                          headers: {
                            'Content-type' : "application/json",
                            'Authorization': `Bearer ${token}`}, 
                          body: JSON.stringify({'comments':comment})});
  }


  return(
    <div>
      <article data-cy="post" key={ post._id }>{ post.message }</article>
      <CommentForm submitComment = {submitComment}/>
    </div>
  )
}

export default Post;
