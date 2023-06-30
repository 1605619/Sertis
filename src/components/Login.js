import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoginSession } from "../utils/store";
import { validateEmail, sanitizedValue } from '../utils/userHelpers';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/users/login", {
        username,
        password,
      })
      .then((response) => {
        window.localStorage.setItem(
          "access_token",
          response?.data?.access_token
        );
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
        console.error("Login failed:", error);
        setLoginError("Login failed. Please try again.");
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
        Login
      </Typography>
      <form onSubmit={handleLogin}>
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
        {loginError && (
          <Typography
            variant="body1"
            align="center"
            style={{ marginTop: "16px", color: "red" }}
          >
            {loginError}
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
          Login
        </Button>
      </form>
      <Link to="/signup" style={{ textDecoration: "none", color: "inherit" }}>
        <Typography
          variant="body1"
          align="center"
          style={{ marginTop: "16px", color: "#0000FF", cursor: "pointer" }}
        >
          Create an Account
        </Typography>
      </Link>
    </Container>
  );
};

export default LoginPage;
