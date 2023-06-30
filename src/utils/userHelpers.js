import jwt from "jsonwebtoken";
const moment = require("moment");
import xss from 'xss';

const isDisabled = (title, content) => {
  return (title.split(" ").length > 10 ||
    content.split(" ").length < 50 ||
    content.split(" ").length > 2000);
};

const sanitizedValue = (value) => {
  return xss(value);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const checkLoginStatus = () => {
  const accessToken = window.localStorage.getItem("access_token");
  const userinfo = window.localStorage.getItem("userinfo");

  if (accessToken && userinfo) {
    try {
      const decodedToken = jwt.decode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error decoding access token:", error);
      return false;
    }
  } else {
    return false;
  }
};

const isBlogBelongsToUser = (blog, user_id, blog_id) => {
  return blog.user_id === user_id && blog._id === blog_id;
};

const findBlog = (blogs, user_id, blog_id) => {
  return blogs.find((blog) => blog.user_id === user_id && blog._id === blog_id);
};

const formatRelativeTime = (date) => {
  const now = moment();
  const targetDate = moment(date);
  return targetDate.from(now);
};

const populateCategoryCounts = (filteredBlogs) => {
  const counts = {};
  filteredBlogs.forEach((blog) => {
    const category = blog.category;
    counts[category] = (counts[category] || 0) + 1;
  });

  const sortedCategories = Object.keys(counts).sort(
    (a, b) => counts[b] - counts[a]
  );

  const topCategories = sortedCategories.slice(0, 10);

  const topCategoryCounts = {};
  topCategories.forEach((category) => {
    topCategoryCounts[category] = counts[category];
  });

  return topCategoryCounts;
};



module.exports = {
  checkLoginStatus,
  isBlogBelongsToUser,
  findBlog,
  formatRelativeTime,
  populateCategoryCounts,
  validateEmail,
  sanitizedValue,
  isDisabled,
};
