import { API } from "@/services";
import {
  IIdentifiedPill,
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

  identifyPills: async (
    images: File[],
    language: string = "en"
  ): Promise<IIdentifiedPill[]> => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("language", language);

    const response = await API.post<IIdentifiedPill[]>(
      "/api/ai/pills/identify",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
