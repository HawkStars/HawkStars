/* ================================================================== */
/*  Helper: format number with locale (e.g. 38064 → 38064,00)        */
/* ================================================================== */
function formatCurrency(amount: number): string {
  return amount.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export { formatCurrency };
