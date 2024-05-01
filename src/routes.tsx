import { Outlet, createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Login from "@/pages/Login";
import RandomQuestions from "@/pages/Random";
import AdminLayout from "./layouts/AdminLayout";
import AdminSubject from "./components/admin/Subject";
import AdminQuestionsPage from "./pages/Admin/Questions";

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
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "subjects",
        element: <AdminSubject />,
      },
      {
        path: "questions",
        element: <AdminQuestionsPage />,
      },
    ],
  },
]);
