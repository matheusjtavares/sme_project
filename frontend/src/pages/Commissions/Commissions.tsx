import { useState } from "react";
import Button from "react-bootstrap/Button";
import { BsCalendar3, BsSearch } from "react-icons/bs";
import CommissionTable from "@/components/Commissions";
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
          <div className="input-group">
            <input
              type="date"
              className="form-control"
              value={draftStart}
              aria-label="Data inicial"
              onChange={(event) => setDraftStart(event.target.value)}
            />
            <span className="input-group-text border-0 bg-transparent">
              <BsCalendar3 />
            </span>
          </div>

          <div className="input-group">
            <input
              type="date"
              className="form-control"
              value={draftEnd}
              aria-label="Data final"
              onChange={(event) => setDraftEnd(event.target.value)}
            />
            <span className="input-group-text border-0 bg-transparent">
              <BsCalendar3 />
            </span>
          </div>

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