import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import SaleDetailsPanel from "./SaleDetailsPanel";
import SaleItemsPanel from "./SaleItemsPanel";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import { useSale } from "@/hooks/useSale";
import { useSellers } from "@/hooks/useSellers";

interface EditSaleFormProps {
  saleId: number;
}

export default function EditSaleForm({ saleId }: EditSaleFormProps) {
  const { sale, loading, error } = useSale(saleId);
  const { sellers } = useSellers();
  const { customers } = useCustomers();
  const { products } = useProducts();

  if (loading) {
    return (
      <div className="text-center text-secondary py-5">
        Carregando venda...
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!sale) {
    return <Alert variant="danger">Venda não encontrada.</Alert>;
  }

  return (
    <Row className="g-4">
      <Col lg={8}>
        <SaleItemsPanel items={sale.items} products={products} />
      </Col>

      <Col lg={4}>
        <SaleDetailsPanel sale={sale} sellers={sellers} customers={customers} />
      </Col>
    </Row>
  );
}