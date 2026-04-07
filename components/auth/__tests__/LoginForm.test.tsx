import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../LoginForm";

// next/navigation is used inside LoginForm's dependency chain (Link)
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/login",
}));

const noop = async () => {};

describe("LoginForm", () => {
  const user = userEvent.setup();

  it("renders email and password fields and submit button", () => {
    render(
      <LoginForm onLogin={noop} onSuccess={vi.fn()} isLoading={false} />
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    render(
      <LoginForm onLogin={noop} onSuccess={vi.fn()} isLoading={false} />
    );
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it("shows validation error for invalid email", async () => {
    render(
      <LoginForm onLogin={noop} onSuccess={vi.fn()} isLoading={false} />
    );
    await user.type(screen.getByLabelText(/email/i), "notanemail");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it("calls onLogin and onSuccess with valid credentials", async () => {
    const onLogin = vi.fn().mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    render(
      <LoginForm onLogin={onLogin} onSuccess={onSuccess} isLoading={false} />
    );
    await user.type(screen.getByLabelText(/email/i), "user@test.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith({
        email: "user@test.com",
        password: "password123",
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("shows error alert when error prop is provided", () => {
    const error = { message: "Invalid email or password" };
    render(
      <LoginForm onLogin={noop} onSuccess={vi.fn()} isLoading={false} error={error} />
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("disables button while loading", () => {
    render(
      <LoginForm onLogin={noop} onSuccess={vi.fn()} isLoading={true} />
    );
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });

  it("has a link to the signup page", () => {
    render(
      <LoginForm onLogin={noop} onSuccess={vi.fn()} isLoading={false} />
    );
    expect(screen.getByRole("link", { name: /create one/i })).toBeInTheDocument();
  });
});
