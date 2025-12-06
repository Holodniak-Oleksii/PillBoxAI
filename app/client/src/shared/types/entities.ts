import { EModalKey } from "@/shared/types/enums";

export interface ITimeStamp {
  createdAt: Date;
  updatedAt: Date;
}

// Auth related types
export interface IUser {
  id: number;
  username: string;
  email: string;
}

export interface IAuthResponse {
  message: string;
  token: string;
  user: IUser;
}

export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export type MedkitMemberRole = "OWNER" | "EDITOR" | "VIEWER";

export interface IMedkitMemberRequest {
  userId: number; // required
  role: MedkitMemberRole; // required, enum: [OWNER, EDITOR, VIEWER]
}
export interface IMedMember {
  id: number;
  medkitId: number;
  userId: number;
  role: MedkitMemberRole;
  addedAt: string; // format: date-time
}

export interface IMedkitRequest {
  name: string;
  description?: string;
}

export interface IMedkit {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

// Pills/Medicines related types
// Matches PillRequest from OpenAPI
export interface IPillRequest {
  name: string; // required, minLength: 1, maxLength: 255
  activeSubstance?: string; // optional, maxLength: 255
  description?: string; // optional
  usageInstructions?: string; // optional
  sideEffects?: string; // optional
  contraindications?: string; // optional
  expiryDate: string; // required, format: date
  quantity: number; // required, minimum: 0
}

export interface IMedicines {
  id: number;
  medkitId: number;
  medkitName: string;
  name: string;
  activeSubstance: string;
  description: string;
  usageInstructions: string;
  sideEffects: string;
  contraindications: string;
  expiryDate: string;
  quantity: number;
  createdById: number;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
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

export interface IChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface IChatConversation {
  id: string;
  title: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
