import { describe, expect, it } from "vitest";

import { formatCurrency, formatDate, toDateTimeLocal } from "./format";

describe("formatCurrency", () => {
  it("formats a number in pt-BR/BRL", () => {
    expect(formatCurrency(1234.5).replace(/\s/g, " ")).toBe("R$ 1.234,50");
  });

  it("formats a string input", () => {
    expect(formatCurrency("1000000").replace(/\s/g, " ")).toBe("R$ 1.000.000,00");
  });

  it("formats zero", () => {
    expect(formatCurrency(0).replace(/\s/g, " ")).toBe("R$ 0,00");
  });
});

describe("toDateTimeLocal", () => {
  it("formats an ISO date as local YYYY-MM-DDTHH:mm", () => {
    expect(toDateTimeLocal("2026-09-22T10:30:00")).toBe("2026-09-22T10:30");
  });

  it("pads single-digit month, day, hour and minute", () => {
    expect(toDateTimeLocal("2026-01-05T07:05:00")).toBe("2026-01-05T07:05");
  });
});

describe("formatDate", () => {
  it("formats YYYY-MM-DD as dd/mm/yyyy", () => {
    expect(formatDate("2026-09-22")).toBe("22/09/2026");
  });

  it("returns an empty string for invalid input", () => {
    expect(formatDate("not-a-date")).toBe("");
    expect(formatDate("2026-9-2")).toBe("");
  });
});