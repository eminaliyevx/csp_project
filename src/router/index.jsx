import { createBrowserRouter, Navigate } from "react-router-dom";
import { MapColoring, Root, Sudoku } from "../routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { element: <Sudoku />, index: true },
      { path: "map-coloring", element: <MapColoring /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default router;
