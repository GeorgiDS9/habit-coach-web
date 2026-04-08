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
import { LOGIN_MUTATION, LOGOUT_MUTATION, SIGNUP_MUTATION } from "@/graphql/operations";

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

const mockLoginError = {
  request: {
    query: LOGIN_MUTATION,
    variables: { input: { email: "bad@test.com", password: "wrong" } },
  },
  error: new Error("Invalid email or password"),
};

const mockSignup = {
  request: {
    query: SIGNUP_MUTATION,
    variables: { input: { email: "new@test.com", password: "password123" } },
  },
  result: {
    data: {
      signup: {
        accessToken: "new-access-456",
        refreshToken: "new-refresh-456",
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
        <MockedProvider mocks={[mockLogin]}>
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

  it("login shows error toast and re-throws on failure", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[mockLoginError]}>
          {children}
        </MockedProvider>
      ),
    });

    await expect(
      act(async () => {
        await result.current.login({ email: "bad@test.com", password: "wrong" });
      })
    ).rejects.toThrow();

    expect(toast.error).toHaveBeenCalled();
    expect(setToken).not.toHaveBeenCalled();
  });

  it("signup sets both access and refresh tokens", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[mockSignup]}>
          {children}
        </MockedProvider>
      ),
    });

    await act(async () => {
      await result.current.signup({ email: "new@test.com", password: "password123" });
    });

    expect(setToken).toHaveBeenCalledWith("new-access-456");
    expect(setRefreshToken).toHaveBeenCalledWith("new-refresh-456");
    expect(toast.success).toHaveBeenCalledWith("Account created successfully!");
  });

  it("logout revokes token on backend and clears local state", async () => {
    vi.mocked(getRefreshToken).mockReturnValue("refresh-123");

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[mockLogout]}>
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

  it("logout clears local state even if backend mutation fails", async () => {
    vi.mocked(getRefreshToken).mockReturnValue("refresh-999");

    // No mock for this refresh token — mutation will "error"
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[]}>
          {children}
        </MockedProvider>
      ),
    });

    await act(async () => {
      await result.current.logout();
    });

    // Local state must always be cleared regardless of backend result
    expect(clearTokens).toHaveBeenCalled();
  });
});
