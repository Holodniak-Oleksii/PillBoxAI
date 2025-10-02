import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "../../pages/Home/Home";
import { MainLayout } from "../layouts/MainLayout";
import { PATHS } from "./paths";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path={PATHS.HOME} element={<MainLayout />}>
        <Route path={PATHS.HOME} element={<Home />} />
      </Route>
      <Route path="*" element={<div>404</div>} />
    </Routes>
  </Router>
);

export default AppRouter;
