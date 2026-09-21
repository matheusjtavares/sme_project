export interface Sale {
  id: number;
  invoiceNumber: string;
  customer: string;
  seller: string;
  soldAt: string;
  totalAmount: number;
}