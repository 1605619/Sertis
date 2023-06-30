import React, { useState } from 'react';
import { Typography, Container, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoginSession } from "../utils/store";
import axios from "axios";
import { validateEmail, sanitizedValue } from '../utils/userHelpers';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [signupError, setSignupError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = (e) => {
    e.preventDefault();
  
    axios
      .post("http://localhost:3000/users/signup", {
        username,
        password,
      })
      .then((response) => {
        console.log("Login successful:", response?.data);
        window.localStorage.setItem("access_token", response?.data?.access_token);
        window.localStorage.setItem(
          "userinfo",
          JSON.stringify({
            id: response?.data?.user_id,
            username: response?.data?.username,
          })
        );
  
        dispatch(setLoginSession());
        navigate("/");
      })
      .catch((error) => {
        console.error("Signup failed:", error);
        setSignupError("Signup failed. Please try again.");
      });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const email = sanitizedValue(value);
    setUsername(email);
    setIsEmailValid(validateEmail(email));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const password = sanitizedValue(value);
    setPassword(password);
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSignUp}>
      <TextField
          label="Email"
          value={username}
          onChange={handleEmailChange}
          fullWidth
          margin="normal"
          error={!isEmailValid}
          helperText={!isEmailValid && "Please enter a valid email"}
        />
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        />
        {signupError && (
          <Typography
            variant="body1"
            align="center"
            style={{ marginTop: "16px", color: "red" }}
          >
            {signupError}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          margin="normal"
          style={{ marginTop: "16px" }}
        >
            Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default Signup;
