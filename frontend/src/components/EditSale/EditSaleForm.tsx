import SaleDetailsPanel from "./SaleDetailsPanel";
import SaleItemsPanel from "./SaleItemsPanel";
import styles from "./EditSaleForm.module.css";

export default function EditSaleForm() {
  return (
    <div className={styles.form}>
      <SaleItemsPanel />

      <SaleDetailsPanel />
    </div>
  );
}