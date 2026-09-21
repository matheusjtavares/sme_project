import SalesTable from "@/components/Sales";
import styles from "./EditSales.module.css";

export default function EditSales() {
  return (
    <div className={styles.page}>
      <SalesTable />
    </div>
  );
}