import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import SaleDetailsPanel from "./SaleDetailsPanel";
import SaleItemsPanel from "./SaleItemsPanel";
import { useSaleForm, type SaleDraft } from "@/hooks/useSaleForm";
import type { Customer } from "@/types/customers";
import type { Product } from "@/types/products";
import type { Seller } from "@/types/sellers";

interface SaleFormProps {
  initial: SaleDraft;
  sellers: Seller[];
  customers: Customer[];
  products: Product[];
  saving?: boolean;
  submitLabel?: string;
  onSubmit?: (draft: SaleDraft) => void;
}

export default function SaleForm({
  initial,
  sellers,
  customers,
  products,
  saving = false,
  submitLabel = "Finalizar",
  onSubmit,
}: SaleFormProps) {
  const navigate = useNavigate();

  const {
    draft,
    total,
    isComplete,
    onSoldAtChange,
    onSellerChange,
    onCustomerChange,
    addItem,
    removeItem,
  } = useSaleForm(initial);

  const handleSubmit = () => {
    if (onSubmit) onSubmit(draft);
  };

  return (
    <Row className="g-4">
      <Col lg={8}>
        <SaleItemsPanel
          items={draft.items}
          products={products}
          onAddItem={addItem}
          onRemoveItem={removeItem}
        />
      </Col>

      <Col lg={4}>
        <SaleDetailsPanel
          soldAt={draft.sold_at}
          onSoldAtChange={onSoldAtChange}
          sellerId={draft.seller}
          sellers={sellers}
          onSellerChange={onSellerChange}
          customerId={draft.customer}
          customers={customers}
          onCustomerChange={onCustomerChange}
          total={total}
          saving={saving}
          valid={isComplete}
          onSubmit={onSubmit ? handleSubmit : undefined}
          onCancel={() => navigate("/sales")}
          submitLabel={submitLabel}
        />
      </Col>
    </Row>
  );
}