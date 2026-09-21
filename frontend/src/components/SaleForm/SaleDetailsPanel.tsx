import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "./SaleDetailsPanel.module.css";
import { formatCurrency } from "@/utils/format";
import type { Customer } from "@/types/customers";
import type { Seller } from "@/types/sellers";

interface SaleDetailsPanelProps {
  soldAt: string;
  onSoldAtChange: (value: string) => void;
  sellerId: number;
  sellers: Seller[];
  onSellerChange: (value: number) => void;
  customerId: number;
  customers: Customer[];
  onCustomerChange: (value: number) => void;
  total: number;
  saving: boolean;
  valid: boolean;
  onSubmit?: () => void;
  onCancel: () => void;
  submitLabel?: string;
}

function SaleDetailsPanel({
  soldAt,
  onSoldAtChange,
  sellerId,
  sellers,
  onSellerChange,
  customerId,
  customers,
  onCustomerChange,
  total,
  saving,
  valid,
  onSubmit,
  onCancel,
  submitLabel = "Finalizar",
}: SaleDetailsPanelProps) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>Dados da venda</h2>

      <div>
        <Form.Label className={styles.label}>Data/hora</Form.Label>

        <Form.Control
          type="datetime-local"
          value={soldAt}
          onChange={(event) => onSoldAtChange(event.target.value)}
        />
      </div>

      <div>
        <Form.Label className={styles.label}>Vendedor</Form.Label>

        <Form.Select
          value={String(sellerId)}
          onChange={(event) => onSellerChange(Number(event.target.value))}
        >
          <option value={0} disabled>
            Selecione um vendedor
          </option>

          {sellers.map((seller) => (
            <option key={seller.id} value={String(seller.id)}>
              {seller.name}
            </option>
          ))}
        </Form.Select>
      </div>

      <div>
        <Form.Label className={styles.label}>Cliente</Form.Label>

        <Form.Select
          value={String(customerId)}
          onChange={(event) => onCustomerChange(Number(event.target.value))}
        >
          <option value={0} disabled>
            Selecione um cliente
          </option>

          {customers.map((customer) => (
            <option key={customer.id} value={String(customer.id)}>
              {customer.name}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className={styles.footer}>
        <div className={styles.totalRow}>
          <span>Valor total da Venda</span>

          <strong>{formatCurrency(total)}</strong>
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancelar
          </Button>

          <Button
            variant="primary-light"
            className={styles.finalizeButton}
            disabled={!valid || saving}
            onClick={onSubmit}
          >
            {saving ? "Finalizando..." : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SaleDetailsPanel;