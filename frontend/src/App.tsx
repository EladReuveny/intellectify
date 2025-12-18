import type { JSX } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

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
  ];

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        pauseOnHover
        theme="dark"
      />
      <Header />
      <main className="min-h-screen">
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
