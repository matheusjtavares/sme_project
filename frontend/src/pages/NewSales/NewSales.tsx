import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import SaleForm from "@/components/SaleForm";
import styles from "./NewSales.module.css";
import { buildSalePayload, createSale } from "@/services/sales";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import { useSellers } from "@/hooks/useSellers";
import type { SaleDraft } from "@/hooks/useSaleForm";

const emptyDraft: SaleDraft = {
  sold_at: "",
  seller: 0,
  customer: 0,
  items: [],
};

export default function NewSales() {
  const navigate = useNavigate();
  const { sellers } = useSellers();
  const { customers } = useCustomers();
  const { products } = useProducts();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(draft: SaleDraft) {
    setSaving(true);
    setError(null);

    createSale(buildSalePayload(draft))
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