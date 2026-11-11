'use client';

import { useCallback, useState } from 'react';
import { LuCheck, LuShare2 } from 'react-icons/lu';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Button } from '@/components/ui/button';

type Props = {
  label: string;
};

export const ShareButton = ({ label }: Props) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'crowdfunding');
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = document.title;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // The user dismissed the share sheet, or clipboard access was denied.
    }
  }, []);

  return (
    <Button type='button' variant='crowdfunding-outline' size='xl' onClick={handleShare}>
      {copied ? <LuCheck aria-hidden='true' /> : <LuShare2 aria-hidden='true' />}
      <span aria-live='polite'>{copied ? t('share.copied') : label}</span>
    </Button>
  );
};

export default ShareButton;
