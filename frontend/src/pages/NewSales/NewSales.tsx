import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import SaleForm from "@/components/SaleForm";
import styles from "./NewSales.module.css";
import { createSale } from "@/services/sales";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import { useSellers } from "@/hooks/useSellers";
import type { SaleDraft } from "@/hooks/useSaleForm";
import type { Customer } from "@/types/customers";
import type { Sale } from "@/types/sales";
import type { Seller } from "@/types/sellers";

const emptyDraft: SaleDraft = {
  sold_at: "",
  seller: 0,
  customer: 0,
  items: [],
};

function buildPayload(
  draft: SaleDraft,
  sellers: Seller[],
  customers: Customer[],
): Omit<Sale, "id" | "invoice_number"> {
  const seller = sellers.find((item) => item.id === draft.seller);
  const customer = customers.find((item) => item.id === draft.customer);

  const total = draft.items.reduce(
    (sum, item) => sum + item.quantity * Number(item.unit_price),
    0,
  );

  return {
    sold_at: new Date(draft.sold_at).toISOString(),
    customer: draft.customer,
    customer_name: customer?.name ?? "",
    seller: draft.seller,
    seller_name: seller?.name ?? "",
    items: draft.items,
    total: total.toFixed(2),
  };
}

export default function NovaVenda() {
  const navigate = useNavigate();
  const { sellers } = useSellers();
  const { customers } = useCustomers();
  const { products } = useProducts();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(draft: SaleDraft) {
    setSaving(true);
    setError(null);

    createSale(buildPayload(draft, sellers, customers))
      .then(() => navigate("/sales"))
      .catch(() => setError("Não foi possível finalizar a venda."))
      .finally(() => setSaving(false));
  }

  return (
    <div className={styles.page}>
      {error && <Alert variant="danger">{error}</Alert>}

      <SaleForm
        initial={emptyDraft}
        sellers={sellers}
        customers={customers}
        products={products}
        saving={saving}
        onSubmit={handleSubmit}
      />
    </div>
  );
}