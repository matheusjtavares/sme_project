import type { Product } from "@/types/products";

const mockProducts: Product[] = [
  { id: 1, code: "P001", description: "Caderno espiral 96 folhas", unit_price: "19.90", commission_percent: "5.00" },
  { id: 2, code: "P002", description: "Caneta esferográfica azul", unit_price: "6.26", commission_percent: "3.00" },
  { id: 3, code: "P003", description: "Post-it 76x76", unit_price: "12.45", commission_percent: "4.00" },
  { id: 4, code: "P004", description: "Agenda couro A5", unit_price: "130.00", commission_percent: "6.50" },
  { id: 5, code: "P005", description: "Caixa de canetas coloridas", unit_price: "27.90", commission_percent: "2.50" },
  { id: 6, code: "P006", description: "Caderno brochura 10 matérias", unit_price: "61.60", commission_percent: "5.00" },
  { id: 7, code: "P007", description: "Régua 30cm", unit_price: "8.20", commission_percent: "1.50" },
  { id: 8, code: "P008", description: "Tesoura escolar", unit_price: "18.50", commission_percent: "3.00" },
  { id: 9, code: "P009", description: "Fichário 2 argolas", unit_price: "169.00", commission_percent: "7.50" },
  { id: 10, code: "P010", description: "Bloco de notas adesivas", unit_price: "6.50", commission_percent: "4.00" },
  { id: 11, code: "P011", description: "Pasta classificadora", unit_price: "32.00", commission_percent: "2.00" },
];

export function listProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProducts), 400);
  });
}