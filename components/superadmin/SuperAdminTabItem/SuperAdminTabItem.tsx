import { SuperAdminSection } from '@/app/superadmin/config';
import classNames from 'classnames';

type SuperAdminTabItemProps = {
  section: SuperAdminSection;
  currentSectionSelected: SuperAdminSection;
  onClick: (item: SuperAdminSection) => void;
  tabText: string;
};

const SuperAdminTabItem = ({
  section,
  onClick,
  currentSectionSelected,
  tabText,
}: SuperAdminTabItemProps) => {
  return (
    <div
      className={classNames('cursor-pointer bg-bege-dark p-2', {
        'text-green': section == currentSectionSelected,
      })}
      onClick={() => onClick(section)}
    >
      {tabText}
    </div>
  );
};

export default SuperAdminTabItem;
