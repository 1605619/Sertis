import React from "react";
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { Link, useNavigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setLoginSession, clearLoginSession } from "../utils/store";
import { checkLoginStatus } from '../utils/userHelpers';

const Header = () => {
  const isLoggedIn = useSelector((state) => state.loginSession.isLoggedIn);
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(checkLoginStatus()) {
      dispatch(setLoginSession());
      setUsername(JSON.parse(localStorage.getItem('userinfo')).username);
    } 
    else {
      dispatch(clearLoginSession());
      setUsername('');
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userinfo');
    dispatch(clearLoginSession());
    navigate("/");
  };

  return (
    <Box className="header" width="100%">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            <img
              src="https://avatars.githubusercontent.com/u/1125424?s=200&v=4"
              alt="logo"
              style={{ height: 40, marginRight: 10 }}
            />
          </Typography>
          { isLoggedIn && (<Typography variant="body1" sx={{ marginRight: 1 }}>
              Welcome, {username}
            </Typography>)}
          <Link to="/">
            <Button color="inherit">Activity</Button>
          </Link>
          {isLoggedIn && (
            <>
            <Link to="/write">
              <Button color="inherit">Write Blog</Button>
            </Link>
            
            <Link to="/">
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Link>
            </>
          )}
          { !isLoggedIn && (<Link to="/login">
              <Button color="inherit">Login</Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
