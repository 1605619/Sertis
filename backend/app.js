const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const connectDB = require('./db/connection');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); 
  });
