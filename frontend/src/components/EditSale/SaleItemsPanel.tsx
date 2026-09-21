import styles from "./SaleItemsPanel.module.css";

function SaleItemsPanel() {
  return (
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>Produtos</h2>

      <div className={styles.addRow}>
        <label className={styles.field}>
          <span className={styles.label}>Produto</span>

          <select defaultValue={0}>
            <option value={0} disabled>
              Selecione um produto
            </option>
          </select>
        </label>

        <label className={styles.fieldQty}>
          <span className={styles.label}>Quantidade</span>

          <input type="number" min={1} defaultValue={1} />
        </label>

        <button type="button" className={styles.addButton}>
          Adicionar
        </button>
      </div>

      <table className={styles.table}>
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
      </table>
    </div>
  );
}

export default SaleItemsPanel;