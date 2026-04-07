import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignupForm } from "../SignupForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/signup",
}));

const noop = async () => {};

describe("SignupForm", () => {
  const user = userEvent.setup();

  it("renders email and password fields", () => {
    render(
      <SignupForm onSignup={noop} onSuccess={vi.fn()} isLoading={false} />
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("validates minimum password length", async () => {
    render(
      <SignupForm onSignup={noop} onSuccess={vi.fn()} isLoading={false} />
    );
    await user.type(screen.getByLabelText(/email/i), "user@test.com");
    await user.type(screen.getByLabelText(/password/i), "short");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it("calls onSignup and onSuccess with valid credentials", async () => {
    const onSignup = vi.fn().mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    render(
      <SignupForm onSignup={onSignup} onSuccess={onSuccess} isLoading={false} />
    );
    await user.type(screen.getByLabelText(/email/i), "user@test.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => {
      expect(onSignup).toHaveBeenCalledWith({
        email: "user@test.com",
        password: "password123",
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("shows error alert when server error is provided", () => {
    const error = { message: "Email is already in use" };
    render(
      <SignupForm onSignup={noop} onSuccess={vi.fn()} isLoading={false} error={error} />
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
