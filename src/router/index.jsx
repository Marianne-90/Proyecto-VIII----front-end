import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

import Home from "../pages/public/Home.jsx";
import Menu from "../pages/public/Menu.jsx";
import Promos from "../pages/public/Promos.jsx";
import Contacto from "../pages/public/Contacto.jsx";

import AdminLogin from "../pages/admin/Login.jsx";
import AdminInventario from "../pages/admin/Inventario.jsx";
import AdminSucursales from "../pages/admin/Sucursales.jsx";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/menu", element: <Menu /> },
      { path: "/promos", element: <Promos /> },
      { path: "/contacto", element: <Contacto /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/login" replace /> },
      { path: "login", element: <AdminLogin /> },
      { path: "inventario", element: <AdminInventario /> },
      { path: "sucursales", element: <AdminSucursales /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);