import axios from "axios";
import { Recommendation, RestaurantResponse } from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const apiV2 = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/v2`,
})


//call to new api
export const fetchMockRestaurants = async (): Promise<RestaurantResponse> => {
  const res = await apiV2.get("/fetch-mock");
  return res.data;
};

export const fetchNearbyRestaurantsNew = async (
  lat: number,
  lon: number,
  radius = 3000
): Promise<RestaurantResponse> => {
  const res = await apiV2.post("/fetch-restaurants", { lat, lon, radius });

  return res.data;
};

export const swipeRestaurantNew = async (
  restaurantId: number,
  direction: "left" | "right"
): Promise<any> => {
  const res = await apiV2.post("/swipe", { restaurantId, direction });
  return res.data;
};

export const getRecommendationsNew = async (): Promise<Recommendation[]> => {
  const res = await apiV2.get("/recommendations");
  return res.data;
};

export const clearScoreNew = async (): Promise<{
  message: string;
  recommendations: Recommendation[];
}> => {
  const res = await apiV2.post("/clearScore");
  return res.data;
};


//call to old api
export const fetchNearbyRestaurants = async (
  lat: number,
  lon: number,
  radius = 3000
): Promise<RestaurantResponse> => {
  const res = await api.post("/restaurants", { lat, lon, radius });

  return res.data;
};

export const swipeRestaurant = async (
  restaurantId: number,
  direction: "left" | "right"
): Promise<any> => {
  const res = await api.post("/swipe", { restaurantId, direction });
  return res.data;
};

export const getRecommendations = async (): Promise<Recommendation[]> => {
  const res = await api.get("/recommendations");
  return res.data;
};

export const clearScore = async (): Promise<{
  message: string;
  recommendations: Recommendation[];
}> => {
  const res = await api.post("/clearScore");
  return res.data;
};