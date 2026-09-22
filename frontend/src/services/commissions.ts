import api from "@/api/client";
import type { CommissionReport } from "@/types/commissions";

export function getCommissionReport(
  start: string,
  end: string,
): Promise<CommissionReport> {
  return api
    .get<CommissionReport>("/commission-report/", {
      params: { start_date: start, end_date: end },
    })
    .then((response) => response.data);
}