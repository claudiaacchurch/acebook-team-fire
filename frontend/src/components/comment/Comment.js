import React from 'react';
import { Avatar, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

const CommentWrapper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const AvatarWrapper = styled(Avatar)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const ContentWrapper = styled('div')({
  flex: 1,
});


const Comment = ({comment, index}) => {
//   return(
    // <article
    //     data-cy="comment"
    //     key={ index }
    // >
    //     <p>
    //         { comment.text }
    //     </p>
    //     <p>
    //         By: { comment.username }
    //     </p>
    //     <p>
    //         Date: { comment.commentDate }
    //     </p>
    // </article>
//   )


    return (
        <CommentWrapper data-cy="comment" elevation={2}>
            <AvatarWrapper>
        {comment.username.charAt(0).toUpperCase()}
      </AvatarWrapper>
            <ContentWrapper>  
        <Typography variant="h6"><b>{comment.username}</b></Typography>
        <Typography variant="body1">{comment.text}</Typography>
      </ContentWrapper>
    </CommentWrapper>
    )
}
export default Comment;