import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "./SaleDetailsPanel.module.css";

function SaleDetailsPanel() {
  return (
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>Dados da venda</h2>

      <div>
        <Form.Label className={styles.label}>Data/hora</Form.Label>

        <Form.Control type="datetime-local" />
      </div>

      <div>
        <Form.Label className={styles.label}>Vendedor</Form.Label>

        <Form.Select defaultValue={0}>
          <option value={0} disabled>
            Selecione um vendedor
          </option>
        </Form.Select>
      </div>

      <div>
        <Form.Label className={styles.label}>Cliente</Form.Label>

        <Form.Select defaultValue={0}>
          <option value={0} disabled>
            Selecione um cliente
          </option>
        </Form.Select>
      </div>

      <div className={styles.footer}>
        <div className={styles.totalRow}>
          <span>Valor total da Venda</span>

          <strong>R$ 0,00</strong>
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