import { NavLink } from "react-router-dom";
import styles from "./Sales.module.css";
import SalesTable from "@/components/Sales";

export default function Sales() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2>Vendas Realizadas</h2>

        <NavLink to="/sales/new" className="btn btn-primary" style={{ fontSize: "14px" }}>
          Inserir Nova Venda
        </NavLink>
      </div>

      <SalesTable />
    </div>
  );
}