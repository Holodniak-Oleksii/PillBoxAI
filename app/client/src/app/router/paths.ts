export const PATHS = {
  HOME: "/",
  ACCOUNT: "/account",
  SETTINGS: "/account/settings",
  CHAT: (id: string) => `/chat?id=${id}`,
  MEDKIT: (id: string) => `/medkit/${id}`,
  NOTIFICATIONS: "/account/notifications",
  ANALYTICS: "/account/analytics",
  SUPPORT: "mailto:support@pillbox.ai",
};
