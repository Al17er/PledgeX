import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/pages/layout/MainLayout";
import Index from "@/pages/index/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Index />,
      }
    ],
  },
]);

export default router;
