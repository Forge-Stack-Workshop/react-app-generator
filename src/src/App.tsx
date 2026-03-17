import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalLoader from "./components/loaders/GlobalLoader";
import Layout from "./components/layouts/Layout";

// Lazy pages
const Monitoring = lazy(() => import("./pages/Monitoring"));
const Territories = lazy(() => import("./pages/Territories"));
const Shuttles = lazy(() => import("./pages/Shuttles"));
const NotFound = lazy(() => import("./pages/NotFound")); // à créer

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<GlobalLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Monitoring />} />
            <Route path="/territories" element={<Territories />} />
            <Route path="/shuttles" element={<Shuttles />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
