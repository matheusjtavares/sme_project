import Table from "react-bootstrap/Table";
import styles from "./CommissionTable.module.css";
import { formatCurrency } from "@/utils/format";
import type { CommissionReport } from "@/types/commissions";

interface CommissionTableProps {
  report: CommissionReport | null;
  loading: boolean;
  error: string | null;
}

function CommissionTable({ report, loading, error }: CommissionTableProps) {
  const hasRows = report !== null && report.sellers.length > 0;

  return (
    <div className={styles.tableWrapper}>
      <Table className={styles.table}>
        <thead>
          <tr>
            <th>Cód.</th>
            <th>Vendedor</th>
            <th className="text-center">Total de Vendas</th>
            <th className="text-center">Total de Comissões</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center text-secondary">
                Carregando relatório...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={4} className="text-center">
                <span className="text-danger">{error}</span>
              </td>
            </tr>
          ) : hasRows ? (
            report.sellers.map((seller) => (
              <tr key={seller.id}>
                <td>{seller.id}</td>
                <td>{seller.name}</td>
                <td className="text-center">
                  {formatCurrency(seller.total_sales)}
                </td>
                <td className="text-center">
                  {formatCurrency(seller.total_commission)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-secondary">
                Nenhum resultado.
              </td>
            </tr>
          )}
        </tbody>

        {hasRows && (
          <tfoot>
            <tr>
              <td colSpan={3} className="text-start">
                Total de Comissões do Período
              </td>
              <td className="text-center">
                {formatCurrency(report.total_commission)}
              </td>
            </tr>
          </tfoot>
        )}
      </Table>
    </div>
  );
}

export default CommissionTable;