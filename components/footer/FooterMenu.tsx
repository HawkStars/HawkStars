import { FooterColumn } from './config';
import HawkLink from '../utils/HawkLink';

type FooterMenuProps = {
  data: FooterColumn;
};

const FooterMenu = ({ data }: FooterMenuProps) => {
  const column = data.column;

  return (
    <div className='flex flex-col gap-3'>
      <h3 className='text-eyebrow text-green'>{column.title}</h3>
      {column.data && column.data.length > 0 ? (
        <ul className='flex flex-col gap-2.5 text-sm'>
          {column.data.map((item) => {
            const link = item.link;
            const { visible } = link || { visible: false };

            if (!visible) return null;

            return (
              <li key={item.id || link.label}>
                <HawkLink
                  link={link}
                  className='hover:text-green text-black/75 transition-colors hover:underline hover:underline-offset-4'
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default FooterMenu;
