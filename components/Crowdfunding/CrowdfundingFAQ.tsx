import { TFunction } from 'i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CfSection, Container, Highlight, SectionEyebrow } from './ui';

type Props = { t: TFunction<string, string> };

const FAQ_KEYS = [
  'how_to_support',
  'goal_not_met',
  'other_ways',
  'rewards',
  'transparency',
  'companies',
  'abroad',
  'receipt',
] as const;

const CrowdfundingFAQ = ({ t }: Props) => (
  <CfSection id='faq'>
    <Container className='grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16'>
      <div className='flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start'>
        <SectionEyebrow>{t('faq.badge')}</SectionEyebrow>
        <h2 className='text-h2_semibold text-white'>
          {t('faq.title_line1')} <Highlight>{t('faq.title_highlight')}</Highlight>{' '}
          {t('faq.title_line2')}
        </h2>
        <p className='text-crowdfunding-muted text-sm leading-relaxed'>{t('faq.description')}</p>
      </div>

      <Accordion
        type='single'
        collapsible
        defaultValue={FAQ_KEYS[0]}
        className='flex flex-col gap-3'
      >
        {FAQ_KEYS.map((key) => (
          <AccordionItem
            key={key}
            value={key}
            className='bg-crowdfunding-surface border-crowdfunding-line data-[state=open]:border-crowdfunding-accent/40 mx-0 rounded-xl border px-5 transition-colors'
          >
            <AccordionTrigger className='[&>svg]:text-crowdfunding-accent cursor-pointer py-5 text-base font-semibold text-white hover:no-underline'>
              {t(`faq.items.${key}.question`)}
            </AccordionTrigger>
            <AccordionContent className='text-crowdfunding-muted pb-5 text-sm leading-relaxed'>
              {t(`faq.items.${key}.answer`)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  </CfSection>
);

export default CrowdfundingFAQ;
