import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { cn } from '@/lib/utils';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'terms');
  return metadataPage;
}

type Article = {
  title: string;
  values: Array<SubArticle>;
};

type SubArticle = {
  title: string;
  subValues: Array<string>;
};

export default async function Page(props: LanguagePageProps) {
  const params = await props.params;

  const { lng } = params;

  const { t } = await getServerTranslation(lng, 'terms');

  const preamble = t('preamble', { returnObjects: true }) as {
    title: string;
    items: Array<string>;
  };

  const articles = t('article.items', { returnObjects: true }) as Array<Article>;

  return (
    <section className='flex flex-col gap-4 px-5 py-3 lg:mx-auto lg:max-w-4xl lg:pt-10'>
      <h1 className='text-h2_bold text-center'>{t('terms_and_conditions')}</h1>
      <h2 className='text-body_regular text-center'>www.hawkstars.org</h2>
      <div className='mb-3 flex flex-col gap-3'>
        <h2 className='text-h2_light mb-5'>{preamble.title}</h2>
        {preamble.items.map((item, index) => {
          return (
            <div key={index} className='mb-1'>
              <span className='text-body_semibold'>{`${index + 1}.º`}</span>
              <p className='text-body_regular text-justify'>{item}</p>
            </div>
          );
        })}
      </div>

      {articles.map((item, index) => {
        return (
          <div key={index} className='my-1'>
            <h3 className='text-h2_bold mb-3'>
              <span>{`${t('article.title')} ${index + 1}`}</span> - {item.title}
            </h3>
            <ol
              className={cn('ml-5 flex flex-col gap-3', {
                'list-decimal': item.values?.length > 1,
                'list-none': item.values?.length == 1,
              })}
            >
              {/* I want to move this to its component */}
              {item?.values?.map((firstLevelText, index) => {
                let listItem;
                if (typeof firstLevelText == 'string') {
                  listItem = (
                    <li key={index} className='text-justify'>
                      {firstLevelText}
                    </li>
                  );
                } else {
                  listItem = <SubItem key={index} article={firstLevelText} />;
                }
                return listItem;
              })}
            </ol>
          </div>
        );
      })}
    </section>
  );
}

const SubItem = ({ article }: { article: SubArticle }) => {
  return (
    <>
      <li>{article.title}</li>
      {article.subValues && (
        <ol className='flex list-disc flex-col gap-1 pl-5 text-justify'>
          {article.subValues?.map((subItem, index) => (
            <li key={index}>{subItem}</li>
          ))}
        </ol>
      )}
    </>
  );
};
