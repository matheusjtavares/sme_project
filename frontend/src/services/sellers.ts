import api from "@/api/client";
import type { Seller } from "@/types/sellers";

export function listSellers(): Promise<Seller[]> {
  return api.get<Seller[]>("/sellers/").then((response) => response.data);
}