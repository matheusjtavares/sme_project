import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Sale, SalePayload } from "@/types/sales";

vi.mock("@/api/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

import api from "@/api/client";
import {
  buildSalePayload,
  createSale,
  getSale,
  listSales,
  updateSale,
} from "./sales";

const mockedGet = vi.mocked(api.get);
const mockedPost = vi.mocked(api.post);
const mockedPatch = vi.mocked(api.patch);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("buildSalePayload", () => {
  it("converts sold_at to ISO and maps items", () => {
    const payload = buildSalePayload({
      sold_at: "2026-09-22T10:30:00",
      seller: 3,
      customer: 7,
      items: [
        { product: 1, quantity: 2 },
        { product: 5, quantity: 1 },
      ],
    });

    expect(payload).toEqual({
      sold_at: new Date("2026-09-22T10:30:00").toISOString(),
      seller: 3,
      customer: 7,
      items: [
        { product: 1, quantity: 2 },
        { product: 5, quantity: 1 },
      ],
    });
  });
});

describe("listSales", () => {
  it("GETs /sales/", async () => {
    mockedGet.mockResolvedValue({ data: [] });
    await expect(listSales()).resolves.toEqual([]);
    expect(mockedGet).toHaveBeenCalledWith("/sales/");
  });
});

describe("getSale", () => {
  it("GETs /sales/:id/", async () => {
    const sale = { id: 1 } as Sale;
    mockedGet.mockResolvedValue({ data: sale });
    await expect(getSale(1)).resolves.toBe(sale);
    expect(mockedGet).toHaveBeenCalledWith("/sales/1/");
  });

  it("returns undefined on a 404", async () => {
    mockedGet.mockRejectedValue(
      Object.assign(new Error("Request failed"), {
        isAxiosError: true,
        response: { status: 404 },
      }),
    );
    await expect(getSale(404)).resolves.toBeUndefined();
  });

  it("rethrows other errors", async () => {
    mockedGet.mockRejectedValue(new Error("network down"));
    await expect(getSale(1)).rejects.toThrow("network down");
  });
});

describe("createSale", () => {
  it("POSTs the payload to /sales/", async () => {
    const sale = { id: 1 } as Sale;
    mockedPost.mockResolvedValue({ data: sale });

    const payload: SalePayload = {
      sold_at: "2026-09-22T10:30:00",
      seller: 3,
      customer: 7,
      items: [{ product: 1, quantity: 2 }],
    };

    await expect(createSale(payload)).resolves.toBe(sale);
    expect(mockedPost).toHaveBeenCalledWith("/sales/", payload);
  });
});

describe("updateSale", () => {
  it("PATCHes the payload to /sales/:id/", async () => {
    const sale = { id: 1 } as Sale;
    mockedPatch.mockResolvedValue({ data: sale });

    const payload: SalePayload = {
      sold_at: "2026-09-22T10:30:00",
      seller: 3,
      customer: 7,
      items: [{ product: 1, quantity: 2 }],
    };

    await expect(updateSale(1, payload)).resolves.toBe(sale);
    expect(mockedPatch).toHaveBeenCalledWith("/sales/1/", payload);
  });
});