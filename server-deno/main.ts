export function add(a: number, b: number): number {
  return a + b;
}

// @ts-ignore
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}
