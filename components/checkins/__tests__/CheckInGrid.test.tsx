import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckInGrid } from "../CheckInGrid";

// Stable today = Wednesday Apr 2
vi.mock("@/lib/format-date", () => ({
  todayUTC: () => "2024-04-02",
  daysAgoUTC: (n: number) => {
    const base = new Date("2024-04-02T00:00:00Z");
    base.setUTCDate(base.getUTCDate() - n);
    return base.toISOString().slice(0, 10);
  },
  formatShortDate: (d: string) => d,
}));

const dates = [
  "2024-03-27", // past
  "2024-03-28", // past
  "2024-03-29", // past
  "2024-03-30", // past
  "2024-04-01", // past
  "2024-04-02", // today
  "2024-04-03", // future
];

const noop = async () => {};

describe("CheckInGrid", () => {
  it("renders 7 day buttons", () => {
    render(
      <CheckInGrid
        habitId="h1"
        dates={dates}
        logs={[]}
        onLogCheckIn={noop}
        onRemoveCheckIn={noop}
        isLoading={false}
      />
    );
    expect(screen.getAllByRole("button")).toHaveLength(7);
  });

  it("future date button is disabled", () => {
    render(
      <CheckInGrid
        habitId="h1"
        dates={dates}
        logs={[]}
        onLogCheckIn={noop}
        onRemoveCheckIn={noop}
        isLoading={false}
      />
    );
    const futureBtn = screen.getByRole("button", { name: /future date/i });
    expect(futureBtn).toBeDisabled();
  });

  it("future date button has tooltip explaining it cannot be checked", () => {
    render(
      <CheckInGrid
        habitId="h1"
        dates={dates}
        logs={[]}
        onLogCheckIn={noop}
        onRemoveCheckIn={noop}
        isLoading={false}
      />
    );
    const futureBtn = screen.getByRole("button", { name: /future date/i });
    expect(futureBtn).toHaveAttribute("title", "Cannot log future check-ins");
  });

  it("clicking a future date does not call onLogCheckIn", async () => {
    const user = userEvent.setup();
    const onLogCheckIn = vi.fn();
    render(
      <CheckInGrid
        habitId="h1"
        dates={dates}
        logs={[]}
        onLogCheckIn={onLogCheckIn}
        onRemoveCheckIn={noop}
        isLoading={false}
      />
    );
    const futureBtn = screen.getByRole("button", { name: /future date/i });
    await user.click(futureBtn);
    expect(onLogCheckIn).not.toHaveBeenCalled();
  });

  it("past/today dates are enabled and call onLogCheckIn when clicked", async () => {
    const user = userEvent.setup();
    const onLogCheckIn = vi.fn().mockResolvedValue(undefined);
    render(
      <CheckInGrid
        habitId="h1"
        dates={dates}
        logs={[]}
        onLogCheckIn={onLogCheckIn}
        onRemoveCheckIn={noop}
        isLoading={false}
      />
    );
    // today button — label is "Check 2024-04-02"
    await user.click(screen.getByRole("button", { name: /check 2024-04-02/i }));
    expect(onLogCheckIn).toHaveBeenCalledWith("h1", "2024-04-02");
  });

  it("completed date calls onRemoveCheckIn when clicked", async () => {
    const user = userEvent.setup();
    const onRemoveCheckIn = vi.fn().mockResolvedValue(undefined);
    render(
      <CheckInGrid
        habitId="h1"
        dates={dates}
        logs={[{ id: "1", habitId: "h1", date: "2024-04-01", completed: true }]}
        onLogCheckIn={noop}
        onRemoveCheckIn={onRemoveCheckIn}
        isLoading={false}
      />
    );
    await user.click(screen.getByRole("button", { name: /uncheck 2024-04-01/i }));
    expect(onRemoveCheckIn).toHaveBeenCalledWith("h1", "2024-04-01");
  });

  it("shows rolling window label", () => {
    render(
      <CheckInGrid
        habitId="h1"
        dates={dates}
        logs={[]}
        onLogCheckIn={noop}
        onRemoveCheckIn={noop}
        isLoading={false}
      />
    );
    expect(screen.getByText(/rolling window/i)).toBeInTheDocument();
  });
});
