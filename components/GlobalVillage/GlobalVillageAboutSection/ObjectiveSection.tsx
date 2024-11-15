import { getServerTranslation } from '@/i18n';
import Image, { StaticImageData } from 'next/image';
import { Trans } from 'react-i18next/TransWithoutContext';

const ObjectiveSection = async ({
  text,
  image,
  lng,
}: {
  text: string;
  image: StaticImageData;
  lng: string;
}) => {
  const { t } = await getServerTranslation(lng, 'training_center');
  return (
    <div className='flex flex-col gap-5'>
      <div>
        <Image src={image} alt='global village section' className='w-full lg:h-52' sizes='100vw' />
      </div>

      <div>
        <Trans
          i18nKey={text}
          t={t}
          key={text}
          components={{
            global: <span className='font-black'>The Global Village</span>,
            international: <span className='font-black'>International Training Center</span>,
          }}
        />
      </div>
    </div>
  );
};

export default ObjectiveSection;
