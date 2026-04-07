import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProtectedLayout from "../layout";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";

vi.mock("@/lib/auth", () => ({
  isAuthenticated: vi.fn(),
  clearToken: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useApolloClient: () => ({ clearStore: vi.fn() }),
}));

describe("ProtectedLayout (Auth Guard)", () => {
  const push = vi.fn();
  const replace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push, replace });
  });

  it("redirects to login if not authenticated", () => {
    (isAuthenticated as any).mockReturnValue(false);
    
    render(
      <ProtectedLayout>
        <div>Secret Content</div>
      </ProtectedLayout>
    );

    expect(replace).toHaveBeenCalledWith("/login");
    expect(screen.queryByText(/secret content/i)).not.toBeInTheDocument();
  });

  it("renders children if authenticated", async () => {
    (isAuthenticated as any).mockReturnValue(true);

    render(
      <ProtectedLayout>
        <div>Secret Content</div>
      </ProtectedLayout>
    );

    expect(screen.getByText(/secret content/i)).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
