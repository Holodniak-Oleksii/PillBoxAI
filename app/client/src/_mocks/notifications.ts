import { INotification } from "@/shared/types/entities";

export const NOTIFICATIONS_MOCK: INotification[] = [
  {
    id: "1",
    userId: "1",
    medicineId: "1",
    isRead: false,
    type: "EXPIRY",
    ts: {
      createdAt: new Date("2024-01-15T10:30:00"),
      updatedAt: new Date("2024-01-15T10:30:00"),
    },
  },
  {
    id: "2",
    userId: "1",
    medicineId: "2",
    isRead: false,
    type: "LOW_STOCK",
    ts: {
      createdAt: new Date("2024-01-16T14:20:00"),
      updatedAt: new Date("2024-01-16T14:20:00"),
    },
  },
  {
    id: "3",
    userId: "1",
    medicineId: "1",
    isRead: true,
    type: "EXPIRY",
    ts: {
      createdAt: new Date("2024-01-10T09:15:00"),
      updatedAt: new Date("2024-01-10T09:15:00"),
    },
  },
  {
    id: "4",
    userId: "1",
    medicineId: "3",
    isRead: false,
    type: "REFILL",
    ts: {
      createdAt: new Date("2024-01-17T11:45:00"),
      updatedAt: new Date("2024-01-17T11:45:00"),
    },
  },
  {
    id: "5",
    userId: "1",
    medicineId: "2",
    isRead: true,
    type: "LOW_STOCK",
    ts: {
      createdAt: new Date("2024-01-08T16:30:00"),
      updatedAt: new Date("2024-01-08T16:30:00"),
    },
  },
];
