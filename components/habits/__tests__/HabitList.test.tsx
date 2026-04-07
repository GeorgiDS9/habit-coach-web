import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HabitList } from "../HabitList";
import type { Habit } from "@/types/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/habits",
}));

const makeHabit = (overrides: Partial<Habit> = {}): Habit => ({
  id: "1",
  title: "Morning run",
  description: null,
  isActive: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  currentStreak: 3,
  ...overrides,
});

describe("HabitList", () => {
  const noop = async () => {};

  it("shows spinner when loading with no habits", () => {
    render(
      <HabitList
        habits={[]}
        loading={true}
        onToggleActive={noop}
        isToggling={false}
      />
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows empty state when no habits exist", () => {
    render(
      <HabitList
        habits={[]}
        loading={false}
        onToggleActive={noop}
        isToggling={false}
      />
    );
    expect(screen.getByText(/no habits yet/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    render(
      <HabitList
        habits={[]}
        loading={false}
        error={new Error("Network error")}
        onToggleActive={noop}
        isToggling={false}
      />
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders habit titles", () => {
    const habits = [
      makeHabit({ id: "1", title: "Morning run" }),
      makeHabit({ id: "2", title: "Read 30 min", currentStreak: 0 }),
    ];
    render(
      <HabitList
        habits={habits}
        loading={false}
        onToggleActive={noop}
        isToggling={false}
      />
    );
    expect(screen.getByText("Morning run")).toBeInTheDocument();
    expect(screen.getByText("Read 30 min")).toBeInTheDocument();
  });

  it("shows streak badge when streak > 0", () => {
    render(
      <HabitList
        habits={[makeHabit({ currentStreak: 5 })]}
        loading={false}
        onToggleActive={noop}
        isToggling={false}
      />
    );
    expect(screen.getByText(/5 day streak/i)).toBeInTheDocument();
  });

  it("calls onToggleActive when pause button is clicked", async () => {
    const user = userEvent.setup();
    const onToggleActive = vi.fn().mockResolvedValue(undefined);
    render(
      <HabitList
        habits={[makeHabit({ id: "1", isActive: true })]}
        loading={false}
        onToggleActive={onToggleActive}
        isToggling={false}
      />
    );
    await user.click(screen.getByRole("button", { name: /pause habit/i }));
    expect(onToggleActive).toHaveBeenCalledWith("1", false);
  });
});
