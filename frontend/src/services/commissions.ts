import type { CommissionReport } from "@/types/commissions";

const mockReport: CommissionReport = {
  start: "2022-10-19",
  end: "2022-10-21",
  sellers: [
    {
      id: 1,
      name: "Regina Souza",
      total_sales: "160.60",
      total_commission: "6.71",
    },
    {
      id: 2,
      name: "Carlos Pereira",
      total_sales: "199.90",
      total_commission: "10.61",
    },
    {
      id: 3,
      name: "Fernanda Lima",
      total_sales: "220.30",
      total_commission: "13.73",
    },
  ],
  total_commission: "31.05",
};

export function getCommissionReport(
  _start: string,
  _end: string,
): Promise<CommissionReport> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockReport), 400);
  });
}