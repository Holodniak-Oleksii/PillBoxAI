import { PATHS } from "@/app/router/paths";
import { CiLogout } from "react-icons/ci";
import {
  IoAnalytics,
  IoChatbubbleEllipsesOutline,
  IoNotificationsOutline,
} from "react-icons/io5";

import { FiUser } from "react-icons/fi";

interface ISideBarItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  badge?: number;
  mainLink?: string;
  handleClick?: () => void;
}

export const sideBarData = (
  lg: () => void,
  badge: number
): Record<string, ISideBarItem[]> => ({
  "account.tabs.account": [
    {
      label: "account.settings",
      icon: FiUser,
      path: PATHS.SETTINGS,
    },
    {
      label: "account.notifications",
      icon: IoNotificationsOutline,
      path: PATHS.NOTIFICATIONS,
      badge,
    },
    {
      label: "account.analytics",
      icon: IoAnalytics,
      path: PATHS.ANALYTICS,
    },
  ],
  "account.tabs.general": [
    {
      label: "account.support",
      icon: IoChatbubbleEllipsesOutline,
      mainLink: PATHS.SUPPORT,
    },
    {
      label: "account.logout",
      icon: CiLogout,
      handleClick: lg,
    },
  ],
});
