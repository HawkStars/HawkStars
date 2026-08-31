'use client';

import LanguageSwitcher from '@/components/utils/LanguageSwitcher';
import { FC } from 'react';
import HawkLinkComponent from '@/components/utils/HawkLink';
import { HeaderNavigationColumns } from '@/payload-types';
import { LuChevronDown } from 'react-icons/lu';
import { cn } from '@/lib/utils';

/** Shared so the trigger's aria-controls and the panel's id cannot drift apart. */
export const NAVBAR_DROPDOWN_PANEL_ID = 'navbar-dropdown-panel';

type DesktopNavbarProps = {
  handleHoverMenu: (menuKey: string) => void;
  columns: HeaderNavigationColumns;
  menuKeyHovered: string | null;
  panelId?: string;
};

const DesktopNavbar: FC<DesktopNavbarProps> = ({
  handleHoverMenu,
  columns,
  menuKeyHovered,
  panelId = NAVBAR_DROPDOWN_PANEL_ID,
}) => {
  return (
    <div className='my-auto ml-auto hidden lg:block'>
      <div className='ml-auto flex gap-3'>
        <div className='flex flex-row gap-4 px-1 max-xl:text-sm xl:gap-8'>
          {columns.map((column) => {
            const isMultiColumn = column.isMultiColumn;

            if (!isMultiColumn && !column.link) return null;
            if (!isMultiColumn && column.link)
              return <HawkLinkComponent key={column.id} link={column.link} className='my-auto' />;

            const dropdownKey = column.dropdown?.key || '';
            const isOpen = menuKeyHovered === column.dropdown?.key;

            return (
              <div key={column.id} className='my-auto flex'>
                <button
                  type='button'
                  data-testid={column.dropdown?.key}
                  aria-expanded={isOpen}
                  aria-haspopup='true'
                  aria-controls={panelId}
                  onMouseEnter={() => handleHoverMenu(dropdownKey)}
                  onClick={() => handleHoverMenu(isOpen ? '' : dropdownKey)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape' && isOpen) {
                      e.preventDefault();
                      handleHoverMenu('');
                    }
                  }}
                  className='focus-visible:ring-primary my-auto flex cursor-pointer gap-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden'
                >
                  {column.dropdown?.dropdownTitle}
                  <LuChevronDown
                    className={cn('my-auto transition-transform duration-300', {
                      'rotate-180': isOpen,
                    })}
                    size={20}
                    aria-hidden='true'
                  />
                </button>
              </div>
            );
          })}
        </div>
        <div className='my-auto'>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default DesktopNavbar;
