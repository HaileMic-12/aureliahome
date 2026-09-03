import { describe, expect, it } from "vitest";
import {
  calculateBookingTotal,
  calculateNights,
  makeReference,
} from "./booking";

describe("booking calculations", () => {
  it("calculates consecutive nights and rejects invalid dates", () => {
    expect(calculateNights("2026-09-01", "2026-09-04")).toBe(3);
    expect(calculateNights("2026-09-04", "2026-09-01")).toBe(0);
    expect(calculateNights("", "2026-09-01")).toBe(0);
  });

  it("adds selected extras exactly once", () => {
    expect(
      calculateBookingTotal({
        roomPrice: 245,
        nights: 2,
        adults: 2,
        breakfastSelected: true,
        airportTransferSelected: true,
        breakfastPerAdult: 22,
        airportTransferPrice: 65,
      }),
    ).toEqual({
      roomTotal: 490,
      breakfastTotal: 88,
      transferTotal: 65,
      total: 643,
    });
  });

  it("makes stable customer-facing references from Firestore ids", () => {
    expect(makeReference("STAY", "a1b2c3d4e5f6")).toBe("STAY-A1B2C3D4");
  });
});
