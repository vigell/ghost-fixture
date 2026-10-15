import { formatCents, totalCents, type LineItem } from "./pricing.ts";

const order: LineItem[] = [
  { sku: "NOTEBOOK", unitPriceCents: 450, quantity: 6 },
  { sku: "PEN", unitPriceCents: 120, quantity: 4 },
];

console.log(`Order total: ${formatCents(totalCents(order))}`);
