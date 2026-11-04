'use client';

import { useState } from 'react';
import type { IconType } from 'react-icons';
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { LuCheck, LuLink } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';

type NewsShareBarProps = {
  url: string;
  title: string;
  lng: Language;
};

type Network = { name: string; icon: IconType; href: (url: string, title: string) => string };

const NETWORKS: Network[] = [
  {
    name: 'Facebook',
    icon: FaFacebookF,
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'LinkedIn',
    icon: FaLinkedinIn,
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'WhatsApp',
    icon: FaWhatsapp,
    href: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
];

/** Share links under a news article, plus a copy-link button. */
const NewsShareBar = ({ url, title, lng }: NewsShareBarProps) => {
  const { t } = useTranslation(lng, 'common');
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can be blocked (permissions, insecure context): the share links still work.
    }
  };

  return (
    <div className='border-bege-dark flex flex-wrap items-center gap-3 border-t pt-6'>
      <span className='text-eyebrow text-green mr-1'>{t('article.share')}</span>
      {NETWORKS.map(({ name, icon: Icon, href }) => (
        <Button key={name} asChild variant='outline' size='icon' className='rounded-full'>
          <a
            href={href(url, title)}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={t('article.shareOn', { network: name })}
          >
            <Icon aria-hidden='true' />
          </a>
        </Button>
      ))}
      <Button type='button' variant='outline' className='rounded-full' onClick={copyLink}>
        {copied ? <LuCheck aria-hidden='true' /> : <LuLink aria-hidden='true' />}
        {/* aria-live so screen readers hear the confirmation */}
        <span aria-live='polite'>{copied ? t('article.linkCopied') : t('article.copyLink')}</span>
      </Button>
    </div>
  );
};

export default NewsShareBar;
