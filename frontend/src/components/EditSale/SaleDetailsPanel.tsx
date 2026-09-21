import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "./SaleDetailsPanel.module.css";
import { formatCurrency, toDateTimeLocal } from "@/utils/format";
import type { Customer } from "@/types/customers";
import type { Sale } from "@/types/sales";
import type { Seller } from "@/types/sellers";

interface SaleDetailsPanelProps {
  sale: Sale;
  sellers: Seller[];
  customers: Customer[];
}

function SaleDetailsPanel({ sale, sellers, customers }: SaleDetailsPanelProps) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>Dados da venda</h2>

      <div>
        <Form.Label className={styles.label}>Data/hora</Form.Label>

        <Form.Control
          type="datetime-local"
          defaultValue={toDateTimeLocal(sale.sold_at)}
        />
      </div>

      <div>
        <Form.Label className={styles.label}>Vendedor</Form.Label>

        <Form.Select value={String(sale.seller)}>
          {sellers.map((seller) => (
            <option key={seller.id} value={String(seller.id)}>
              {seller.name}
            </option>
          ))}
        </Form.Select>
      </div>

      <div>
        <Form.Label className={styles.label}>Cliente</Form.Label>

        <Form.Select value={String(sale.customer)}>
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

          <strong>{formatCurrency(sale.total)}</strong>
        </div>

        <div className={styles.actions}>
          <Button variant="primary" className={styles.cancelButton}>
            Cancelar
          </Button>

          <Button variant="primary-light" className={styles.finalizeButton}>
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SaleDetailsPanel;