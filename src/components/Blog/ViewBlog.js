import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { formatRelativeTime, checkLoginStatus } from "../../utils/userHelpers";
import { Card, CardContent, ButtonGroup, Button, Box, Typography } from "@mui/material";

const ViewBlog = () => {
  const isLoggedIn = useSelector((state) => state.loginSession.isLoggedIn);
  const [blog, setBlog] = useState({
    title: '',
    category: '',
    content: '',
    date: '',
    author: '',
  });
  const [canEdit, setEdit] = useState(false);

  const navigate = useNavigate();

  const { blog_id } = useParams() || {};
  const { id } = JSON.parse(localStorage.getItem('userinfo')) || {};

  useEffect(() => {
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
        setBlog({
          title: blog?.title,
          category: blog?.category,
          content: blog?.content,
          author: blog?.author,
          date: formatRelativeTime(blog?.date),
        });

        setEdit(checkLoginStatus() && id == blog?.user_id);
      })
      .catch((error) => {
        console.error("Error retrieving blog:", error);
        navigate("/");
      });
  }, [isLoggedIn, canEdit]);

  const handleEdit = () => {
    navigate(`/edit/${blog_id}`);
  };

  return (
    <form>
      <Card style={{ width: "100%", maxWidth: "100%" }}>
        <CardContent>
          <Typography
            variant="h4"
            component="div"
            style={{ fontWeight: "bold", fontSize: "24px" }}
          >
            {blog.title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            style={{ fontSize: "16px", marginTop: "10px" }}
          >
            {blog.author}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            style={{ fontSize: "14px" }}
          >
            Posted {blog.date}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ fontSize: "18px", marginTop: "20px" }}
          >
            {blog.content}
          </Typography>
        </CardContent>
      </Card>
      {isLoggedIn && canEdit && (
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
            <Button onClick={handleEdit}>Edit</Button>
          </ButtonGroup>
        </Box>
      )}
    </form>
  );
};

export default ViewBlog;
