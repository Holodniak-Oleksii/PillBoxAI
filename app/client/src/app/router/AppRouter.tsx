import { AccountLayout } from "@/app/layouts/AccountLayout";
import { MainLayout } from "@/app/layouts/MainLayout";
import { Analytics } from "@/pages/Analytics";
import { Home } from "@/pages/Home";
import { Medkit } from "@/pages/Medkit";
import { Notifications } from "@/pages/Notifications";
import { Settings } from "@/pages/Settings";
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
      <Route path={PATHS.ACCOUNT} element={<AccountLayout />}>
        <Route path={PATHS.SETTINGS} element={<Settings />} />
        <Route path={PATHS.NOTIFICATIONS} element={<Notifications />} />
        <Route path={PATHS.ANALYTICS} element={<Analytics />} />
      </Route>
      <Route path="*" element={<Navigate to={PATHS.HOME} />} />
    </Routes>
  </Router>
);

export default AppRouter;
