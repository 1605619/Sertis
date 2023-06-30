import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Box, TextField, ButtonGroup, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {
  checkLoginStatus,
  sanitizedValue,
  isDisabled,
} from "../../utils/userHelpers";
import { clearLoginSession } from "../../utils/store";
import { categoryList } from '../../utils/contants';

const EditBlog = (props) => {
  const isLoggedIn = useSelector((state) => state.loginSession.isLoggedIn);
  const [blog, setBlog] = useState({
    _id: '',
    user_id: '',
    title: '',
    content: '',
    category: '',
    author: '',
    date: '',
    status: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blog_id } = useParams();
  
  useEffect(() => {
    if (!checkLoginStatus()) {
      dispatch(clearLoginSession());
      navigate("/login");
    }

    fetch(`http://localhost:3000/blogs/${blog_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }
        return response.json();
      })
      .then((blog) => {
        const { id } = JSON.parse(localStorage.getItem('userinfo')) || {};
        if(blog.user_id != id) {
          setBlog({ _id: '',
          user_id: '',
          title: '',
          content: '',
          category: '',
          author: '',
          date: '',
          status: '',});
          navigate("/");
        }
        setBlog((prevBlog) => ({
          ...prevBlog,
          _id: blog._id,
          user_id: blog.user_id,
          title: blog.title,
          content: blog.content,
          category: blog.category,
          author: blog.author,
          date: blog.date,
          status: blog.status,
        }));
      })
      .catch((error) => {
        console.error("Error retrieving blog:", error);
        navigate("/");
      });
  }, [isLoggedIn]);

  const handleTitleChange = (event) => {
    const value = event.target.value;
    const sanitized = sanitizedValue(value);
    const words = sanitized.split(" ");
    if (words.length <= 10) {
      setBlog((prevBlog) => ({
        ...prevBlog,
        title: sanitized,
      }));
    }
  };

  const handleContentChange = (event) => {
    const value = event.target.value;
    const sanitized = sanitizedValue(value);
    const words = sanitized.split(" ");
    if (words.length <= 2000) {
      setBlog((prevBlog) => ({
        ...prevBlog,
        content: sanitized,
      }));
    }
  };

  const handleCategoryChange = (event) => {
    setBlog((prevBlog) => ({
      ...prevBlog,
      category: event.target.value,
    }));
  };

  const handleSave = (event) => {
    const buttonType = event.target.textContent;
    const status = buttonType === "Publish" ? "published" : "draft";

    const body = {
      title: blog.title,
      content: blog.content,
      category: blog.category,
      status: status,
    };
    fetch(`http://localhost:3000/blogs/${blog_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update blog");
        }
        return response.json();
      })
      .then((updatedBlog) => {
        setBlog({ _id: '',
        user_id: '',
        title: '',
        content: '',
        category: '',
        author: '',
        date: '',
        status: '',});
        navigate("/");
      })
      .catch((error) => {
        console.error("Error updating blog:", error);
      });
  };

  const handleDelete = () => {
    fetch(`http://localhost:3000/blogs/${blog_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete blog");
        }
        console.log("Blog deleted successfully");
        setBlog({ _id: '',
        user_id: '',
        title: '',
        content: '',
        category: '',
        author: '',
        date: '',
        status: '',});
        navigate("/");
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
      });
  };

  return (
    <form>
      <Typography variant="h4" align="center" gutterBottom>
        Edit a blog
      </Typography>
      <TextField
        id="blog-title"
        label="Title"
        fullWidth
        value={blog.title}
        onChange={handleTitleChange}
        margin="normal"
        error={blog.title.split(" ").length > 10}
        helperText={
          blog.title.split(" ").length > 10
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
        value={blog.content}
        onChange={handleContentChange}
        margin="normal"
        error={
          blog.content.split(" ").length < 50 || blog.content.split(" ").length > 2000
        }
        helperText={
          blog.content.split(" ").length < 50
            ? "Content should be more than 50 words"
            : blog.content.split(" ").length > 2000
            ? "Content should be less than 2000 words"
            : ""
        }
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="blog-category-label">Category</InputLabel>
        <Select
          labelId="blog-category-label"
          id="blog-category"
          value={blog.category}
          onChange={handleCategoryChange}
        >
          {categoryList.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        id="blog-status"
        label="Status"
        fullWidth
        value={blog.status}
        margin="normal"
        disabled
      />
      <TextField
        id="blog-author"
        label="author"
        fullWidth
        value={blog.author}
        margin="normal"
        disabled
      />
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
          <Button onClick={handleSave} disabled={isDisabled(blog.title, blog.content)}>
            Publish
          </Button>
          <Button onClick={handleSave} disabled={isDisabled(blog.title, blog.content)}>
            Save as draft
          </Button>
          <Button onClick={handleDelete}>Delete</Button>
        </ButtonGroup>
      </Box>
    </form>
  );
};

export default EditBlog;
