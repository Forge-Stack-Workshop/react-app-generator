import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { featureRoutes } from "./routes.generated";
import BaseLayout from "./BaseLayout";
import NotFound from "./NotFound";

// Hand-written base router. Feature routes are contributed at sync time via
// routes.generated.tsx and spread into the base layout's children below.
const routes: RouteObject[] = [
  {
    element: <BaseLayout />,
    children: [...featureRoutes, { path: "*", element: <NotFound /> }],
  },
];

export const router = createBrowserRouter(routes);
