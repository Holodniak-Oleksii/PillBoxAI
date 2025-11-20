export const PATHS = {
  HOME: "/",
  ACCOUNT: "/account",
  SETTINGS: "/account/settings",
  CHAT: (id: string) => `/chat?id=${id}`,
  MEDKIT: (id: string | number) => `/medkit/${id}`,
  MEDICINE: (medkitId: string, medicineId: string) =>
    `/medkit/${medkitId}/${medicineId}`,
  NOTIFICATIONS: "/account/notifications",
  ANALYTICS: "/account/analytics",
  SUPPORT: "mailto:support@pillbox.ai",
};
