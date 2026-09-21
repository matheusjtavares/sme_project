import type { Sale } from "@/types/sales";

const mockSales: Sale[] = [
  {
    id: 1,
    invoiceNumber: "00001005",
    customer: "Jorge Lacerda dos Santos",
    seller: "Regina Souza",
    soldAt: "2022-10-19T14:25:00",
    totalAmount: 71.1,
  },
  {
    id: 2,
    invoiceNumber: "00001006",
    customer: "Maria Aparecida Nogueira",
    seller: "Carlos Pereira",
    soldAt: "2022-10-19T15:10:00",
    totalAmount: 154.9,
  },
  {
    id: 3,
    invoiceNumber: "00001007",
    customer: "Pedro Henrique Alves",
    seller: "Regina Souza",
    soldAt: "2022-10-20T09:40:00",
    totalAmount: 89.5,
  },
  {
    id: 4,
    invoiceNumber: "00001008",
    customer: "Ana Beatriz Costa",
    seller: "Fernanda Lima",
    soldAt: "2022-10-20T11:05:00",
    totalAmount: 220.3,
  },
  {
    id: 5,
    invoiceNumber: "00001009",
    customer: "João Pedro Martins",
    seller: "Carlos Pereira",
    soldAt: "2022-10-21T16:55:00",
    totalAmount: 45.0,
  },
];

export function listSales(): Promise<Sale[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSales), 400);
  });
}