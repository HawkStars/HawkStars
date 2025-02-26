'use client';

// import { useLanguageCookie } from '@/hooks/useLanguageCookie';

import { transformUrl, urls } from '@/utils/paths';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { MenuSections } from '../navbar/config';
import Button from '../utils/Button';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

const FooterMenu = () => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();

  return (
    <>
      {MenuSections.map((section, index) => {
        if (section.type === 'dropdown') {
          const { title, options } = section;
          return (
            <div key={index} className='text-terciary-100 ml-0 text-left lg:text-left'>
              <h3 className='lg: lg: mb-1 text-base lg:mb-3'>
                <Suspense fallback={title}>{t(title)}</Suspense>
              </h3>
              {options.map((option, index) => (
                <div className='py-1' key={index}>
                  <Suspense fallback={option.label}>
                    <Link
                      href={transformUrl(lng, option.url || urls.home)}
                      className={classNames('text-body_regular', {
                        'text-disabled': option.disabled,
                      })}
                    >
                      {t(option.label)}
                    </Link>
                  </Suspense>
                </div>
              ))}
            </div>
          );
        }
      })}

      <div className='flex flex-col lg:hidden'>
        {/* <Link
            href={BE_MEMBER_FORM_URL}
            target='_blank'
            className='mb-2  '
          >
            <Suspense>{t('common.be_member')}</Suspense>
          </Link> */}
        <Button
          type={'button'}
          variant='success'
          onClick={() => {
            router.push(urls.donate);
          }}
        >
          <Suspense>{t('common.donate')}</Suspense>
        </Button>
      </div>
    </>
  );
};

export default FooterMenu;
