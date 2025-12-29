import { type JSX } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BookmarkDetails from "./components/BookmarkDetails";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import LikedPosts from "./pages/LikedPosts";
import Login from "./pages/Login";
import PostDetails from "./pages/PostDetails";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import UserBookmarks from "./pages/UserBookmarks";
import UserPosts from "./pages/UserPosts";

type AppProps = {};

const App = ({}: AppProps) => {
  const routes: {
    path: string;
    element: JSX.Element;
  }[] = [
    { path: "/", element: <Home /> },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "users/:userId/posts",
      element: <UserPosts />,
    },
    {
      path: "posts/:postId",
      element: <PostDetails />,
    },
    {
      path: "users/:userId/liked-posts",
      element: <LikedPosts />,
    },
    {
      path: "users/:userId/bookmarks",
      element: <UserBookmarks />,
    },
    {
      path: "users/:userId/bookmarks/:bookmarkId",
      element: <BookmarkDetails />,
    },
  ];

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        pauseOnHover
        theme="colored"
      />
      <Header />
      <main className="min-h-screen mt-20">
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
