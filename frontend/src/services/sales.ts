import { isAxiosError } from "axios";

import api from "@/api/client";
import type { Sale, SalePayload } from "@/types/sales";

export interface SalePayloadSource {
  sold_at: string;
  seller: number;
  customer: number;
  items: Array<{ product: number; quantity: number }>;
}

export function listSales(): Promise<Sale[]> {
  return api.get<Sale[]>("/sales/").then((response) => response.data);
}

export async function getSale(id: number): Promise<Sale | undefined> {
  try {
    const { data } = await api.get<Sale>(`/sales/${id}/`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export function createSale(payload: SalePayload): Promise<Sale> {
  return api.post<Sale>("/sales/", payload).then((response) => response.data);
}

export function updateSale(id: number, payload: SalePayload): Promise<Sale> {
  return api
    .patch<Sale>(`/sales/${id}/`, payload)
    .then((response) => response.data);
}

export function buildSalePayload(source: SalePayloadSource): SalePayload {
  return {
    sold_at: new Date(source.sold_at).toISOString(),
    seller: source.seller,
    customer: source.customer,
    items: source.items.map(({ product, quantity }) => ({ product, quantity })),
  };
}