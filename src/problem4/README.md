# Sum to N - Three Implementations

This project demonstrates three different approaches to implementing a function that calculates the sum of integers from 1 to n.

## Problem Statement

Implement a function that calculates: `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`

## Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the demonstration
npm start

# Run in development mode
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

## Three Implementations

### Implementation A: Mathematical Formula
- **Approach**: Uses the arithmetic sequence sum formula `n(n+1)/2`
- **Time Complexity**: O(1)
- **Space Complexity**: O(1)
- **Best for**: Large values of n, performance-critical applications

### Implementation B: Iterative Loop
- **Approach**: Simple for loop accumulating the sum
- **Time Complexity**: O(n)
- **Space Complexity**: O(1)
- **Best for**: Readable code, moderate values of n

### Implementation C: Array-Based Functional Approach
- **Approach**: Creates an array [1,2,3,...,n] and uses reduce to sum
- **Time Complexity**: O(n)
- **Space Complexity**: O(n) for the array
- **Best for**: Functional programming style, avoiding call stack limits

## Performance Comparison

The mathematical formula (Implementation A) is the most efficient, especially for large values of n. The iterative approach (Implementation B) is more readable and has constant space complexity. The array-functional approach (Implementation C) demonstrates functional programming concepts without call stack limitations.

## Edge Cases Handled

- `n = 0`: Returns 0
- `n < 0`: Returns 0 
- `n = 1`: Returns 1
- Large values of n (within `Number.MAX_SAFE_INTEGER`)

## File Structure

```
├── src/
│   ├── index.ts                 # Main demonstration file
│   ├── sumImplementations.ts    # Three implementations
│   └── sumImplementations.test.ts # Comprehensive tests
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```