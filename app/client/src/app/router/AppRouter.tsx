import { MainLayout } from "@/app/layouts/MainLayout";
import { Home } from "@/pages/Home";
import { Medkit } from "@/pages/Medkit";
import { Profile } from "@/pages/Profile";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { PATHS } from "./paths";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path={PATHS.HOME} element={<MainLayout />}>
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.MEDKIT(":id")} element={<Medkit />} />
      </Route>
      <Route path={PATHS.PROFILE} element={<Profile />} />
      <Route path="*" element={<Navigate to={PATHS.HOME} />} />
    </Routes>
  </Router>
);

export default AppRouter;
