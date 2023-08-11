import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";

const Navbar = () => {
  const isAuthenticated = !!window.localStorage.getItem("token");

  const handleClick = () => {
    window.localStorage.removeItem("token");
    window.location.reload(); 
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Acebook Fire
        </Typography>
        <Button color="inherit" component={Link} to="/posts">
          Feed

        </Button>
        
        { isAuthenticated ? (
          <>
          <Button color="inherit" component={Link} to="/profile">
           Profile
         </Button>
          <Button onClick={handleClick} color="inherit" component={Link} to="/login">
            Logout
          </Button>
         </>
        ) : (
          <>
          <Button color="inherit" component={Link} to="/signup">
            Signup
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          </>
        )}

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

