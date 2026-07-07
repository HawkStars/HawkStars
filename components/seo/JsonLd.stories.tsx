import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  OrganizationJsonLd,
  BreadcrumbJsonLd,
  WebPageJsonLd,
  EventJsonLd,
  ArticleJsonLd,
} from './JsonLd';

// JsonLd helpers render an invisible <script type="application/ld+json"> tag.
// These stories render each helper alongside a note, since there is nothing
// visual to show — inspect the DOM to see the emitted structured data.

const Note = ({ label }: { label: string }) => (
  <p className='text-disabled text-sm'>
    Renders a <code>&lt;script type=&quot;application/ld+json&quot;&gt;</code> tag for{' '}
    <strong>{label}</strong>. Inspect the DOM to view the JSON-LD payload.
  </p>
);

const meta = {
  title: 'Pages/Shared/JSON-LD',
  component: OrganizationJsonLd,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OrganizationJsonLd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lng: 'en',
  },
  render: (args) => (
    <>
      <Note label='Organization + WebSite' />
      <OrganizationJsonLd {...args} />
    </>
  ),
};

export const Breadcrumb: StoryObj = {
  render: () => (
    <>
      <Note label='BreadcrumbList' />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://hawkstars.org/en' },
          { name: 'Projects', url: 'https://hawkstars.org/en/projects' },
          { name: 'Erasmus 2026', url: 'https://hawkstars.org/en/projects/erasmus-2026' },
        ]}
      />
    </>
  ),
};

export const WebPage: StoryObj = {
  render: () => (
    <>
      <Note label='WebPage' />
      <WebPageJsonLd
        title='About HawkStars'
        description='Learn about our mission, history and team.'
        url='https://hawkstars.org/en/about'
        lng='en'
      />
    </>
  ),
};

export const Event: StoryObj = {
  render: () => (
    <>
      <Note label='Event' />
      <EventJsonLd
        name='Pinhel Cultural Festival'
        description='A weekend of music, food and culture in Pinhel.'
        startDate='2026-08-02T18:00:00.000Z'
        endDate='2026-08-03T23:00:00.000Z'
        location='Pinhel Town Square'
        url='https://hawkstars.org/en/events/pinhel-festival'
        image='https://hawkstars.org/images/festival.webp'
      />
    </>
  ),
};

export const Article: StoryObj = {
  render: () => (
    <>
      <Note label='NewsArticle' />
      <ArticleJsonLd
        title='HawkStars wins regional youth award'
        description='Our youth programme was recognised at the regional awards.'
        url='https://hawkstars.org/en/news/youth-award'
        image='https://hawkstars.org/images/award.webp'
        publishedAt='2026-05-01T00:00:00.000Z'
        modifiedAt='2026-05-02T00:00:00.000Z'
        lng='en'
      />
    </>
  ),
};
