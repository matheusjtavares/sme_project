import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import styles from "./SaleItemsPanel.module.css";

function SaleItemsPanel() {
  return (
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>Produtos</h2>

      <div className={styles.addRow}>
        <div className={styles.field}>
          <Form.Label className={styles.label}>Produto</Form.Label>

          <Form.Select defaultValue={0}>
            <option value={0} disabled>
              Selecione um produto
            </option>
          </Form.Select>
        </div>

        <div className={styles.fieldQty}>
          <Form.Label className={styles.label}>Quantidade</Form.Label>

          <Form.Control type="number" min={1} defaultValue={1} />
        </div>

        <Button type="button" variant="primary" className={styles.addButton}>
          Adicionar
        </Button>
      </div>

      <Table className={styles.table}>
        <thead>
          <tr>
            <th>Produto/Serviço</th>
            <th>Quantidade</th>
            <th>Preço unitário</th>
            <th>Total</th>
            <th aria-label="Excluir" />
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan={5} className={styles.emptyCell}>
              Nenhum item adicionado.
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default SaleItemsPanel;