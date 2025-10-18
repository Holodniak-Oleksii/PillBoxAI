import { IMedkit } from "@/shared/types/entities";

export const MEDKIT_MOCK: IMedkit[] = [
  {
    id: "1",
    name: "Medkit 1",
    medicines: [],
    members: [],
    ownerID: "1",
    ts: {
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: "2",
    name: "Medkit 2",
    medicines: [],
    members: [],
    ownerID: "1",
    ts: {
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];
