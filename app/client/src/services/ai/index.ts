import { API } from "@/services";
import {
  IPillRecommendationRequest,
  IPillRecommendationResponse,
} from "@/shared/types/entities";

export const aiService = {
  getPillRecommendations: async (
    request: IPillRecommendationRequest
  ): Promise<IPillRecommendationResponse> => {
    const response = await API.post<IPillRecommendationResponse>(
      "/api/ai/pills/recommend",
      request
    );
    return response.data;
  },
};
