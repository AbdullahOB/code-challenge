/**
 * Three different implementations of sum to n function
 * Each approach demonstrates different programming paradigms and performance characteristics
 */

/**
 * Implementation A: Mathematical formula approach
 * Uses the arithmetic sequence sum formula: n(n+1)/2
 * Time complexity: O(1), Space complexity: O(1)
 */
const sum_to_n_a = function (n: number): number {
    // Handle edge cases
    if (n <= 0) return 0;

    // Use the mathematical formula for sum of first n natural numbers
    return (n * (n + 1)) / 2;
};

/**
 * Implementation B: Iterative approach
 * Uses a simple for loop to accumulate the sum
 * Time complexity: O(n), Space complexity: O(1)
 */
const sum_to_n_b = function (n: number): number {
    // Handle edge cases
    if (n <= 0) return 0;

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
};

/**
 * Implementation C: Array-based functional approach
 * Uses Array.from with reduce for a functional programming style
 * Time complexity: O(n), Space complexity: O(n) for the array
 */
const sum_to_n_c = function (n: number): number {
    // Handle edge cases
    if (n <= 0) return 0;

    // Create array [1, 2, 3, ..., n] and reduce to sum
    // This avoids call stack issues while maintaining functional style
    return Array.from({ length: n }, (_, i) => i + 1)
        .reduce((sum, current) => sum + current, 0);
};

export {
    sum_to_n_a,
    sum_to_n_b,
    sum_to_n_c
};