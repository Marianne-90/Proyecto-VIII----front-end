import React from "react";
import {
  createBrowserRouter,
  Navigate,
  useLocation,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

import Home from "../pages/public/Home.jsx";
import Menu from "../pages/public/Menu.jsx";
import Promos from "../pages/public/Promos.jsx";
import Contacto from "../pages/public/Contacto.jsx";

import AdminLogin from "../pages/admin/Login.jsx";
import AdminInventario from "../pages/admin/Inventario.jsx";
import AdminSucursales from "../pages/admin/Sucursales.jsx";
import Usuarios from "../pages/admin/Usuarios.jsx";
import EditarUsuario from "../pages/admin/EditarUsuario.jsx";

import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/admin/inventario" replace />;
  }

  return children;
}

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

      {
        path: "inventario",
        element: (
          <ProtectedRoute roles={["admin", "staff"]}>
            <AdminInventario />
          </ProtectedRoute>
        ),
      },

      {
        path: "sucursales",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminSucursales />
          </ProtectedRoute>
        ),
      },

      {
        path: "usuarios",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <Usuarios />
          </ProtectedRoute>
        ),
      },
      {
        path: "usuarios/:id",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <EditarUsuario />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);