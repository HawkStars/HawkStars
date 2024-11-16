import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import TransparencyMain from '@/components/transparency/TransparencyMain';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'transparency');
  return metadataPage;
}

const TransparencyPage = async () => {
  return (
    <section className='flex flex-col gap-5 overflow-x-hidden'>
      <div className='flex flex-col gap-10'>
        <TransparencyMain />
      </div>
    </section>
  );
};

export default TransparencyPage;
