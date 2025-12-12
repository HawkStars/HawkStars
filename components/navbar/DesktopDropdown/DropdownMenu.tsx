import { NavbarDropdown } from '@/payload-types';
import { FC } from 'react';
import DesktopDropdownV1 from './DropdownV1';
import DesktopDropdownV2 from './DropdownV2';

type DropdownMenuProps = {
  dropdownInfo?: NavbarDropdown;
};

const DropdownMenu: FC<DropdownMenuProps> = ({ dropdownInfo }) => {
  if (!dropdownInfo) return null;

  if (dropdownInfo.version === 'v1') return <DesktopDropdownV1 column={dropdownInfo.structure} />;

  return <DesktopDropdownV2 column={dropdownInfo.structure} />;
};

export default DropdownMenu;
