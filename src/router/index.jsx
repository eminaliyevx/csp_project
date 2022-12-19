import { createBrowserRouter } from "react-router-dom";
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
]);

export default router;
