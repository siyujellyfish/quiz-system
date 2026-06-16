import { describe, expect, it } from "vitest";

import { productCopy } from "./product-copy";

describe("product copy", () => {
  it("uses a generic product title instead of naming CSA v2 as the app", () => {
    expect(productCopy.title).toBe("刷題系統");
    expect(productCopy.eyebrow).toBe("Quiz Console");
    expect(productCopy.description).not.toContain("CSA v2");
  });
});
