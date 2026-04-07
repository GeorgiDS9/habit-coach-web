import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { HABITS_QUERY, HABIT_LOGS_QUERY } from "@/graphql/operations";
import HabitDetailPage from "../page";
import { todayUTC, daysAgoUTC } from "@/lib/format-date";

// Stable dates so mocked variables always match
vi.mock("@/lib/format-date", () => ({
  todayUTC: () => "2024-04-07",
  daysAgoUTC: (n: number) => {
    const base = new Date("2024-04-07T00:00:00Z");
    base.setUTCDate(base.getUTCDate() - n);
    return base.toISOString().slice(0, 10);
  },
  formatShortDate: (d: string) => d,
}));

const HABIT_ID = "habit-abc";

// Single top-level mock — useParams always returns HABIT_ID.
// The "not found" test exercises the path via an empty habits list.
vi.mock("next/navigation", () => ({
  useParams: () => ({ id: HABIT_ID }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => `/habits/${HABIT_ID}`,
}));

const from = daysAgoUTC(6);
const to = todayUTC();

const habitsMock = {
  request: { query: HABITS_QUERY },
  result: {
    data: {
      habits: [
        {
          __typename: "Habit",
          id: HABIT_ID,
          title: "Morning run",
          description: "Run 30 min",
          isActive: true,
          createdAt: "2024-01-01T00:00:00.000Z",
          currentStreak: 2,
        },
      ],
    },
  },
};

const emptyHabitsMock = {
  request: { query: HABITS_QUERY },
  result: { data: { habits: [] as any[] } },
};

const logsMock = {
  request: {
    query: HABIT_LOGS_QUERY,
    variables: { habitId: HABIT_ID, from, to },
  },
  result: { data: { habitLogs: [] as any[] } },
};

describe("HabitDetailPage", () => {
  it("shows spinner while habits are loading", () => {
    render(
      <MockedProvider mocks={[]}>
        <HabitDetailPage />
      </MockedProvider>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders habit title and check-in/history sections after loading", async () => {
    render(
      <MockedProvider mocks={[habitsMock, logsMock]}>
        <HabitDetailPage />
      </MockedProvider>
    );
    expect(await screen.findByText("Morning run")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^check-in$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^history$/i })).toBeInTheDocument();
  });

  it("shows description when present", async () => {
    render(
      <MockedProvider mocks={[habitsMock, logsMock]}>
        <HabitDetailPage />
      </MockedProvider>
    );
    expect(await screen.findByText("Run 30 min")).toBeInTheDocument();
  });

  it("shows streak when currentStreak > 0", async () => {
    render(
      <MockedProvider mocks={[habitsMock, logsMock]}>
        <HabitDetailPage />
      </MockedProvider>
    );
    await screen.findByText("Morning run");
    // Streak renders as split text nodes inside one <p> — match on full textContent
    expect(
      screen.getByText((_, el) =>
        el?.tagName === "P" && /current streak.*2/i.test(el.textContent ?? "")
      )
    ).toBeInTheDocument();
  });

  it("shows check-in instruction text", async () => {
    render(
      <MockedProvider mocks={[habitsMock, logsMock]}>
        <HabitDetailPage />
      </MockedProvider>
    );
    expect(await screen.findByText(/click a day to mark it as done/i)).toBeInTheDocument();
  });

  it("shows 7-day check-in buttons", async () => {
    render(
      <MockedProvider mocks={[habitsMock, logsMock]}>
        <HabitDetailPage />
      </MockedProvider>
    );
    await screen.findByText("Morning run");
    const checkButtons = screen.getAllByRole("button");
    expect(checkButtons.length).toBeGreaterThanOrEqual(7);
  });

  it("shows back link to habits", async () => {
    render(
      <MockedProvider mocks={[habitsMock, logsMock]}>
        <HabitDetailPage />
      </MockedProvider>
    );
    expect(await screen.findByRole("link", { name: /back to habits/i })).toBeInTheDocument();
  });

  it("shows not found only after loading completes with unknown id", async () => {
    render(
      <MockedProvider mocks={[emptyHabitsMock]}>
        <HabitDetailPage />
      </MockedProvider>
    );
    // Must not show "not found" while loading
    expect(screen.queryByText(/habit not found/i)).not.toBeInTheDocument();
    // After query settles with no matching habit, show not found
    await waitFor(() => {
      expect(screen.getByText(/habit not found/i)).toBeInTheDocument();
    });
  });
});
