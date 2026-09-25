// Whole-euro amounts in words, for the "(Três mil e setecentos euros)" line under
// an artwork's price. Cents are ignored — artwork prices are whole euros.

const PT_UNITS = [
  'zero',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
  'dez',
  'onze',
  'doze',
  'treze',
  'catorze',
  'quinze',
  'dezasseis',
  'dezassete',
  'dezoito',
  'dezanove',
];
const PT_TENS = [
  '',
  '',
  'vinte',
  'trinta',
  'quarenta',
  'cinquenta',
  'sessenta',
  'setenta',
  'oitenta',
  'noventa',
];
const PT_HUNDREDS = [
  '',
  'cento',
  'duzentos',
  'trezentos',
  'quatrocentos',
  'quinhentos',
  'seiscentos',
  'setecentos',
  'oitocentos',
  'novecentos',
];

/** 0–999 in Portuguese. */
function ptBelowThousand(n: number): string {
  if (n === 100) return 'cem';
  if (n < 20) return PT_UNITS[n];
  if (n < 100) {
    const unit = n % 10;
    return unit ? `${PT_TENS[Math.floor(n / 10)]} e ${PT_UNITS[unit]}` : PT_TENS[n / 10];
  }
  const rest = n % 100;
  const hundreds = PT_HUNDREDS[Math.floor(n / 100)];
  return rest ? `${hundreds} e ${ptBelowThousand(rest)}` : hundreds;
}

function ptWords(n: number): string {
  if (n < 1000) return ptBelowThousand(n);

  const groups: { value: number; singular: string; plural: string }[] = [
    { value: Math.floor(n / 1_000_000), singular: 'um milhão', plural: 'milhões' },
    { value: Math.floor((n % 1_000_000) / 1000), singular: 'mil', plural: 'mil' },
    { value: n % 1000, singular: '', plural: '' },
  ];

  const parts: string[] = [];
  for (const { value, singular, plural } of groups) {
    if (!value) continue;
    if (!singular) parts.push(ptBelowThousand(value));
    else if (value === 1) parts.push(singular);
    else parts.push(`${ptBelowThousand(value)} ${plural}`);
  }

  // Portuguese joins the last group with "e" when it is below 100 or a round hundred.
  const last = n % 1000;
  if (parts.length > 1 && last > 0 && (last < 100 || last % 100 === 0)) {
    const tail = parts.pop();
    return `${parts.join(' ')} e ${tail}`;
  }
  return parts.join(' ');
}

const EN_UNITS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];
const EN_TENS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];

function enBelowThousand(n: number): string {
  if (n < 20) return EN_UNITS[n];
  if (n < 100) {
    const unit = n % 10;
    return unit ? `${EN_TENS[Math.floor(n / 10)]}-${EN_UNITS[unit]}` : EN_TENS[n / 10];
  }
  const rest = n % 100;
  const hundreds = `${EN_UNITS[Math.floor(n / 100)]} hundred`;
  return rest ? `${hundreds} and ${enBelowThousand(rest)}` : hundreds;
}

function enWords(n: number): string {
  const groups: [number, string][] = [
    [Math.floor(n / 1_000_000), 'million'],
    [Math.floor((n % 1_000_000) / 1000), 'thousand'],
    [n % 1000, ''],
  ];
  const parts = groups
    .filter(([value]) => value)
    .map(([value, scale]) => [enBelowThousand(value), scale].filter(Boolean).join(' '));
  return parts.length ? parts.join(' ') : 'zero';
}

/** 3700 → "Três mil e setecentos euros" / "Three thousand seven hundred euros". */
export function euroAmountInWords(amount: number, lng: string): string {
  const n = Math.floor(Math.abs(amount));
  const words = lng === 'en' ? enWords(n) : ptWords(n);
  const currency =
    n === 1 ? 'euro' : lng !== 'en' && n >= 1_000_000 && n % 1_000_000 === 0 ? 'de euros' : 'euros';
  const text = `${words} ${currency}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
