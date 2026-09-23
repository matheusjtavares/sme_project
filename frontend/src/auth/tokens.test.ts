import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./tokens";

class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage());
});

describe("setTokens / token getters", () => {
  it("stores access and refresh tokens", () => {
    setTokens("access-token", "refresh-token");
    expect(getAccessToken()).toBe("access-token");
    expect(getRefreshToken()).toBe("refresh-token");
  });

  it("does not store a refresh token when refresh is null", () => {
    setTokens("access-token", null);
    expect(getAccessToken()).toBe("access-token");
    expect(getRefreshToken()).toBeNull();
  });

  it("returns null when nothing is stored", () => {
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});

describe("clearTokens", () => {
  it("removes both stored tokens", () => {
    setTokens("access-token", "refresh-token");
    clearTokens();
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});