import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("home page", () => {
  it("does not show hero question-bank summary labels", () => {
    const textNodes = collectTextNodes(Home());

    expect(textNodes).not.toContain("題庫");
    expect(textNodes).not.toContain("題庫組");
    expect(textNodes).not.toContain("考試類型");
  });
});

function collectTextNodes(node: ReactNode): string[] {
  if (typeof node === "string" || typeof node === "number") {
    return [String(node)];
  }

  if (Array.isArray(node)) {
    return node.flatMap((child) => collectTextNodes(child));
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return collectTextNodes(node.props.children);
  }

  return [];
}
