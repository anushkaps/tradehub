export interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Professional {
  id: string;
  name: string;
  trade: string;
  rating: number;
  reviews: number;
  image: string;
}