'use client';

import { Gutter, useStepNav } from '@payloadcms/ui';
import { useEffect, useState } from 'react';

type Direction = 'pt-en' | 'en-pt';
type TranslateProps = { from: string; to: string; fromLocale: string; toLocale: string };

const DIRECTION_LABELS: Record<Direction, TranslateProps> = {
  'pt-en': { from: 'Português', to: 'English', fromLocale: 'pt', toLocale: 'en' },
  'en-pt': { from: 'English', to: 'Português', fromLocale: 'en', toLocale: 'pt' },
};

/**
 * Interactive PT <-> EN machine translation widget. Rendered as the body of
 * the TranslateView root admin view (see ./index.tsx), which handles the
 * server-side DefaultTemplate/nav chrome. Backed by the same /api/translate
 * endpoint used by the per-field "Traduzir do PT" button (see
 * payload/fields/translateInput.tsx), but usable for any free text.
 */
export default function TranslateWidget() {
  const { setStepNav } = useStepNav();

  const [direction, setDirection] = useState<Direction>('pt-en');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setStepNav([{ label: 'Traduzir PT ⇄ EN' }]);
  }, [setStepNav]);

  const { from, to, fromLocale, toLocale } = DIRECTION_LABELS[direction];

  const handleSwap = () => {
    setDirection((current) => (current === 'pt-en' ? 'en-pt' : 'pt-en'));
    setSourceText(translatedText);
    setTranslatedText('');
    setStatus('idle');
  };

  const handleTranslate = async () => {
    const text = sourceText.trim();
    if (!text) return;

    setStatus('loading');
    setCopied(false);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text, from: fromLocale, to: toLocale }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as { translation?: string };
      if (typeof data.translation === 'string') {
        setTranslatedText(data.translation);
        setStatus('idle');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable; ignore silently.
    }
  };

  return (
    <Gutter className='flex flex-col gap-6 pb-8'>
      <header className='flex flex-col gap-2'>
        <h1 className='m-0 text-2xl font-semibold'>Traduzir PT ⇄ EN</h1>
        <p className='text-muted-foreground m-0 text-sm'>
          Tradução automática rápida entre Português e Inglês. Cola o texto, traduz e revê antes de
          usar &mdash; nada é guardado automaticamente.
        </p>
      </header>

      <div className='flex flex-wrap items-center gap-3'>
        <span className='rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-600'>
          {from}
        </span>
        <button
          type='button'
          onClick={handleSwap}
          title='Trocar direção'
          className='rounded-md border border-zinc-300 px-3 py-1.5 text-sm transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800'
        >
          ⇄
        </button>
        <span className='rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-600'>
          {to}
        </span>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='translate-source' className='text-sm font-medium'>
            {from}
          </label>
          <textarea
            id='translate-source'
            value={sourceText}
            onChange={(event) => setSourceText(event.target.value)}
            rows={12}
            placeholder={`Escreve ou cola o texto em ${from}...`}
            className='w-full resize-y rounded-md border border-zinc-300 bg-white p-3 text-sm dark:border-zinc-600 dark:bg-zinc-900'
          />
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-xs'>{sourceText.length} / 20000</span>
            <button
              type='button'
              onClick={handleTranslate}
              disabled={status === 'loading' || !sourceText.trim()}
              className='rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {status === 'loading' ? 'A traduzir…' : `Traduzir para ${to}`}
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='translate-target' className='text-sm font-medium'>
            {to}
          </label>
          <textarea
            id='translate-target'
            value={translatedText}
            onChange={(event) => setTranslatedText(event.target.value)}
            rows={12}
            placeholder='A tradução aparece aqui — podes editá-la antes de copiar.'
            className='w-full resize-y rounded-md border border-zinc-300 bg-white p-3 text-sm dark:border-zinc-600 dark:bg-zinc-900'
          />
          <div className='flex items-center justify-between'>
            {status === 'error' ? (
              <span className='text-xs text-red-600'>Falha na tradução. Tenta novamente.</span>
            ) : (
              <span />
            )}
            <button
              type='button'
              onClick={handleCopy}
              disabled={!translatedText}
              className='rounded-md border border-zinc-300 px-4 py-2 text-sm transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:hover:bg-zinc-800'
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>
    </Gutter>
  );
}
