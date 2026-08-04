import { FooterColumn } from './config';
import HawkLink from '../utils/HawkLink';

type FooterMenuProps = {
  data: FooterColumn;
};

const FooterMenu = ({ data }: FooterMenuProps) => {
  const column = data.column;

  return (
    <div className='flex flex-col gap-2'>
      <h3 className='text-terciary-100 mb-1 ml-0 text-left text-base font-black lg:mb-3 lg:text-left'>
        {column.title}
      </h3>
      {column.data && column.data.length > 0 ? (
        <ul className='flex flex-col gap-2'>
          {column.data.map((item) => {
            const link = item.link;
            const { visible } = link || { visible: false };

            if (!visible) return null;

            return (
              <li key={item.id || link.label}>
                <HawkLink link={link} />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default FooterMenu;
