import { EModalKey } from "@/shared/types/enums";

export interface ITimeStamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  ts: ITimeStamp;
}

export interface IMedMember {
  userID: string;
  name: string;
  rules: string[];
}

export interface IMedicines {
  id: string;
  name: string;
  quantity: number;
  expiryDate: Date;
  ts: ITimeStamp;
}

export interface IMedkit {
  id: string;
  ownerID: string;
  name: string;
  medicines: IMedicines[];
  members: IMedMember[];
  ts: ITimeStamp;
}

export interface INotification {
  id: string;
  userId: string;
  medicineId: string;
  isRead: boolean;
  type: string;
  ts: ITimeStamp;
}

export interface IModalProps {
  id: EModalKey;
}
