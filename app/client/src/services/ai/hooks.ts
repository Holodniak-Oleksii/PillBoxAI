import { aiService } from "@/services/ai";
import {
  IIdentifiedPill,
  IPillRecommendationRequest,
} from "@/shared/types/entities";
import { useMutation } from "@tanstack/react-query";

export const usePillRecommendations = () => {
  return useMutation({
    mutationFn: (request: IPillRecommendationRequest) =>
      aiService.getPillRecommendations(request),
  });
};

export const useIdentifyPills = () => {
  return useMutation({
    mutationFn: ({
      images,
      language = "en",
    }: {
      images: File[];
      language?: string;
    }): Promise<IIdentifiedPill[]> => aiService.identifyPills(images, language),
  });
};
