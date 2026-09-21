import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SaleDetailsPanel from "./SaleDetailsPanel";
import SaleItemsPanel from "./SaleItemsPanel";

export default function EditSaleForm() {
  return (
    <Row className="g-4">
      <Col lg={8}>
        <SaleItemsPanel />
      </Col>

      <Col lg={4}>
        <SaleDetailsPanel />
      </Col>
    </Row>
  );
}