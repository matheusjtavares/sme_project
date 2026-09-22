import type { SaleItem } from "./saleitems";

export interface Sale {
  id: number;
  invoice_number: string;
  sold_at: string;
  customer: number;
  customer_name: string;
  seller: number;
  seller_name: string;
  items: SaleItem[];
  total: string;
}