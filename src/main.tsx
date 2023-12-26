import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import HomeRoute from "./routes/home/HomeRoute.tsx";
import AnalyzerRoute from "./routes/analyzer/AnalyzerRoute.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeRoute />,
    },
    {
        path: "/analyzer",
        element: <AnalyzerRoute />,
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
