import { SuperAdminSection } from '@/app/superadmin/page';
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
      className={classNames('cursor-pointer', {
        'text-green underline': section == currentSectionSelected,
      })}
      onClick={() => onClick(section)}
    >
      {tabText}
    </div>
  );
};

export default SuperAdminTabItem;
