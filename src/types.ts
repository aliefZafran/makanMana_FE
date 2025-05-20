export interface Restaurant {
    id: number;
    name: string;
    lat: number;
    lon: number;
    tags: Record<string, string>;
    distance_km: number;
    photo?: string;
    rating: number;
    linkToLocation?: string;
  }

  export interface RestaurantResponse {
    data: Restaurant[];
    message?: string;
  }
  
  
  export interface Recommendation {
    id: number;
    name: string;
    score: number;
  }