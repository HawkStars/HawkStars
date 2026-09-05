/* ================================================================== */
/*  Helper: format number with locale (e.g. 38064 → 38064,00)        */
/* ================================================================== */
function formatCurrency(amount: number, lng?: string): string {
  const lngToUse = lng === undefined ? 'pt-PT' : lng === 'pt' ? 'pt-PT' : 'en-US';
  return amount.toLocaleString(lngToUse, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'EUR',
  });
}

export { formatCurrency };
