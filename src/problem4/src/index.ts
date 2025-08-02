import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './sumImplementations';

/**
 * Performance testing function with error handling
 */
function performanceTest(fn: (n: number) => number, name: string, n: number): void {
    try {
        const start = process.hrtime.bigint();
        const result = fn(n);
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000; // Convert to milliseconds

        console.log(`${name}: sum_to_n(${n}) = ${result} (${duration.toFixed(3)}ms)`);
    } catch (error) {
        console.log(`${name}: ERROR - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Main execution
 */
function main(): void {
    console.log('Sum to N - 3 different implemntations\n');

    // Test cases
    const testCases = [5, 10, 100, 1000, 10000];

    testCases.forEach(n => {
        console.log(`\n--- Testing with n = ${n} ---`);
        performanceTest(sum_to_n_a, 'Formula (A)', n);
        performanceTest(sum_to_n_b, 'Iterative (B)', n);
        performanceTest(sum_to_n_c, 'Array-Functional (C)', n);
    });

    // Edge case testing
    console.log('\n--- Edge Cases ---');
    console.log(`sum_to_n_a(0) = ${sum_to_n_a(0)}`);
    console.log(`sum_to_n_a(-5) = ${sum_to_n_a(-5)}`);
    console.log(`sum_to_n_a(1) = ${sum_to_n_a(1)}`);
}

// Only run if this file is executed directly
if (require.main === module) {
    main();
}