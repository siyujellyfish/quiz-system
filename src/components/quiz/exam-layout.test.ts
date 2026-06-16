import { describe, expect, it } from "vitest";

import { examPanelClassName, examSidebarClassName } from "./exam-layout";

describe("exam panel layout", () => {
  it("keeps the exam card from clipping sticky descendants", () => {
    expect(examPanelClassName).toContain("overflow-visible");
    expect(examPanelClassName).not.toContain("overflow-hidden");
  });

  it("makes the progress and submit card sticky only on large screens", () => {
    expect(examSidebarClassName).toContain("lg:sticky");
    expect(examSidebarClassName).toContain("lg:top-6");
    expect(examSidebarClassName).toContain("lg:self-start");
    expect(examSidebarClassName).not.toContain("fixed");
    expect(examSidebarClassName).not.toContain("sticky top-6");
  });
});
