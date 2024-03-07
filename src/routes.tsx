import { Outlet, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import RandomQuestions from "./pages/Random";

export const routes = createBrowserRouter([
  {
    path: "",
    element: <Outlet />,
    children: [
      { index: true, element: <App /> },
      { path: "random", element: <RandomQuestions /> },
    ],
  },
  { path: "login", element: <Login /> },
]);
