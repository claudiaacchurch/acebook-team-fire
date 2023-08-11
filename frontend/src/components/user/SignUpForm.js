import React, { useState, useRef } from 'react';
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const SignUpForm = ({ navigate }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isBtnDisabled, setButtonDisabled] = useState(true);
  const buttonRef = useRef();

  const setTokens = async () => {
    let response = await fetch( '/api/tokens', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password })
    })

    if(response.status !== 201) {
      navigate('/login')
    } else {
      let data = await response.json()
      window.localStorage.setItem("token", data.token)
      navigate('/posts');
    }
  }

  const checkValues = () => {
    if (!email || !password || !username) {
      setButtonDisabled(true)
    } else {
      setButtonDisabled(false);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    fetch( '/api/users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password, username: username, profilePic: profilePic})
    })
      .then(async response => {
        if (response.status === 201) {
          await setTokens();
        } else {
          navigate('/signup')
        }
      })
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
    checkValues();
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    checkValues();
  }


  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    checkValues();
  }

  const handleProfilePicChange = (event) => {
    setProfilePic(event.target.value)
  }


    // return (
    //   <form onSubmit={handleSubmit}>
    //       <input placeholder="Email" id="email" type='text' value={ email } onChange={handleEmailChange} />
    //       <input placeholder="Password" id="password" type='password' value={ password } onChange={handlePasswordChange} />
    //       <input placeholder="Username" id="username" type='text' value={ username } onChange={handleUsernameChange} />
    //       <input placeholder="profilePic" id="profilePic" type='text' value={ profilePic } onChange={handleProfilePicChange} />
    //       <input id='submit' type="submit" value="Submit" />
    //   </form>
    // );
  
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Avatar>
                <LockOutlinedIcon />
              </Avatar>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" align="center">
                Sign Up
              </Typography>
            </Grid>
          </Grid>
          <form>
            <TextField
              onChange={handleEmailChange}
              label="Email"
              id="email"
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              onChange={handleUsernameChange}
              label="Username"
              id="username"
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              onChange={handlePasswordChange}
              label="Password"
              type="password"
              variant="outlined"
              id="password"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              onChange={handleProfilePicChange}
              label="Profile Picture URL"
              variant="outlined"
              id="profilePic"
              fullWidth
              margin="normal"
            />
            <Button
              disabled={isBtnDisabled}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 20 }}
              onClick={handleSubmit}
              id="submit"
            >
              Sign Up
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default SignUpForm;
