import { useEffect, useState } from "react";

import { getCommissionReport } from "@/services/commissions";
import type { CommissionReport } from "@/types/commissions";

interface UseCommissionReportResult {
  report: CommissionReport | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCommissionReport(params: {
  start: string;
  end: string;
}): UseCommissionReportResult {
  const [report, setReport] = useState<CommissionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const { start, end } = params;

  useEffect(() => {
    let active = true;

    getCommissionReport(start, end)
      .then((data) => {
        if (active) setReport(data);
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar o relatório de comissões.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [start, end, version]);

  function refetch() {
    setLoading(true);
    setError(null);
    setVersion((value) => value + 1);
  }

  return { report, loading, error, refetch };
}