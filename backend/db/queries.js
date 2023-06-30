const Blog = require('../models/blog');

// Example query to get all blogs
const getAllBlogs = async () => {
  try {
    const blogs = await Blog.find();
    return blogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error; // Throw the error to handle it in the calling function
  }
};

module.exports = {
  getAllBlogs,
};
