import type { Sale } from "@/types/sales";

const mockSales: Sale[] = [
  {
    id: 1,
    invoice_number: "00001005",
    sold_at: "2022-10-19T14:25:00Z",
    customer: 1,
    customer_name: "Jorge Lacerda dos Santos",
    seller: 1,
    seller_name: "Regina Souza",
    items: [
      {
        id: 1,
        product: 1,
        product_name: "Caderno espiral 96 folhas",
        quantity: 2,
        unit_price: "19.90",
        commission_percent: "5.00",
        commission: "1.99",
      },
      {
        id: 2,
        product: 2,
        product_name: "Caneta esferográfica azul",
        quantity: 5,
        unit_price: "6.26",
        commission_percent: "3.00",
        commission: "0.94",
      },
    ],
    total: "71.10",
  },
  {
    id: 2,
    invoice_number: "00001006",
    sold_at: "2022-10-19T15:10:00Z",
    customer: 2,
    customer_name: "Maria Aparecida Nogueira",
    seller: 2,
    seller_name: "Carlos Pereira",
    items: [
      {
        id: 3,
        product: 3,
        product_name: "Post-it 76x76",
        quantity: 2,
        unit_price: "12.45",
        commission_percent: "4.00",
        commission: "1.00",
      },
      {
        id: 4,
        product: 4,
        product_name: "Agenda couro A5",
        quantity: 1,
        unit_price: "130.00",
        commission_percent: "6.50",
        commission: "8.45",
      },
    ],
    total: "154.90",
  },
  {
    id: 3,
    invoice_number: "00001007",
    sold_at: "2022-10-20T09:40:00Z",
    customer: 3,
    customer_name: "Pedro Henrique Alves",
    seller: 1,
    seller_name: "Regina Souza",
    items: [
      {
        id: 5,
        product: 5,
        product_name: "Caixa de canetas coloridas",
        quantity: 1,
        unit_price: "27.90",
        commission_percent: "2.50",
        commission: "0.70",
      },
      {
        id: 6,
        product: 6,
        product_name: "Caderno brochura 10 matérias",
        quantity: 1,
        unit_price: "61.60",
        commission_percent: "5.00",
        commission: "3.08",
      },
    ],
    total: "89.50",
  },
  {
    id: 4,
    invoice_number: "00001008",
    sold_at: "2022-10-20T11:05:00Z",
    customer: 4,
    customer_name: "Ana Beatriz Costa",
    seller: 3,
    seller_name: "Fernanda Lima",
    items: [
      {
        id: 7,
        product: 7,
        product_name: "Régua 30cm",
        quantity: 4,
        unit_price: "8.20",
        commission_percent: "1.50",
        commission: "0.49",
      },
      {
        id: 8,
        product: 8,
        product_name: "Tesoura escolar",
        quantity: 1,
        unit_price: "18.50",
        commission_percent: "3.00",
        commission: "0.56",
      },
      {
        id: 9,
        product: 9,
        product_name: "Fichário 2 argolas",
        quantity: 1,
        unit_price: "169.00",
        commission_percent: "7.50",
        commission: "12.68",
      },
    ],
    total: "220.30",
  },
  {
    id: 5,
    invoice_number: "00001009",
    sold_at: "2022-10-21T16:55:00Z",
    customer: 5,
    customer_name: "João Pedro Martins",
    seller: 2,
    seller_name: "Carlos Pereira",
    items: [
      {
        id: 10,
        product: 10,
        product_name: "Bloco de notas adesivas",
        quantity: 2,
        unit_price: "6.50",
        commission_percent: "4.00",
        commission: "0.52",
      },
      {
        id: 11,
        product: 11,
        product_name: "Pasta classificadora",
        quantity: 1,
        unit_price: "32.00",
        commission_percent: "2.00",
        commission: "0.64",
      },
    ],
    total: "45.00",
  },
];

export function listSales(): Promise<Sale[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSales), 400);
  });
}

export function getSale(id: number): Promise<Sale | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSales.find((sale) => sale.id === id)), 400);
  });
}

export function createSale(
  input: Omit<Sale, "id" | "invoice_number">,
): Promise<Sale> {
  return new Promise((resolve) => {
    const nextId =
      mockSales.reduce((max, sale) => Math.max(max, sale.id), 0) + 1;

    const nextInvoice = String(
      Number(mockSales[mockSales.length - 1].invoice_number) + 1,
    ).padStart(8, "0");

    setTimeout(() => {
      const created: Sale = { id: nextId, invoice_number: nextInvoice, ...input };

      mockSales.push(created);

      resolve(created);
    }, 400);
  });
}