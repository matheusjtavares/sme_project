import api from "@/api/client";
import type { Customer } from "@/types/customers";

export function listCustomers(): Promise<Customer[]> {
  return api.get<Customer[]>("/customers/").then((response) => response.data);
}