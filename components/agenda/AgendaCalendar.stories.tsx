import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AgendaCalendar from './AgendaCalendar';

// Note: AgendaCalendar fetches its events client-side via a Payload query.
// In Storybook that fetch resolves to no events, so the calendar grid and
// sidebar render with the empty state. The month navigation and day selection
// remain interactive.

const enTranslations = {
  title: 'Agenda',
  subtitle: 'Browse our upcoming and past events. Select a day to see what is happening.',
  noEvents: 'No events on this day.',
  today: 'Today',
  viewProject: 'View event',
  multiDay: 'Multi-day',
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

const ptTranslations = {
  title: 'Agenda',
  subtitle: 'Veja os nossos eventos futuros e passados. Selecione um dia para ver o que acontece.',
  noEvents: 'Sem eventos neste dia.',
  today: 'Hoje',
  viewProject: 'Ver evento',
  multiDay: 'Vários dias',
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  dayNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
};

const meta = {
  title: 'Misc/AgendaCalendar',
  component: AgendaCalendar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='bg-bege-light px-4 py-8'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgendaCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lng: 'en',
    translations: enTranslations,
  },
};

export const Portuguese: Story = {
  args: {
    lng: 'pt',
    translations: ptTranslations,
  },
};
