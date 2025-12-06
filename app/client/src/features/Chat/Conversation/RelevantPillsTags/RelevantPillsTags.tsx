import { PATHS } from "@/app/router/paths";
import { IRelevantPill } from "@/shared/types/entities";
import { Box, HStack, Link, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface IRelevantPillsTagsProps {
  pills: IRelevantPill[];
}

export const RelevantPillsTags: FC<IRelevantPillsTagsProps> = ({ pills }) => {
  const navigate = useNavigate();

  if (!pills || pills.length === 0) {
    return null;
  }

  return (
    <Box mt={3} pt={3} borderTop="1px solid" borderColor="gray.200">
      <HStack gap={2} flexWrap="wrap">
        {pills.map((pill) => (
          <Link
            key={pill.id}
            onClick={() => navigate(PATHS.MEDICINE(pill.medkit_id, pill.id))}
            _hover={{ textDecoration: "none" }}
          >
            <Box
              as="span"
              display="inline-flex"
              alignItems="center"
              gap={1}
              px={3}
              py={1}
              bg="blue.50"
              color="blue.700"
              borderRadius="full"
              fontSize="xs"
              fontWeight="medium"
              border="1px solid"
              borderColor="blue.200"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                bg: "blue.100",
                borderColor: "blue.300",
                transform: "translateY(-1px)",
              }}
            >
              <Text as="span" fontWeight="semibold">
                {pill.name}
              </Text>
              {pill.similarity_score > 0 && (
                <Text as="span" color="blue.500" fontSize="2xs">
                  {Math.round(pill.similarity_score * 100)}%
                </Text>
              )}
            </Box>
          </Link>
        ))}
      </HStack>
    </Box>
  );
};
