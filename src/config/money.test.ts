import { describe, expect, it } from 'vitest';
import { CopMoneyStrategy } from './money';

describe('CopMoneyStrategy', () => {
    const strategy = new CopMoneyStrategy();

    it.each([
        // $12.500 with 19% tax: already payable.
        [1487500, 1, 1487500],
        // The same total with a 10% promotion, which the default strategy leaves at 1338750.
        [1338750, 1, 1338800],
        // A 1% promotion.
        [1472625, 1, 1472600],
        // Quantity multiplies before rounding, as in DefaultMoneyStrategy.
        [148750, 3, 446300],
        // Promotion adjustments are negative.
        [-148750, 1, -148700],
    ])('rounds (%i, %i) to %i', (value, quantity, expected) => {
        expect(strategy.round(value, quantity)).toBe(expected);
    });

    it('defaults quantity to 1', () => {
        expect(strategy.round(1338750)).toBe(1338800);
    });

    it('always returns a multiple of 100, which is what Wompi requires', () => {
        for (let value = -5000; value <= 5000; value += 7) {
            for (const quantity of [1, 2, 3, 11]) {
                // Math.abs collapses the -0 that negative values produce.
                expect(Math.abs(strategy.round(value, quantity) % 100)).toBe(0);
            }
        }
    });
});
