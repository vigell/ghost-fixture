import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatCents,
  qualifiesForBulkDiscount,
  subtotalCents,
  totalCents,
  totalQuantity,
  type LineItem,
} from "../src/pricing.ts";

const item = (quantity: number, unitPriceCents = 100): LineItem => ({
  sku: `SKU-${quantity}`,
  unitPriceCents,
  quantity,
});

describe("subtotalCents", () => {
  it("returns 0 for an empty order", () => {
    assert.equal(subtotalCents([]), 0);
  });

  it("sums price times quantity across items", () => {
    assert.equal(subtotalCents([item(2, 250), item(3, 100)]), 800);
  });
});

describe("totalQuantity", () => {
  it("sums quantities across items", () => {
    assert.equal(totalQuantity([item(4), item(5)]), 9);
  });
});

describe("bulk discount", () => {
  it("does not apply below the threshold", () => {
    assert.equal(qualifiesForBulkDiscount([item(9)]), false);
    assert.equal(totalCents([item(9)]), 900);
  });

  it("applies above the threshold", () => {
    assert.equal(qualifiesForBulkDiscount([item(11)]), true);
    assert.equal(totalCents([item(11)]), 990);
  });

  // Documented requirement (see README): orders of AT LEAST 10 units qualify.
  it("applies at exactly the threshold", () => {
    assert.equal(qualifiesForBulkDiscount([item(4), item(6)]), true);
    assert.equal(totalCents([item(4), item(6)]), 900);
  });
});

describe("totalCents validation", () => {
  it("rejects negative prices", () => {
    assert.throws(() => totalCents([item(1, -1)]), RangeError);
  });

  it("rejects non-positive quantities", () => {
    assert.throws(() => totalCents([item(0)]), RangeError);
  });
});

describe("formatCents", () => {
  it("formats whole and fractional amounts", () => {
    assert.equal(formatCents(0), "$0.00");
    assert.equal(formatCents(5), "$0.05");
    assert.equal(formatCents(12345), "$123.45");
    assert.equal(formatCents(-250), "-$2.50");
  });
});
