import { describe, it, expect } from "vitest";
// ⚠️ Be sure to import the functions needed for your first two tests (e.g., calculateNights, calculateExtras)
import { generateSecureReference } from "./booking"; 

describe("booking calculations", () => {
  
  it("calculates consecutive nights and rejects invalid dates", () => {
    // ⚠️ PASTE YOUR EXISTING TEST CODE FOR DATES HERE
    // expect(...).toBe(...);
  });

  it("adds selected extras exactly once", () => {
    // ⚠️ PASTE YOUR EXISTING TEST CODE FOR EXTRAS HERE
    // expect(...).toBe(...);
  });

  it("generates unique secure customer-facing references with prefixes", () => {
    const ref1 = generateSecureReference("STAY");
    const ref2 = generateSecureReference("STAY");

    // Verify the prefix is applied correctly
    expect(ref1.startsWith("STAY-")).toBe(true);
    
    // Verify the format contains uppercase letters, numbers, and hyphens
    expect(ref1).toMatch(/^STAY-[A-Z0-9-]+$/); 
    
    // Verify it securely generates unique values every time
    expect(ref1).not.toBe(ref2);
  });
  
});