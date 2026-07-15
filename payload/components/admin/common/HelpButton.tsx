import { GrHelp } from 'react-icons/gr';

const HelpButton: React.FC<{ url: string }> = ({ url }) => {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='border-theme-elevation-100 flex items-center justify-center rounded-sm border p-3 text-gray-600'
    >
      <GrHelp className='text-yellow-400' />
    </a>
  );
};

export default HelpButton;
