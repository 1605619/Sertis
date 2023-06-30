import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  TextField,
  ButtonGroup,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  checkLoginStatus,
  sanitizedValue,
  isDisabled,
} from "../utils/userHelpers";
import { clearLoginSession } from "../utils/store";
import { categoryList } from "../utils/contants";

const BlogForm = (props) => {
  const isLoggedIn = useSelector((state) => state.loginSession.isLoggedIn);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!checkLoginStatus()) {
      dispatch(clearLoginSession());
      navigate("/login");
    }
  }, [isLoggedIn]);

  const handleTitleChange = (event) => {
    const value = event.target.value;
    const sanitized = sanitizedValue(value);
    const words = sanitized.split(" ");
    if (words.length <= 10) {
      setTitle(sanitized);
    }
  };

  const handleContentChange = (event) => {
    const value = event.target.value;
    const sanitized = sanitizedValue(value);
    const words = sanitized.split(" ");
    if (words.length <= 2000) {
      setContent(sanitized);
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSave = (event) => {
    const buttonType = event.target.textContent;
    const status = buttonType === "Publish" ? "published" : "draft";

    const { id, username } = JSON.parse(localStorage.getItem("userinfo")) || {};

    const data = {
      title,
      content,
      category,
      status,
      user_id: id,
      author: username,
      date: new Date().toISOString(),
    };

    fetch("http://localhost:3000/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((savedData) => {
        console.log("Data saved:", savedData);

        setTitle("");
        setContent("");
        setCategory("");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  return (
    <form>
      <Typography variant="h4" align="center" gutterBottom>
        Write a blog
      </Typography>
      <TextField
        id="blog-title"
        label="Title"
        fullWidth
        value={title}
        onChange={handleTitleChange}
        margin="normal"
        error={title.split(" ").length > 10}
        helperText={
          title.split(" ").length > 10
            ? "Title should be less than 10 words"
            : ""
        }
      />
      <TextField
        id="blog-content"
        label="Write your blog"
        multiline
        rows={10}
        fullWidth
        value={content}
        onChange={handleContentChange}
        margin="normal"
        error={
          content.split(" ").length < 50 || content.split(" ").length > 2000
        }
        helperText={
          content.split(" ").length < 50
            ? "Content should be more than 50 words"
            : content.split(" ").length > 2000
            ? "Content should be less than 2000 words"
            : ""
        }
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="blog-category-label">Category</InputLabel>
        <Select
          labelId="blog-category-label"
          id="blog-category"
          value={category}
          onChange={handleCategoryChange}
        >
          {categoryList.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        display="flex"
        justifyContent="flex-end"
        marginTop={2}
        marginBottom={2}
      >
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button onClick={handleSave} disabled={isDisabled(title, content)}>
            Publish
          </Button>
          <Button onClick={handleSave} disabled={isDisabled(title, content)}>
            Save as Draft
          </Button>
        </ButtonGroup>
      </Box>
    </form>
  );
};

export default BlogForm;
