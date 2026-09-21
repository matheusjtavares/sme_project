import styles from "./Sales.module.css";
import SalesTable from "@/components/Sales";

export default function Sales() {
  return (
    <div className={styles.page}>
      <h2>Vendas Realizadas</h2>

      <SalesTable />
    </div>
  );
}