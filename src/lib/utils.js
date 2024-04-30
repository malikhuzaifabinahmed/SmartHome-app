import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export function objectsPresentInAOnly(A, B) {
  // Create a map to store objects in array B
  const mapB = new Map();
  for (const obj of B) {
    const key = JSON.stringify(obj);
    mapB.set(key, true);
  }

  // Filter array A to get objects present only in A
  const result = A.filter(obj => {
    const key = JSON.stringify(obj);
    return !mapB.has(key);
  });

  return result;
}
