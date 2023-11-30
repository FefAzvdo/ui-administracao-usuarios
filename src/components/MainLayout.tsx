import { useLocation } from "react-router-dom";
import billingpayLogo from "../assets/bp_logo.png";
import usuarioPlaceholder from "../assets/usuario-placeholder.jpg";
import { Avatar, Dropdown, Navbar } from "flowbite-react";

import "./index.css";

const menuItems = [
  { title: "Colaboradores", path: "/colaboradores" },
  { title: "Pedidos", path: "/pedidos" },
  { title: "Importações", path: "/importacoes" },
];

export default function MainLayout({
  pageTitle,
  children,
}: {
  pageTitle: string;
  children: React.ReactNode;
}) {
  const location = useLocation();

  return (
    <>
      <div className="flex justify-between items-center w-full h-auto p-8 bg-black">
        <Navbar
          fluid
          rounded
          className="w-full bg-transparent"
          id="navbar-component"
        >
          <Navbar.Brand>
            <img
              src={billingpayLogo}
              className="mr-3 h-6 sm:h-9"
              alt="Billingpay Logo"
            />
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse>
            {menuItems.map((item) => (
              <Navbar.Link
                key={item.path}
                href={item.path}
                active={item.path === location.pathname}
                id="navbar-link"
                className="text-base"
              >
                {item.title}
              </Navbar.Link>
            ))}
            <Dropdown
              arrowIcon={false}
              inline
              label={
                window.innerWidth < 768 ? (
                  <Navbar.Link>Minha conta</Navbar.Link>
                ) : (
                  <Avatar
                    alt="Configurações de usuário"
                    img={usuarioPlaceholder}
                    rounded
                  />
                )
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">Empresa teste</span>
                <span className="block truncate text-sm font-medium">
                  empresateste@gmail.com
                </span>
              </Dropdown.Header>
              <Dropdown.Item>Ver perfil</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-red-500">Sair</Dropdown.Item>
            </Dropdown>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <div className="flex justify-center py-2">
        <div className="max-w-screen-xl w-full md:p-4">
          <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
            {pageTitle}
          </h1>
          {children}
        </div>
      </div>
    </>
  );
}
