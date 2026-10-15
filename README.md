# ghost-fixture

A small, safe TypeScript repository used as the target for **GHOST**'s first
autonomous coding execution (M3). It contains no secrets, no deployment, and
no external services.

## What it is

`src/pricing.ts` computes order totals:

- `subtotalCents` sums `unitPriceCents * quantity`.
- `totalCents` validates line items and applies a **10% bulk discount to
  orders with at least 10 units in total** (`BULK_THRESHOLD = 10`).
- `formatCents` formats cents as dollars.

`src/cli.ts` prints the total for a sample order.

## Requirements

- Node.js 22.18 or newer (runs `.ts` files directly via type stripping; CI uses Node 24)
- npm

The only dependencies are dev dependencies: `typescript` and `@types/node`.
Tests use the built-in `node:test` runner.

## Commands

```bash
npm ci
npm run typecheck
npm test
npm start
```

## The intentional defect

`main` deliberately contains **one failing test**:

```
bulk discount > applies at exactly the threshold
```

The requirement says orders of *at least* 10 units qualify, but the
implementation only discounts orders of *more than* 10 units, so an order of
exactly 10 units is charged full price. CI on `main` is therefore expected to
be **red** until the defect is fixed.

This is the task for the coding agent. A correct fix:

- changes only `src/pricing.ts`,
- makes all 9 tests pass and keeps `npm run typecheck` green,
- does not modify or delete existing tests.

Do not fix the defect directly on `main`; it exists so GHOST can open a pull
request with the fix. To reset the fixture after a run, close the PR and
delete its branch.

## CI

`.github/workflows/ci.yml` runs on pushes to `main` and on pull requests:
`npm ci`, `npm run typecheck`, `npm test`. It uses read-only `contents`
permissions and no secrets.
