import React from "react";
import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout.jsx";

import Home from "../pages/public/Home.jsx";
import Especialidades from "../pages/public/Especialidades.jsx";
import Contacto from "../pages/public/Contacto.jsx";


import Carta from "../pages/public/Carta.jsx";
import Reservar from "../pages/public/Reservar.jsx";


export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/carta", element: <Carta /> },
      { path: "/especialidades", element: <Especialidades /> },
      { path: "/reservar", element: <Reservar /> },
      { path: "/contacto", element: <Contacto /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);