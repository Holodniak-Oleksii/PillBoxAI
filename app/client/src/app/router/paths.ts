export const PATHS = {
  HOME: "/",
  PROFILE: "/profile",
  CHAT: (id: string) => `/chat?id=${id}`,
  MEDKIT: (id: string) => `/medkit/${id}`,
};
