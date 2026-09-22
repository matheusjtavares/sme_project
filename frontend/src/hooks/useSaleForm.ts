import { useState } from "react";

import type { Product } from "@/types/products";
import type { SaleItem } from "@/types/saleitems";

export interface SaleDraft {
  sold_at: string;
  seller: number;
  customer: number;
  items: SaleItem[];
}

interface UseSaleFormResult {
  draft: SaleDraft;
  total: number;
  isComplete: boolean;
  onSoldAtChange: (value: string) => void;
  onSellerChange: (value: number) => void;
  onCustomerChange: (value: number) => void;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (id: number) => void;
}

const toCents = (value: string | number) => Math.round(Number(value) * 100);

export function useSaleForm(initial: SaleDraft): UseSaleFormResult {
  const [draft, setDraft] = useState<SaleDraft>(initial);

  const total = draft.items.reduce(
    (sum, item) => sum + toCents(item.unit_price) * item.quantity,
    0,
  ) / 100;

  const isComplete =
    draft.sold_at !== "" &&
    draft.seller > 0 &&
    draft.customer > 0 &&
    draft.items.length > 0;

  function onSoldAtChange(value: string) {
    setDraft((prev) => ({ ...prev, sold_at: value }));
  }

  function onSellerChange(value: number) {
    setDraft((prev) => ({ ...prev, seller: value }));
  }

  function onCustomerChange(value: number) {
    setDraft((prev) => ({ ...prev, customer: value }));
  }

  function addItem(product: Product, quantity: number) {
    const nextId =
      draft.items.reduce((max, item) => Math.max(max, item.id), 0) + 1;

    const unitPrice = Number(product.unit_price);
    const percentage = Number(product.commission_percent);
    const commission = (quantity * unitPrice * percentage) / 100;

    setDraft((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: nextId,
          product: product.id,
          product_name: product.description,
          quantity,
          unit_price: product.unit_price,
          commission_percent: product.commission_percent,
          commission: commission.toFixed(2),
        },
      ],
    }));
  }

  function removeItem(id: number) {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }

  return {
    draft,
    total,
    isComplete,
    onSoldAtChange,
    onSellerChange,
    onCustomerChange,
    addItem,
    removeItem,
  };
}