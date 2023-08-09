import React, {useState} from 'react';
import CommentForm from '../commentForm/CommentForm';

const Post = ({post, updateLikes}) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  const submitComment = async (commentText) => {
    let response = await fetch('/users/@me', {method: 'GET',headers: {'Authorization': `Bearer ${token}`}});
    let data = await response.json();
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
      <article data-cy="post" key={ post._id }>{ post.message } { post.likes }</article>
      <button class={"like-btn-"+ post._id} onClick={() => updateLikes(post)}>Like</button>
      <CommentForm submitComment = {submitComment}/>
    </div>
 )
}
export default Post;