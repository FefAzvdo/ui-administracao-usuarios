import React from "react";
import ReactDOM from "react-dom/client";
import MainPage from "./pages/MainPage.tsx";
import CadsatroPage_01 from "./pages/CadastroPage_01.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/cadastro-01",
    element: <CadsatroPage_01 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
