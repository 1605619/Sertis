import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Pagination, TextField, Grid, Container, Chip } from "@mui/material";
import BlogCard from "../Blog";
import { populateCategoryCounts } from "../../utils/userHelpers";

const BlogContainer = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState([]);
  const isLoggedIn = useSelector((state) => state.loginSession.isLoggedIn);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20);

  const [selectedCategories, setSelectedCategories] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const loggedinUser = JSON.parse(localStorage.getItem("userinfo")) || {};

  const addEditOption = (blogs) => {
    if (loggedinUser) {
      const updatedBlogs = blogs.map((blog) => {
        if (blog.user_id === loggedinUser.id) {
          return { ...blog, isAuthor: true };
        } else {
          return { ...blog, isAuthor: false };
        }
      });

      setBlogs(updatedBlogs);
    } else {
      setBlogs(blogs);
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/blogs/")
      .then((response) => response.json())
      .then((data) => {
        addEditOption(data);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });
  }, [isLoggedIn]);

  //if user not logged in then it won't get isAuthor therefor it should be false, as we won't know if user can edit any post or not
  //if user on myblogs page, then all filters blogs, and all has edit button
  //edit button takes to edit page, which is different from BlogForm page, as here we have update query not create and we need to pass that blog id to props

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  let filteredBlogs = blogs.filter((blog) => {
    const blogTitle = blog.title.toLowerCase();
    const blogAuthor = blog.author.toLowerCase();
    const blogCategory = blog.category.toLowerCase();
    const blogDate = blog.date.toLowerCase();

    const searchQueryLower = searchQuery.toLowerCase();

    myDraft = isClicked ? blog.user_id === loggedinUser.id && blog.status === 'draft' : !(blog.status === 'draft' && blog.user_id != loggedinUser.id) || blog.status === 'published';

    return (
      (blogTitle.includes(searchQueryLower) ||
      blogAuthor.includes(searchQueryLower) ||
      blogDate.includes(searchQueryLower) ||
      blogCategory.includes(searchQueryLower)) &&
      myDraft 
    );
  });

  window.localStorage.setItem("blogs", JSON.stringify(filteredBlogs));

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleCategoryToggle = (category) => {
    if (searchQuery === category) setSearchQuery("");
    else setSearchQuery(category);
  };

  const categoryCounts = populateCategoryCounts(filteredBlogs);

  const handleChipClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <>
      <Container maxWidth="lg" margin="normal">
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          margin="normal"
        />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            {isLoggedIn && (
              <Chip
                label="My Drafts"
                color={isClicked ? "primary" : "default"}
                onClick={handleChipClick}
                style={{ marginRight: 10 }}
                sx={{
                  mr: 1,
                  mb: 1,
                }}
              />
            )}
            {Object.entries(categoryCounts).map(([category, count]) => (
              <Chip
                key={category}
                label={`${category} (${count || 0})`}
                variant={
                  selectedCategories.includes(category) ? "filled" : "outlined"
                }
                onClick={() => handleCategoryToggle(category)}
                sx={{
                  mr: 1,
                  mb: 1,
                  color: selectedCategories.includes(category)
                    ? "white"
                    : "primary",
                  borderColor: "grey",
                  bgcolor: selectedCategories.includes(category)
                    ? "grey"
                    : "transparent",
                }}
              />
            ))}
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {currentPosts.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <BlogCard blog={blog} />
            </Grid>
          ))}
        </Grid>

        <Pagination
          count={Math.ceil(filteredBlogs.length / postsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "4rem",
          }}
        />
      </Container>
    </>
  );
};

export default BlogContainer;
