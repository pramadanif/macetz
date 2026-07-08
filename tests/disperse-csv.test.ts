import { describe, it, expect } from "vitest";
import { parseRecipientCsv, DISPERSE_SINGLETON_SEPOLIA } from "@/lib/disperse";

describe("parseRecipientCsv", () => {
  it("parses valid rows, skips the header, and drops junk lines", () => {
    const rows = parseRecipientCsv(
      "address,amount\n0xAbC12345678901234567890123456789012345678,10.5\ninvalid-line\n0xDeF12345678901234567890123456789012345678,2"
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]?.amount).toBe("10.5");
    expect(rows[1]?.address).toBe("0xDeF12345678901234567890123456789012345678");
  });

  it("accepts comma, semicolon, and tab separators", () => {
    const rows = parseRecipientCsv(
      "0x1111111111111111111111111111111111111111;1\n0x2222222222222222222222222222222222222222\t2"
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]?.amount).toBe("1");
    expect(rows[1]?.amount).toBe("2");
  });

  it("returns an empty array for empty or header-only input", () => {
    expect(parseRecipientCsv("")).toEqual([]);
    expect(parseRecipientCsv("address,amount")).toEqual([]);
  });
});

describe("DISPERSE_SINGLETON_SEPOLIA", () => {
  it("is a checksummed 20-byte address", () => {
    expect(DISPERSE_SINGLETON_SEPOLIA).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });
});
