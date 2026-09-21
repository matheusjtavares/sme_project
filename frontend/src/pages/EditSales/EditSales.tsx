import { useParams } from "react-router-dom";
import EditSaleForm from "@/components/EditSale";
import styles from "./EditSales.module.css";

export default function EditSales() {
  const { id } = useParams<{ id: string }>();
  const saleId = Number(id);

  return (
    <div className={styles.page}>
      <EditSaleForm saleId={saleId} />
    </div>
  );
}