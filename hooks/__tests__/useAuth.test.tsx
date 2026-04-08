import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { useAuth } from "../useAuth";
import {
  setToken,
  setRefreshToken,
  clearTokens,
  getRefreshToken,
} from "@/lib/auth";
import toast from "react-hot-toast";
import { LOGIN_MUTATION, LOGOUT_MUTATION } from "@/graphql/operations";

vi.mock("@/lib/auth", () => ({
  setToken: vi.fn(),
  setRefreshToken: vi.fn(),
  clearTokens: vi.fn(),
  getRefreshToken: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockLogin = {
  request: {
    query: LOGIN_MUTATION,
    variables: { input: { email: "test@test.com", password: "password" } },
  },
  result: {
    data: {
      login: {
        accessToken: "access-123",
        refreshToken: "refresh-123",
      },
    },
  },
};

const mockLogout = {
  request: {
    query: LOGOUT_MUTATION,
    variables: { refreshToken: "refresh-123" },
  },
  result: {
    data: { logout: true },
  },
};

describe("useAuth hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("login sets both access and refresh tokens", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[mockLogin]} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    await act(async () => {
      await result.current.login({ email: "test@test.com", password: "password" });
    });

    expect(setToken).toHaveBeenCalledWith("access-123");
    expect(setRefreshToken).toHaveBeenCalledWith("refresh-123");
    expect(toast.success).toHaveBeenCalledWith("Welcome back!");
  });

  it("logout revokes token on backend and clears local state", async () => {
    vi.mocked(getRefreshToken).mockReturnValue("refresh-123");

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[mockLogout]} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(clearTokens).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Logged out");
  });
});
