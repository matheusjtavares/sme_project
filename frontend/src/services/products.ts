import api from "@/api/client";
import type { Product } from "@/types/products";

export function listProducts(): Promise<Product[]> {
  return api.get<Product[]>("/products/").then((response) => response.data);
}