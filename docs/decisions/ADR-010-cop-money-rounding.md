# ADR-010: COP Money Rounding

## Status

Accepted

## Context

Vendure stores every monetary value as an integer in minor units
(`docs/development/constraints.md` §4). Wompi receives the charge in
`amount_in_cents`, an integer in the same unit: `150000 = $1.500 COP`. The two
representations match, so `order.totalWithTax` is sent unchanged.

Wompi adds one condition Vendure does not satisfy on its own: the amount must end in
`00`. Its documentation states that amounts are only valid with two trailing zeros
([Wompi support][wompi-cents]).

`DefaultMoneyStrategy.round()` is `Math.round(value * quantity)`, which gives no such
guarantee. Round catalogue prices survive tax on their own, but a percentage promotion
does not:

```
$12.500 with 19% tax  ->  1487500
10% off               ->   148750
Total                 ->  1338750   invalid: ends in 50
```

The failure appears at checkout, in production, only for some carts. Neither the
compiler nor a test using round prices catches it.

Alternatives considered:

- **Round inside the Wompi payment handler.** Least code, but the order total and the
  amount charged then differ, which breaks reconciliation and accounting.
- **Allow only fixed-amount promotions.** No code at all, but it constrains the
  business and nothing prevents an admin from creating a percentage promotion anyway.

## Decision

The Foundation configures `entityOptions.moneyStrategy` with `CopMoneyStrategy`
(`src/config/money.ts`), a `DefaultMoneyStrategy` whose `round()` returns a multiple of
100. Every payable total is therefore valid for Wompi at the moment it is calculated,
not corrected at the payment boundary.

This is sufficient because `order.totalWithTax` is `subTotalWithTax + shippingWithTax`,
and both are sums of values that pass through `roundMoney()`, which delegates to the
configured strategy. A sum of multiples of 100 is a multiple of 100.

Excluded from this decision:

- `moneyColumnOptions` stays `int`. The ~$21.474.836 COP ceiling per value is unchanged.
- `precision` stays `2`. It is only a display hint for the Admin UI; lowering it to `0`
  would render `1250000` instead of `12.500,00`.

## Consequences

Percentage promotions, prorated discounts and shipping remain available without
producing an uncollectable total. The Wompi handler passes `order.totalWithTax` to
`amount_in_cents` with no arithmetic.

Risks accepted:

- **The tax summary does not reconcile to the peso.** `calculateTaxSummary()` uses
  `Math.round()` directly rather than the money strategy, so the VAT breakdown shown to
  the customer can differ by a few pesos from `totalWithTax - taxBase`. This affects
  DIAN electronic invoicing, not the charge.
- **Existing orders are not rewritten.** The change affects new calculations only. There
  is no schema migration, but an order placed before this ADR may hold a total Wompi
  rejects.
- **The customer pays a rounded amount**, up to 50 minor units ($0,50 COP) away from the
  discounted list price.
- **An admin can still enter `$12.500,50`.** `precision` is 2, so the catalogue price is
  stored as typed. The charge is correct because rounding happens when the order line is
  calculated, but the catalogue price misrepresents it.

[wompi-cents]: https://soporte.wompi.co/hc/es-419/articles/1500003715581-Manejo-de-los-centavos-en-los-montos
