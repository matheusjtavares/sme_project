import { useState } from "react";
import Button from "react-bootstrap/Button";
import { BsSearch } from "react-icons/bs";
import CommissionTable from "@/components/Commissions";
import DatePicker from "@/components/DatePicker";
import { useCommissionReport } from "@/hooks/useCommissionReport";
import styles from "./Commissions.module.css";

const DEFAULT_START = "2022-10-19";
const DEFAULT_END = "2022-10-21";

export default function Commissions() {
  const [draftStart, setDraftStart] = useState(DEFAULT_START);
  const [draftEnd, setDraftEnd] = useState(DEFAULT_END);
  const [appliedStart, setAppliedStart] = useState(DEFAULT_START);
  const [appliedEnd, setAppliedEnd] = useState(DEFAULT_END);

  const { report, loading, error, refetch } = useCommissionReport({
    start: appliedStart,
    end: appliedEnd,
  });

  function handleSearch() {
    setAppliedStart(draftStart);
    setAppliedEnd(draftEnd);
    refetch();
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2>Relatório de Comissões</h2>

        <div className={styles.filters}>
          <DatePicker
            value={draftStart}
            onChange={setDraftStart}
            ariaLabel="Data inicial"
          />

          <DatePicker
            value={draftEnd}
            onChange={setDraftEnd}
            ariaLabel="Data final"
          />

          <Button
            type="button"
            variant="primary"
            className={styles.searchButton}
            aria-label="Buscar"
            disabled={loading}
            onClick={handleSearch}
          >
            <BsSearch />
          </Button>
        </div>
      </div>

      <CommissionTable report={report} loading={loading} error={error} />
    </div>
  );
}