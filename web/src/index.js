import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Error404 } from "./pages/404/404.jsx";
import { Home } from "./pages/home/home.jsx";
import { Login } from "./pages/login/login.jsx";
import { Register } from "./pages/register/register.jsx";
import { Tasks } from "./pages/tasks/tasks.jsx";

const verifyHasTokenAndValidPath = () =>
{
  const path = window.location.pathname;
  const pagesPrivy = ["/tasks"];
  const auth = localStorage.getItem("auth");
  const hasSession = sessionStorage.getItem("hasSession");
  sessionStorage.setItem("hasSession", true);

  if (!auth && pagesPrivy.includes(path)) window.location.replace("/");
  else if (auth && !hasSession) window.location.replace("/tasks");
}

const router = createBrowserRouter
([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error404 />,
    loader: verifyHasTokenAndValidPath(),
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error404 />,
    loader: verifyHasTokenAndValidPath(),
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <Error404 />
  },
  {
    path: "/tasks",
    element: <Tasks />,
    errorElement: <Error404 />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
