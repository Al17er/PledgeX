import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/pages/layout/MainLayout";
import Index from "@/pages/index/Index";
import OperationAnalysis from "@/pages/operationAnalysis/OperationAnalysis"; // 新添加的操作解析页面
import Manage from "@/pages/manage/Manage"; // 新添加的操作解析页面

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "operation-analysis/",
        element: <OperationAnalysis />,
      },
      {
        path: "manage/:coin",
        element: <Manage />,
      },
    ],
  },
]);

export default router;
