import React, { useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const LogInForm = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let response = await fetch("/api/tokens", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    if (response.status !== 201) {
      navigate("/login");
    } else {
      let data = await response.json();
      window.localStorage.setItem("token", data.token);
      navigate("/posts");
    }
  };

  const checkValues = () => {
    if (!email || !password) setIsDisabled(true);
    else setIsDisabled(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    checkValues();
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    checkValues();
  };

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
                Log In
              </Typography>
            </Grid>
          </Grid>
          <form>
            <TextField
              onChange={handleEmailChange}
              label="Email"
              variant="outlined"
              fullWidth
              id="email"
              margin="normal"
              required
            />
            <TextField
              onChange={handlePasswordChange}
              label="Password"
              type="password"
              id="password"
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <Button
              onClick={handleSubmit}
              type="submit"
              disabled={isDisabled}
              variant="contained"
              color="primary"
              fullWidth
              id="submit"
              style={{ marginTop: 20 }}
            >
              Log In
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LogInForm;
