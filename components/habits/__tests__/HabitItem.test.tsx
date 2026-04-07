import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HabitItem } from "../HabitItem";

const mockHabit = {
  id: "1",
  title: "Exercise",
  description: "Work out for 30 mins",
  isActive: true,
  createdAt: "2023-01-01T00:00:00Z",
  currentStreak: 5,
};

describe("HabitItem", () => {
  const user = userEvent.setup();

  it("renders habit details correctly", () => {
    render(
      <HabitItem habit={mockHabit} onToggleActive={vi.fn()} isToggling={false} />
    );
    expect(screen.getByText("Exercise")).toBeInTheDocument();
    expect(screen.getByText("Work out for 30 mins")).toBeInTheDocument();
    expect(screen.getByText(/5 day streak/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
  });

  it("calls onToggleActive when button is clicked", async () => {
    const onToggle = vi.fn().mockResolvedValue(undefined);
    render(
      <HabitItem habit={mockHabit} onToggleActive={onToggle} isToggling={false} />
    );
    await user.click(screen.getByRole("button", { name: /pause/i }));
    expect(onToggle).toHaveBeenCalledWith("1", false);
  });

  it("shows Resume button when habit is inactive", () => {
    const inactiveHabit = { ...mockHabit, isActive: false };
    render(
      <HabitItem habit={inactiveHabit} onToggleActive={vi.fn()} isToggling={false} />
    );
    expect(screen.getByText(/paused/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resume/i })).toBeInTheDocument();
  });

  it("shows loading spinner inside toggle button while toggling", () => {
      // Button component shows "isLoading" state
    render(
      <HabitItem habit={mockHabit} onToggleActive={vi.fn()} isToggling={true} />
    );
    // Button component should have loading state (usually a spinner or disabled)
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
