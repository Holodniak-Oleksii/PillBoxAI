import { IMedMember, MedkitMemberRole } from "@/shared/types/entities";

export const hasRole = (
  member: IMedMember | undefined,
  role: MedkitMemberRole
): boolean => {
  if (!member) return false;
  return member.role === role;
};

export const isOwner = (member: IMedMember | undefined): boolean => {
  return hasRole(member, "OWNER");
};

export const canEdit = (member: IMedMember | undefined): boolean => {
  if (!member) return false;
  return member.role === "OWNER" || member.role === "EDITOR";
};

export const canView = (member: IMedMember | undefined): boolean => {
  return !!member;
};

export const canManageMembers = (member: IMedMember | undefined): boolean => {
  return isOwner(member);
};

export const canDelete = (member: IMedMember | undefined): boolean => {
  return isOwner(member);
};

export const getUserRole = (
  members: IMedMember[] | undefined,
  userId: number | undefined
): IMedMember | undefined => {
  if (!members || !userId) return undefined;
  return members.find((member) => member.userId === userId);
};
