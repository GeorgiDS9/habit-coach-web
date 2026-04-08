import { describe, it, expect, beforeEach } from "vitest";
import {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  clearTokens,
  clearToken,
  isAuthenticated,
} from "../auth";

// jsdom provides localStorage; just reset it before each test.
beforeEach(() => {
  localStorage.clear();
});

describe("auth token helpers", () => {
  describe("access token", () => {
    it("getToken returns null when nothing stored", () => {
      expect(getToken()).toBeNull();
    });

    it("setToken / getToken round-trips", () => {
      setToken("abc123");
      expect(getToken()).toBe("abc123");
    });

    it("clearToken removes only the access token", () => {
      setToken("access");
      setRefreshToken("refresh");
      clearToken();
      expect(getToken()).toBeNull();
      expect(getRefreshToken()).toBe("refresh");
    });
  });

  describe("refresh token", () => {
    it("getRefreshToken returns null when nothing stored", () => {
      expect(getRefreshToken()).toBeNull();
    });

    it("setRefreshToken / getRefreshToken round-trips", () => {
      setRefreshToken("refresh-xyz");
      expect(getRefreshToken()).toBe("refresh-xyz");
    });
  });

  describe("clearTokens", () => {
    it("removes both tokens", () => {
      setToken("access");
      setRefreshToken("refresh");
      clearTokens();
      expect(getToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("returns false when no access token", () => {
      expect(isAuthenticated()).toBe(false);
    });

    it("returns true when access token is present", () => {
      setToken("some-token");
      expect(isAuthenticated()).toBe(true);
    });

    it("returns false after clearTokens", () => {
      setToken("some-token");
      clearTokens();
      expect(isAuthenticated()).toBe(false);
    });
  });
});
