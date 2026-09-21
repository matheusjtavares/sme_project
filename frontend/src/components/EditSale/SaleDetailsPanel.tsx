import styles from "./SaleDetailsPanel.module.css";

function SaleDetailsPanel() {
  return (
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>Dados da venda</h2>

      <label className={styles.field}>
        <span className={styles.label}>Data/hora</span>

        <input type="datetime-local" />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Vendedor</span>

        <select defaultValue={0}>
          <option value={0} disabled>
            Selecione um vendedor
          </option>
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Cliente</span>

        <select defaultValue={0}>
          <option value={0} disabled>
            Selecione um cliente
          </option>
        </select>
      </label>

      <div className={styles.footer}>
        <div className={styles.totalRow}>
          <span>Valor total da Venda</span>

          <strong>R$ 0,00</strong>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton}>
            Cancelar
          </button>

          <button type="button" className={styles.finalizeButton}>
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaleDetailsPanel;