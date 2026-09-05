import { DefaultMoneyStrategy } from '@vendure/core';

/**
 * COP has no cents in practice, and Wompi rejects any `amount_in_cents` that does not
 * end in `00`. Rounding here makes `order.totalWithTax` payable as-is, instead of
 * adjusting it at the payment handler and leaving the order total out of sync with the
 * amount charged. See ADR-010.
 */
export class CopMoneyStrategy extends DefaultMoneyStrategy {
    override round(value: number, quantity = 1): number {
        return Math.round((value * quantity) / 100) * 100;
    }
}
