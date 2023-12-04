import React from "react";
import ReactDOM from "react-dom/client";
import MainPage from "./pages/MainPage.tsx";
import CadsatroPage_01 from "./pages/CadastroPage_01.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import CadsatroPage_02 from "./pages/CadastroPage_02.tsx";
import CadsatroPage_03 from "./pages/CadastroPage_03.tsx";
import ColaboradoresPage from "./pages/ColaboradoresPage.tsx";
import PedidosPage_NovoPedido from "./pages/PedidosPage_NovoPedido.tsx";
import PedidosPage_VerPedidos from "./pages/PedidosPage_VerPedidos.tsx";
import PedidosPage_NovoPedido_Entrega from "./pages/PedidosPage_NovoPedido_Entrega.tsx";

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
  {
    path: "/colaboradores",
    element: <ColaboradoresPage />,
  },
  {
    path: "/ver-pedidos",
    element: <PedidosPage_VerPedidos />,
  },
  {
    path: "/novo-pedido",
    element: <PedidosPage_NovoPedido />,
  },
  {
    path: "/novo-pedido/entrega",
    element: <PedidosPage_NovoPedido_Entrega />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
