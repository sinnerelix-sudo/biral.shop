export function formatAznFromQepik(amountQepik: number): string {
  return (amountQepik / 100).toFixed(2);
}
