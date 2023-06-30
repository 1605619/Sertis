import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime, checkLoginStatus } from '../utils/userHelpers';

const BlogCard = ({ blog }) => {
  const { _id, title, content, author, isAuthor, date, category, status, user_id } = blog || {};
  const { id } = JSON.parse(window.localStorage.getItem('userinfo')) || {};

  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit/${_id}`);
  };

  const handleRead = () => {
    navigate(`/view/${_id}`);
  };

  return (
    <Card
      variant="outlined"
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          By {author}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Category : {category}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Posted {formatRelativeTime(date)}
        </Typography>
        {status === 'draft' && checkLoginStatus() && user_id === id && (<Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Status : Draft
        </Typography>)}
      </CardContent>
      <CardContent sx={{ display: "flex", justifyContent: "flex-end" }}>
        {isAuthor && checkLoginStatus() && user_id === id && (
          <Button
            variant="outlined"
            size="small"
            margin="normal"
            sx={{ marginRight: 1 }}
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
        <Button variant="outlined" size="small" margin="normal" onClick={handleRead}>
          Read
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
