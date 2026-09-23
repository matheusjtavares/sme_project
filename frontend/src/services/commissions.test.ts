import { describe, expect, it, vi } from "vitest";

import type { CommissionReport } from "@/types/commissions";

vi.mock("@/api/client", () => ({
  default: {
    get: vi.fn(),
  },
}));

import api from "@/api/client";
import { getCommissionReport } from "./commissions";

const mockedGet = vi.mocked(api.get);

describe("getCommissionReport", () => {
  it("GETs /commission-report/ with start and end dates", async () => {
    const report: CommissionReport = {
      start: "2026-09-01",
      end: "2026-09-30",
      sellers: [],
      total_commission: "0.00",
    };
    mockedGet.mockResolvedValue({ data: report });

    await expect(
      getCommissionReport("2026-09-01", "2026-09-30"),
    ).resolves.toBe(report);
    expect(mockedGet).toHaveBeenCalledWith("/commission-report/", {
      params: { start_date: "2026-09-01", end_date: "2026-09-30" },
    });
  });
});