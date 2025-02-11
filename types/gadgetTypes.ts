export interface GadgetResponse {
  id: number;
  name: string;
  model: string;
  purchaseDate: string;
  cost: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
