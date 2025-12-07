import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { useUserStore } from "@/app/store/user";
import {
  useAddMedkitMember,
  useMedkit,
  useMedkitMembers,
  useRemoveMedkitMember,
  useUpdateMemberRole,
} from "@/services/medkits/hooks";
import { userService } from "@/services/user";
import {
  IMedMember,
  IModalProps,
  IUser,
  MedkitMemberRole,
} from "@/shared/types/entities";
import {
  Box,
  Button,
  Dialog,
  HStack,
  Icon,
  IconButton,
  Input,
  Portal,
  Select,
  SelectPositioner,
  Spinner,
  Text,
  VStack,
  createListCollection,
} from "@chakra-ui/react";
import { create, useModal } from "@ebay/nice-modal-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuTrash2, LuUserPlus, LuX } from "react-icons/lu";

interface IManageMedkitMembersModalProps extends IModalProps {
  medkitId: number | string;
}

interface IMemberWithUser extends IMedMember {
  user?: IUser;
}

export const ManageMedkitMembersModal = create<IManageMedkitMembersModalProps>(
  ({ medkitId }) => {
    const { remove } = useModal();
    const { t } = useTranslation();
    const user = useUserStore((state) => state.user);

    const { data: medkit } = useMedkit(String(medkitId));
    const { data: members, isLoading } = useMedkitMembers(medkitId);
    const { mutateAsync: addMember } = useAddMedkitMember();
    const { mutateAsync: updateRole } = useUpdateMemberRole();
    const { mutateAsync: removeMember } = useRemoveMedkitMember();

    const [usernameSearch, setUsernameSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [selectedRole, setSelectedRole] =
      useState<MedkitMemberRole>("VIEWER");
    const [isSearching, setIsSearching] = useState(false);
    const [membersWithUsers, setMembersWithUsers] = useState<IMemberWithUser[]>(
      []
    );
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Load user information for members and include owner if not in members list
    useEffect(() => {
      const loadUserInfo = async () => {
        if (!medkit) {
          setMembersWithUsers([]);
          return;
        }

        setLoadingUsers(true);
        try {
          // Check if owner is in members list
          const ownerInMembers = members?.some(
            (member) => member.userId === medkit.ownerId
          );

          // Create a list that includes owner if not already in members
          let membersToLoad = members || [];
          if (!ownerInMembers && medkit.ownerId) {
            // Add owner as a virtual member with OWNER role
            const ownerMember: IMedMember = {
              id: -1, // Virtual ID for owner
              medkitId: medkit.id,
              userId: medkit.ownerId,
              role: "OWNER",
              addedAt: medkit.createdAt || new Date().toISOString(),
            };
            membersToLoad = [ownerMember, ...membersToLoad];
          }

          if (membersToLoad.length === 0) {
            setMembersWithUsers([]);
            setLoadingUsers(false);
            return;
          }

          const membersWithUserData = await Promise.all(
            membersToLoad.map(async (member) => {
              try {
                const userData = await userService.getUserById(member.userId);
                return { ...member, user: userData };
              } catch {
                return { ...member, user: undefined };
              }
            })
          );
          setMembersWithUsers(membersWithUserData);
        } catch {
          setMembersWithUsers(
            (members || []).map((m) => ({ ...m, user: undefined }))
          );
        } finally {
          setLoadingUsers(false);
        }
      };

      loadUserInfo();
    }, [members, medkit]);

    const handleSearchUser = useCallback(async () => {
      if (!usernameSearch.trim()) {
        return;
      }

      setIsSearching(true);
      try {
        const foundUser = await userService.getUserByUsername(
          usernameSearch.trim()
        );

        // Check if user is already a member or is the owner
        const isAlreadyMember = members?.some(
          (member) => member.userId === foundUser.id
        );
        const isOwner = medkit?.ownerId === foundUser.id;

        if (isAlreadyMember || isOwner) {
          setSelectedUser(null);
        } else if (foundUser.id === user?.id) {
          setSelectedUser(null);
        } else {
          setSelectedUser(foundUser);
        }
      } catch {
        setSelectedUser(null);
      } finally {
        setIsSearching(false);
      }
    }, [usernameSearch, members, medkit, user]);

    const handleAddMember = useCallback(async () => {
      if (!selectedUser) return;

      try {
        await addMember({
          medkitId,
          memberData: {
            userId: selectedUser.id,
            role: selectedRole,
          },
        });
        setSelectedUser(null);
        setUsernameSearch("");
        setSelectedRole("VIEWER");
      } catch (error) {
        console.error("Failed to add member:", error);
      }
    }, [selectedUser, selectedRole, medkitId, addMember]);

    const handleUpdateRole = useCallback(
      async (memberId: number, newRole: MedkitMemberRole) => {
        try {
          await updateRole({ memberId, role: newRole });
        } catch (error) {
          console.error("Failed to update role:", error);
        }
      },
      [updateRole]
    );

    const handleRemoveMember = useCallback(
      async (memberId: number) => {
        try {
          await removeMember(memberId);
        } catch (error) {
          console.error("Failed to remove member:", error);
        }
      },
      [removeMember]
    );

    const getRoleLabel = (role: MedkitMemberRole): string => {
      if (role === "OWNER") return t("modals.manageMembers.roles.owner");
      if (role === "EDITOR") return t("modals.manageMembers.roles.editor");
      if (role === "VIEWER") return t("modals.manageMembers.roles.viewer");
      return role;
    };

    const ROLE_OPTIONS = useMemo<{ value: MedkitMemberRole; label: string }[]>(
      () => [
        { value: "OWNER", label: t("modals.manageMembers.roles.owner") },
        { value: "EDITOR", label: t("modals.manageMembers.roles.editor") },
        { value: "VIEWER", label: t("modals.manageMembers.roles.viewer") },
      ],
      [t]
    );

    const roleCollection = useMemo(
      () => createListCollection({ items: ROLE_OPTIONS }),
      [ROLE_OPTIONS]
    );

    // Collections for role selection (with and without OWNER)
    const roleCollectionWithOwner = useMemo(
      () => createListCollection({ items: ROLE_OPTIONS }),
      [ROLE_OPTIONS]
    );

    const roleCollectionWithoutOwner = useMemo(
      () =>
        createListCollection({
          items: ROLE_OPTIONS.filter((opt) => opt.value !== "OWNER"),
        }),
      [ROLE_OPTIONS]
    );

    // Check if current user is owner (either from medkit.ownerId or from members list)
    const isCurrentUserOwner =
      medkit?.ownerId === user?.id ||
      members?.some((m) => m.userId === user?.id && m.role === "OWNER");
    const canManageMembers = isCurrentUserOwner;

    return (
      <ModalLayout maxWidth="600px">
        <Dialog.Header
          p={4}
          position="relative"
          borderBottomWidth={1}
          borderColor="gray.200"
        >
          <Dialog.Title fontSize="xl">
            {t("modals.manageMembers.title")}
          </Dialog.Title>
          <IconButton
            position="absolute"
            right={2}
            top={2}
            variant="ghost"
            onClick={remove}
            aria-label="Close"
          >
            <LuX />
          </IconButton>
        </Dialog.Header>

        <Dialog.Body p={4}>
          <VStack gap={4} align="stretch">
            {/* Add Member Section */}
            {canManageMembers && (
              <Box
                p={4}
                borderWidth={1}
                borderColor="gray.200"
                borderRadius="md"
              >
                <Text fontWeight="semibold" mb={3}>
                  {t("modals.manageMembers.addMember")}
                </Text>
                <VStack gap={3} align="stretch">
                  <HStack gap={2}>
                    <Input
                      placeholder={t("modals.manageMembers.searchUsername")}
                      value={usernameSearch}
                      onChange={(e) => setUsernameSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearchUser();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSearchUser}
                      loading={isSearching}
                      disabled={!usernameSearch.trim()}
                    >
                      {t("modals.manageMembers.search")}
                    </Button>
                  </HStack>

                  {selectedUser && (
                    <Box
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      borderWidth={1}
                      borderColor="gray.200"
                    >
                      <HStack justify="space-between" mb={2}>
                        <VStack align="start" gap={0}>
                          <Text fontWeight="semibold">
                            {selectedUser.username}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {selectedUser.email}
                          </Text>
                        </VStack>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUser(null);
                            setUsernameSearch("");
                          }}
                          aria-label="Clear"
                        >
                          <LuX />
                        </IconButton>
                      </HStack>
                      <HStack gap={2} mt={2}>
                        <Select.Root
                          collection={roleCollection}
                          value={[selectedRole]}
                          onValueChange={(e) =>
                            setSelectedRole(e.value[0] as MedkitMemberRole)
                          }
                          size="md"
                          flex={1}
                        >
                          <Select.Trigger>
                            <Select.ValueText />
                          </Select.Trigger>
                          <Portal>
                            <SelectPositioner>
                              <Select.Content>
                                {ROLE_OPTIONS.map((option) => (
                                  <Select.Item
                                    key={option.value}
                                    item={option.value}
                                  >
                                    {option.label}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </SelectPositioner>
                          </Portal>
                        </Select.Root>
                        <Button onClick={handleAddMember} colorPalette="blue">
                          <Icon as={LuUserPlus} mr={2} />
                          {t("modals.manageMembers.add")}
                        </Button>
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </Box>
            )}

            {/* Members List */}
            <Box>
              <Text fontWeight="semibold" mb={3}>
                {t("modals.manageMembers.membersList")} (
                {membersWithUsers.length || 0})
              </Text>
              {isLoading || loadingUsers ? (
                <Box textAlign="center" py={8}>
                  <Spinner />
                </Box>
              ) : !membersWithUsers || membersWithUsers.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={8}>
                  {t("modals.manageMembers.noMembers")}
                </Text>
              ) : (
                <VStack gap={2} align="stretch">
                  {membersWithUsers.map((member) => {
                    const isCurrentUser = member.userId === user?.id;
                    const isOwner = member.role === "OWNER";
                    // Owner cannot be edited or removed (even if it's a virtual member)
                    const isVirtualOwner = member.id === -1;
                    const canEdit =
                      canManageMembers && !isOwner && !isVirtualOwner;

                    return (
                      <Box
                        key={member.id}
                        p={3}
                        borderWidth={1}
                        borderColor="gray.200"
                        borderRadius="md"
                        bg={isCurrentUser ? "blue.50" : "white"}
                      >
                        <HStack justify="space-between">
                          <VStack align="start" gap={0} flex={1}>
                            <HStack gap={2}>
                              <Text fontWeight="semibold">
                                {member.user?.username ||
                                  `User ${member.userId}`}
                              </Text>
                              {isCurrentUser && (
                                <Text
                                  fontSize="xs"
                                  color="blue.600"
                                  bg="blue.100"
                                  px={2}
                                  py={0.5}
                                  borderRadius="full"
                                >
                                  {t("modals.manageMembers.you")}
                                </Text>
                              )}
                              {isOwner && (
                                <Text
                                  fontSize="xs"
                                  color="orange.600"
                                  bg="orange.100"
                                  px={2}
                                  py={0.5}
                                  borderRadius="full"
                                >
                                  {getRoleLabel("OWNER")}
                                </Text>
                              )}
                            </HStack>
                            {member.user?.email && (
                              <Text fontSize="sm" color="gray.600">
                                {member.user.email}
                              </Text>
                            )}
                            <Text fontSize="sm" color="gray.500">
                              {t("modals.manageMembers.addedAt")}:{" "}
                              {new Date(member.addedAt).toLocaleDateString()}
                            </Text>
                          </VStack>
                          <HStack gap={2}>
                            {canEdit && (
                              <Select.Root
                                collection={
                                  isOwner
                                    ? roleCollectionWithOwner
                                    : roleCollectionWithoutOwner
                                }
                                value={[member.role]}
                                onValueChange={(e) =>
                                  handleUpdateRole(
                                    member.id,
                                    e.value[0] as MedkitMemberRole
                                  )
                                }
                                size="sm"
                                width="120px"
                              >
                                <Select.Trigger>
                                  <Select.ValueText />
                                </Select.Trigger>
                                <SelectPositioner>
                                  <Select.Content>
                                    {ROLE_OPTIONS.filter(
                                      (opt) => opt.value !== "OWNER" || isOwner
                                    ).map((option) => (
                                      <Select.Item
                                        key={option.value}
                                        item={option.value}
                                      >
                                        {option.label}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </SelectPositioner>
                              </Select.Root>
                            )}
                            {canEdit && (
                              <IconButton
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleRemoveMember(member.id)}
                                aria-label={t("button.remove")}
                              >
                                <LuTrash2 />
                              </IconButton>
                            )}
                          </HStack>
                        </HStack>
                      </Box>
                    );
                  })}
                </VStack>
              )}
            </Box>
          </VStack>
        </Dialog.Body>

        <Dialog.Footer
          justifyContent="flex-end"
          borderTopWidth={1}
          borderColor="gray.200"
          p={4}
        >
          <Button onClick={remove}>{t("button.cancel")}</Button>
        </Dialog.Footer>
      </ModalLayout>
    );
  }
);
