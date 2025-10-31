// import { useState } from 'react'
// import './App.css'
// import LandingPage from './pages/LandingPage'
// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//     <LandingPage/>
//     </>
//   )
// }

// export default App

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
