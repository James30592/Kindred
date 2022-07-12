// Clamp number between two values.
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// For testing long running functions.
await new Promise(resolve => setTimeout(resolve, 5000));