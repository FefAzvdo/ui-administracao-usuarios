import React from "react";
import ReactDOM from "react-dom/client";
import MainPage from "./pages/MainPage.tsx";
import CadsatroPage_01 from "./pages/CadastroPage_01.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import CadsatroPage_02 from "./pages/CadastroPage_02.tsx";
import CadsatroPage_03 from "./pages/CadastroPage_03.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/cadastro-01",
    element: <CadsatroPage_01 />,
  },
  {
    path: "/cadastro-02",
    element: <CadsatroPage_02 />,
  },
  {
    path: "/cadastro-03",
    element: <CadsatroPage_03 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
