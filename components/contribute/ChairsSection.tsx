import Image from 'next/image';

type ChairsSectionsProps = {
  title: string;
  subtitle?: string;
  icon: any;
  iconFilled: any;
  size: number;
};

const ChairsSections = ({
  title,
  subtitle,
  icon,
  iconFilled,
  size,
}: ChairsSectionsProps) => {
  return (
    <div className='my-10 flex flex-col justify-center gap-3'>
      <h3 className='text-center'>{title}</h3>
      {subtitle && <h4 className='text-center'>{subtitle}</h4>}
      <div className='mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-5'>
        {Array(size)
          .fill(null)
          .map((item) => {
            return (
              <div className='group relative' key={item}>
                {icon}
                <div className='absolute -top-5 hidden w-fit bg-bege-dark p-2 text-sm group-hover:block'>
                  Paulo Cardoso
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ChairsSections;
