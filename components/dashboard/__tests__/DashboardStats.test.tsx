import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { HABIT_WEEKLY_STATS_QUERY } from "@/graphql/operations";
import DashboardPage from "@/app/(protected)/dashboard/page";
import { todayUTC, daysAgoUTC } from "@/lib/format-date";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/dashboard",
}));

// Mock format-date so dates are stable in tests
vi.mock("@/lib/format-date", () => ({
  todayUTC: () => "2024-04-07",
  daysAgoUTC: (n: number) => {
    const base = new Date("2024-04-07T00:00:00Z");
    base.setUTCDate(base.getUTCDate() - n);
    return base.toISOString().slice(0, 10);
  },
  formatShortDate: (d: string) => d,
}));

const from = daysAgoUTC(6);
const to = todayUTC();

const mockHabits = [
  {
    id: "1",
    title: "Morning run",
    isActive: true,
    currentStreak: 5,
    weeklyStats: {
      dates: ["2024-04-01", "2024-04-02", "2024-04-03", "2024-04-04", "2024-04-05", "2024-04-06", "2024-04-07"],
      counts: [1, 1, 1, 0, 1, 1, 0],
    },
  },
];

const successMock = {
  request: {
    query: HABIT_WEEKLY_STATS_QUERY,
    variables: { from, to },
  },
  result: { data: { habits: mockHabits } },
};

const errorMock = {
  request: {
    query: HABIT_WEEKLY_STATS_QUERY,
    variables: { from, to },
  },
  error: new Error("Network error"),
};

describe("DashboardPage", () => {
  it("shows loading spinner initially", () => {
    render(
      <MockedProvider mocks={[successMock]}>
        <DashboardPage />
      </MockedProvider>
    );
    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
  });

  it("renders stats cards on success", async () => {
    render(
      <MockedProvider mocks={[successMock]}>
        <DashboardPage />
      </MockedProvider>
    );
    expect(await screen.findByText(/active habits/i)).toBeInTheDocument();
    expect(await screen.findByText(/best current streak/i)).toBeInTheDocument();
    expect(await screen.findByText(/check-ins this week/i)).toBeInTheDocument();
  });

  it("shows correct streak value", async () => {
    render(
      <MockedProvider mocks={[successMock]}>
        <DashboardPage />
      </MockedProvider>
    );
    expect(await screen.findByText("5d")).toBeInTheDocument();
  });

  it("shows error state on network failure", async () => {
    render(
      <MockedProvider mocks={[errorMock]}>
        <DashboardPage />
      </MockedProvider>
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
