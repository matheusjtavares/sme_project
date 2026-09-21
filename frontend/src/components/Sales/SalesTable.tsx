import Table from "react-bootstrap/Table";
import { BsPencil, BsTrash } from "react-icons/bs";
import { useSales } from "@/hooks/useSales";
import styles from "./SalesTable.module.css";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const datetimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatDateTime(iso: string): string {
  return datetimeFormatter.format(new Date(iso)).replace(" ", " - ");
}

function SalesTable() {
  const { sales, loading, error } = useSales();

  return (
    <div className={styles.tableWrapper}>
      <Table className={styles.table}>
        <thead>
          <tr>
            <th>Nota Fiscal</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Data da Venda</th>
            <th>Valor Total</th>
            <th>Opções</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className={styles.stateCell}>
                Carregando vendas...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className={styles.stateCell}>
                <span className={styles.stateError}>{error}</span>
              </td>
            </tr>
          ) : (
            sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.invoice_number}</td>

                <td>{sale.customer_name}</td>

                <td>{sale.seller_name}</td>

                <td>{formatDateTime(sale.sold_at)}</td>

                <td>{currencyFormatter.format(Number(sale.total))}</td>

                <td>
                  <button type="button" className={styles.viewItems}>
                    Ver itens
                  </button>

                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.editButton}`}
                    aria-label="Editar venda"
                  >
                    <BsPencil />
                  </button>

                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    aria-label="Excluir venda"
                  >
                    <BsTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default SalesTable;