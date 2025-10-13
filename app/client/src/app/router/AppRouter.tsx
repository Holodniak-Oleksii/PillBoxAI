import { MainLayout } from "@/app/layouts/MainLayout/MainLayout";
import { Home } from "@/pages/Home/Home";
import { Profile } from "@/pages/Profile/Profile";
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
      </Route>
      <Route path={PATHS.PROFILE} element={<Profile />} />
      <Route path="*" element={<Navigate to={PATHS.HOME} />} />
    </Routes>
  </Router>
);

export default AppRouter;
