import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Box } from "@mui/material";
import BlogForm from "./components/BlogForm";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BlogCard from "./components/Blog";
import BlogContainer from "./components/Blog/BlogContainer";
import LoginPage from "./components/Login";
import Error from "./components/Error";
import LoginPage from "./components/Login";
import { Provider } from "react-redux";
import store from "./utils/store";
import Signup from "./components/Signup";
import ViewBlog from "./components/Blog/ViewBlog";
import EditBlog from "./components/Blog/EditBlog";

const Component = () => {
  return (
    <Provider store={store}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <Header />
        <Outlet />
        <Footer />
      </Box>
    </Provider>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Component />,
    children: [
      {
        path: "/",
        element: <BlogContainer />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/write",
        element: <BlogForm />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/view/:blog_id",
        element: <ViewBlog />,
      },
      {
        // path: "/edit/:user_id/:blog_id",
        path: "/edit/:blog_id",
        element: <EditBlog />,
      },
    ],
    errorElement: <Error />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter} />);
