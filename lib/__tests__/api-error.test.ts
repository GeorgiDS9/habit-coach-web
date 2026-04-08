import { describe, it, expect } from "vitest";
import { extractErrorMessage } from "../api-error";

describe("extractErrorMessage", () => {
  it("returns fallback for null/undefined", () => {
    expect(extractErrorMessage(null)).toBe("An unexpected error occurred.");
    expect(extractErrorMessage(undefined)).toBe("An unexpected error occurred.");
  });

  it("maps UNAUTHENTICATED extension code to friendly message", () => {
    const err = {
      cause: [{ extensions: { code: "UNAUTHENTICATED" } }],
    };
    expect(extractErrorMessage(err)).toBe(
      "Your session has expired. Please log in again."
    );
  });

  it("maps BAD_USER_INPUT extension code to friendly message", () => {
    const err = {
      cause: [{ extensions: { code: "BAD_USER_INPUT" } }],
    };
    expect(extractErrorMessage(err)).toBe(
      "Invalid input. Please check your details and try again."
    );
  });

  it("maps NOT_FOUND extension code to friendly message", () => {
    const err = {
      cause: [{ extensions: { code: "NOT_FOUND" } }],
    };
    expect(extractErrorMessage(err)).toBe(
      "The requested resource was not found."
    );
  });

  it("maps FORBIDDEN extension code to friendly message", () => {
    const err = {
      cause: [{ extensions: { code: "FORBIDDEN" } }],
    };
    expect(extractErrorMessage(err)).toBe(
      "You do not have permission to perform this action."
    );
  });

  it("falls back to first error message when code is unknown", () => {
    const err = {
      cause: [{ message: "Something specific happened", extensions: { code: "UNKNOWN_CODE" } }],
    };
    expect(extractErrorMessage(err)).toBe("Something specific happened");
  });

  it("falls back to top-level message for network errors", () => {
    const err = { message: "Failed to fetch" };
    expect(extractErrorMessage(err)).toBe(
      "Cannot reach the server. Please check your connection."
    );
  });

  it("falls back to top-level message for non-network errors", () => {
    const err = { message: "Some other error" };
    expect(extractErrorMessage(err)).toBe("Some other error");
  });

  it("returns fallback for oversized messages", () => {
    const err = { message: "x".repeat(201) };
    expect(extractErrorMessage(err)).toBe(
      "An unexpected error occurred. Please try again."
    );
  });

  it("uses first cause when cause array has multiple errors", () => {
    const err = {
      cause: [
        { extensions: { code: "UNAUTHENTICATED" } },
        { extensions: { code: "BAD_USER_INPUT" } },
      ],
    };
    expect(extractErrorMessage(err)).toBe(
      "Your session has expired. Please log in again."
    );
  });
});
