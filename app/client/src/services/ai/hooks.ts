import { aiService } from "@/services/ai";
import { IPillRecommendationRequest } from "@/shared/types/entities";
import { useMutation } from "@tanstack/react-query";

export const usePillRecommendations = () => {
  return useMutation({
    mutationFn: (request: IPillRecommendationRequest) =>
      aiService.getPillRecommendations(request),
  });
};
