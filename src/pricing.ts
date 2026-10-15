export interface LineItem {
  sku: string;
  unitPriceCents: number;
  quantity: number;
}

/** Orders with at least this many units in total get the bulk discount. */
export const BULK_THRESHOLD = 10;

/** Bulk discount in percent. */
export const BULK_DISCOUNT_PERCENT = 10;

export function subtotalCents(items: readonly LineItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
}

export function totalQuantity(items: readonly LineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function qualifiesForBulkDiscount(items: readonly LineItem[]): boolean {
  return totalQuantity(items) > BULK_THRESHOLD;
}

export function totalCents(items: readonly LineItem[]): number {
  for (const item of items) {
    if (!Number.isInteger(item.unitPriceCents) || item.unitPriceCents < 0) {
      throw new RangeError(`Invalid unit price for ${item.sku}`);
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new RangeError(`Invalid quantity for ${item.sku}`);
    }
  }

  const subtotal = subtotalCents(items);
  if (!qualifiesForBulkDiscount(items)) {
    return subtotal;
  }
  return Math.round((subtotal * (100 - BULK_DISCOUNT_PERCENT)) / 100);
}

export function formatCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}$${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}
