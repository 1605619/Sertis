require('../db/connection');
const Blog = require('../models/Blog');

const getAllBlogs = (req, res) => {
  Blog.find()
    .sort({ date: -1 })
    .then((blogs) => {
      res.json(blogs);
    })
    .catch((error) => {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ error: "Failed to fetch blogs" });
    });
};

const getBlogById = (req, res) => {
  const blogId = req.params.id;

  Blog.findById(blogId)
    .then((blog) => {
      if (blog) {
        res.json(blog);
      } else {
        res.status(404).json({ error: "Blog not found" });
      }
    })
    .catch((error) => {
      console.error("Error fetching blog:", error);
      res.status(500).json({ error: "Internal server error" });
    });
};

const createBlog = (req, res) => {
  const { user_id, title, content, category, author, date, status } = req.body;

  if (!user_id || !title || !content || !category || !author || !date || !status) {
    return res.status(422).json({ error: "Required field(s) missing" });
  }

  const newBlog = new Blog({
    user_id,
    title,
    content,
    category,
    author,
    date,
    status
  });

  newBlog.save()
    .then((blog) => {
      res.status(201).json(blog);
    })
    .catch((error) => {
      console.error("Error creating blog:", error);
      res.status(500).json({ error: "Failed to create blog" });
    });
};


const updateBlog = async (req, res) => {
  const blogId = req.params.id;
  const { title, content, category, status } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        content,
        category,
        status,
        date: new Date().toISOString(),
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ error: "Failed to update blog" });
  }
};



const deleteBlog = (req, res) => {
  const blogId = req.params.id;

  Blog.findByIdAndDelete(blogId)
    .then((deletedBlog) => {
      if (deletedBlog) {
        res.json({ message: "Blog deleted successfully" });
      } else {
        res.status(404).json({ error: "Blog not found" });
      }
    })
    .catch((error) => {
      console.error("Error deleting blog:", error);
      res.status(500).json({ error: "Failed to delete blog" });
    });
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
