'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuChevronDown } from 'react-icons/lu';
import LanguageSwitcher from '@/components/utils/LanguageSwitcher';
import HawkLinkComponent from '@/components/utils/HawkLink';
import { HeaderNavigationColumns } from '@/payload-types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie, useMainAppContext } from '@/utils/contexts/AppProvider';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import type { NavbarMenu } from '../useNavbarMenu';

/** Shared so the trigger's aria-controls and the panel's id cannot drift apart. */
export const NAVBAR_DROPDOWN_PANEL_ID = 'navbar-dropdown-panel';

type DesktopNavbarProps = {
  columns: HeaderNavigationColumns;
  menu: NavbarMenu;
  panelId?: string;
};

/** Pill shape shared by menu triggers and plain links, so both hover the same way. */
const ITEM =
  'focus-visible:ring-green flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-hidden xl:text-[0.9375rem]';

const ITEM_TONE = {
  default: { idle: 'hover:bg-white/80 hover:text-green', open: 'text-green bg-white shadow-sm' },
  erasmus: { idle: 'hover:bg-white/10', open: 'bg-white/15' },
} as const;

const DesktopNavbar: FC<DesktopNavbarProps> = ({
  columns,
  menu,
  panelId = NAVBAR_DROPDOWN_PANEL_ID,
}) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const { navbarVariant } = useMainAppContext();
  const tone = ITEM_TONE[navbarVariant === 'erasmus' ? 'erasmus' : 'default'];
  const donateHref = transformUrl(lng, SITE_GET_URLS.contribute);
  // On the contribute page the page itself carries the donate button.
  const onDonatePage = usePathname() === donateHref;

  return (
    <div className='ml-auto hidden items-center gap-2 lg:flex'>
      <ul className='flex items-center gap-0.5 xl:gap-1'>
        {columns.map((column) => {
          if (!column.isMultiColumn) {
            if (!column.link) return null;
            return (
              <li key={column.id} onPointerEnter={menu.hoverOther}>
                <HawkLinkComponent link={column.link} className={cn(ITEM, tone.idle)} />
              </li>
            );
          }

          const dropdownKey = column.dropdown?.key || '';
          const isOpen = menu.openMenu === dropdownKey;

          return (
            <li key={column.id}>
              <button
                type='button'
                data-testid={dropdownKey}
                aria-expanded={isOpen}
                aria-haspopup='true'
                aria-controls={panelId}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') menu.hoverOpen(dropdownKey);
                }}
                onPointerLeave={menu.cancelPending}
                onClick={(e) => {
                  // `pointerType` is '' for keyboard activation and 'touch'/'pen' for taps.
                  const { pointerType } = e.nativeEvent as PointerEvent;
                  if (pointerType === 'mouse') menu.open(dropdownKey);
                  else menu.toggle(dropdownKey);
                }}
                className={cn(ITEM, 'cursor-pointer', isOpen ? tone.open : tone.idle)}
              >
                {column.dropdown?.dropdownTitle}
                <LuChevronDown
                  className={cn('size-4 transition-transform duration-300', isOpen && 'rotate-180')}
                  aria-hidden='true'
                />
              </button>
            </li>
          );
        })}
      </ul>

      <span aria-hidden='true' className='mx-2 h-6 w-px bg-current opacity-15' />

      <div className='flex items-center gap-1' onPointerEnter={menu.hoverOther}>
        {/* The site's one standing call to action, on every page but its own */}
        {!onDonatePage && (
          <Button asChild variant='accent' size='sm' className='rounded-full px-5 shadow-sm'>
            <Link href={donateHref}>{t('footer.donate')}</Link>
          </Button>
        )}
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default DesktopNavbar;
