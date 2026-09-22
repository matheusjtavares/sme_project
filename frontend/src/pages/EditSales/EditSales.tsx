import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import SaleForm from "@/components/SaleForm";
import styles from "./EditSales.module.css";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import { useSale } from "@/hooks/useSale";
import { useSellers } from "@/hooks/useSellers";
import type { SaleDraft } from "@/hooks/useSaleForm";
import { buildSalePayload, updateSale } from "@/services/sales";
import { toDateTimeLocal } from "@/utils/format";
import type { Sale } from "@/types/sales";

function toDraft(sale: Sale): SaleDraft {
  return {
    sold_at: toDateTimeLocal(sale.sold_at),
    seller: sale.seller,
    customer: sale.customer,
    items: sale.items,
  };
}

export default function EditSales() {
  const { id } = useParams<{ id: string }>();
  const saleId = Number(id);
  const navigate = useNavigate();

  const { sale, loading, error } = useSale(saleId);
  const { sellers } = useSellers();
  const { customers } = useCustomers();
  const { products } = useProducts();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleSubmit(draft: SaleDraft) {
    setSaving(true);
    setSaveError(null);

    updateSale(saleId, buildSalePayload(draft))
      .then(() => navigate("/sales"))
      .catch(() => setSaveError("Não foi possível salvar a venda."))
      .finally(() => setSaving(false));
  }

  if (loading) {
    return (
      <div className="text-center text-secondary py-5">
        Carregando venda...
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!sale) {
    return <Alert variant="danger">Venda não encontrada.</Alert>;
  }

  return (
    <div className={styles.page}>
      {saveError && <Alert variant="danger">{saveError}</Alert>}

      <SaleForm
        key={saleId}
        initial={toDraft(sale)}
        sellers={sellers}
        customers={customers}
        products={products}
        saving={saving}
        onSubmit={handleSubmit}
        submitLabel="Salvar"
      />
    </div>
  );
}
