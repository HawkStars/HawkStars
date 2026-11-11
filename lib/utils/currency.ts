const toLocale = (lng?: string) => (lng === undefined || lng === 'pt' ? 'pt-PT' : 'en-US');

/* ================================================================== */
/*  Helper: format number with locale (e.g. 38064 → 38064,00)        */
/* ================================================================== */
function formatCurrency(amount: number, lng?: string): string {
  return amount.toLocaleString(toLocale(lng), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'EUR',
  });
}

/* ================================================================== */
/*  Helper: whole euros, for headline figures (e.g. 9294 → 9294 €)   */
/*  Campaign totals never carry cents, and "9294,00 €" reads as noise. */
/* ================================================================== */
function formatEuro(amount: number, lng?: string): string {
  return amount.toLocaleString(toLocale(lng), {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'EUR',
  });
}

export { formatCurrency, formatEuro };
