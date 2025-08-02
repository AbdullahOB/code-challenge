import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './sumImplementations';
import { describe, test, expect } from '@jest/globals';
describe('Sum to N Implementations', () => {
    const implementations = [
        { name: 'sum_to_n_a (Formula)', fn: sum_to_n_a },
        { name: 'sum_to_n_b (Iterative)', fn: sum_to_n_b },
        { name: 'sum_to_n_c (Array-Functional)', fn: sum_to_n_c }
    ];

    // Test each implementation
    implementations.forEach(({ name, fn }) => {
        describe(name, () => {
            test('should return 15 for n=5', () => {
                expect(fn(5)).toBe(15);
            });

            test('should return 55 for n=10', () => {
                expect(fn(10)).toBe(55);
            });

            test('should return 1 for n=1', () => {
                expect(fn(1)).toBe(1);
            });

            test('should return 0 for n=0', () => {
                expect(fn(0)).toBe(0);
            });

            test('should return 0 for negative numbers', () => {
                expect(fn(-5)).toBe(0);
                expect(fn(-1)).toBe(0);
            });

            test('should handle large numbers correctly', () => {
                expect(fn(100)).toBe(5050);
                expect(fn(1000)).toBe(500500);
            });
        });
    });

    // Cross-implementation consistency tests
    describe('Implementation consistency', () => {
        const testValues = [0, 1, 5, 10, 50, 100, 1000];

        testValues.forEach(n => {
            test(`all implementations should return same result for n=${n}`, () => {
                const resultA = sum_to_n_a(n);
                const resultB = sum_to_n_b(n);
                const resultC = sum_to_n_c(n);

                expect(resultA).toBe(resultB);
                expect(resultB).toBe(resultC);
                expect(resultA).toBe(resultC);
            });
        });
    });

    // Performance comparison (basic)
    describe('Performance characteristics', () => {
        test('formula approach should be fastest for large numbers', () => {
            const n = 10000;

            const startA = process.hrtime.bigint();
            sum_to_n_a(n);
            const timeA = process.hrtime.bigint() - startA;

            const startB = process.hrtime.bigint();
            sum_to_n_b(n);
            const timeB = process.hrtime.bigint() - startB;

            // Formula should be significantly faster
            expect(Number(timeA)).toBeLessThan(Number(timeB));
        });
    });
});