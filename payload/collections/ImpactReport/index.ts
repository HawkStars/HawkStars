import type { CollectionConfig, Field } from 'payload';

import { authenticated } from '@/payload/access/authenticated';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';
import { authenticatedOrPublished } from '@/payload/access/authenticatedOrPublished';
import { GROUP_LABELS } from '@/payload/constants';
import { PayloadImageField } from '@/payload/fields/ImageType';
import PayloadLucideIcon from '@/payload/fields/ImageIcon/payload-lucide-icon';
import { createRevalidateHooks } from '@/payload/utilities/revalidateCollection';

export const IMPACT_REPORTS_CACHE_TAG = 'impact_reports' as const;
const { afterChange: revalidateImpactReports, afterDelete: revalidateImpactReportsDelete } =
  createRevalidateHooks(IMPACT_REPORTS_CACHE_TAG);

/** One money line (income or expense) in a report's accounts. */
const moneyLines = (name: string, label: { en: string; pt: string }): Field => ({
  name,
  type: 'array',
  label,
  interfaceName: 'ImpactReportMoneyLine',
  admin: {
    initCollapsed: true,
    components: { RowLabel: '@/payload/components/admin/GenericArrayRowLabel' },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Item', pt: 'Rubrica' },
          admin: { width: '70%' },
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          min: 0,
          label: { en: 'Amount (€)', pt: 'Valor (€)' },
          admin: { width: '30%' },
        },
      ],
    },
  ],
});

/** A link to an uploaded file in the Documents collection. */
const documentField = (name: string, label: { en: string; pt: string }): Field => ({
  name,
  type: 'relationship',
  relationTo: 'documents',
  label,
  admin: {
    description: {
      en: 'Pick the PDF from Documents (upload it there first, folder "Reports").',
      pt: 'Escolha o PDF em Documentos (carregue-o lá primeiro, pasta "Relatórios").',
    },
  },
});

/**
 * One public report per year: headline numbers, the year's highlights, a summary of
 * the accounts and the official documents (activity report, accounts, fiscal council
 * opinion, next year's plan). Feeds /impact, /impact/[year] and /reports.
 */
export const ImpactReport: CollectionConfig = {
  slug: 'impact_reports',
  labels: {
    singular: { en: 'Impact Report', pt: 'Relatório de Impacto' },
    plural: { en: 'Impact Reports', pt: 'Relatórios de Impacto' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['year', 'title', '_status', 'updatedAt'],
    preview: (doc, { locale }) => (doc?.year ? `/${locale || 'pt'}/impact/${doc.year}` : null),
    description: {
      en: 'One report per year: impact numbers, highlights, accounts and official documents. Shown on /impact and /reports once published.',
      pt: 'Um relatório por ano: números de impacto, destaques, contas e documentos oficiais. Aparece em /impact e /reports depois de publicado.',
    },
    group: { ...GROUP_LABELS.organization },
  },
  defaultPopulate: { year: true, title: true },
  access: {
    admin: authenticated,
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticatedAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'year',
          type: 'number',
          required: true,
          unique: true,
          index: true,
          min: 2015,
          max: 2100,
          label: { en: 'Year', pt: 'Ano' },
          admin: {
            width: '30%',
            description: {
              en: 'The year this report covers. Also its URL: /impact/2025.',
              pt: 'O ano a que o relatório se refere. É também o seu URL: /impact/2025.',
            },
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Title', pt: 'Título' },
          admin: { width: '70%' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      label: { en: 'Summary', pt: 'Resumo' },
      admin: {
        description: {
          en: 'Two or three sentences on the year, shown at the top and on the report card.',
          pt: 'Duas ou três frases sobre o ano, mostradas no topo e no cartão do relatório.',
        },
      },
    },
    PayloadImageField({
      name: 'coverImage',
      label: { en: 'Cover image', pt: 'Imagem de capa' },
    }),
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Impact', pt: 'Impacto' },
          fields: [
            {
              name: 'stats',
              type: 'array',
              interfaceName: 'ImpactReportStat',
              label: { en: 'Headline numbers', pt: 'Números principais' },
              maxRows: 8,
              admin: {
                initCollapsed: true,
                description: {
                  en: 'The year in numbers, e.g. "40+" young people sent abroad.',
                  pt: 'O ano em números, ex.: "40+" jovens enviados para o estrangeiro.',
                },
                components: { RowLabel: '@/payload/components/admin/GenericArrayRowLabel' },
              },
              fields: [
                PayloadLucideIcon(),
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                      label: { en: 'Value', pt: 'Valor' },
                      admin: { width: '30%' },
                    },
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      localized: true,
                      label: { en: 'Label', pt: 'Rótulo' },
                      admin: { width: '70%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'highlights',
              type: 'array',
              interfaceName: 'ImpactReportHighlight',
              label: { en: 'Highlights of the year', pt: 'Destaques do ano' },
              admin: {
                initCollapsed: true,
                description: {
                  en: 'Shown as a timeline, in the order listed here.',
                  pt: 'Mostrados como linha do tempo, pela ordem desta lista.',
                },
                components: { RowLabel: '@/payload/components/admin/GenericArrayRowLabel' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'date',
                      type: 'text',
                      required: true,
                      localized: true,
                      label: { en: 'When', pt: 'Quando' },
                      admin: { width: '30%', placeholder: 'Jul 2025' },
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      localized: true,
                      label: { en: 'Title', pt: 'Título' },
                      admin: { width: '70%' },
                    },
                  ],
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  localized: true,
                  label: { en: 'Description', pt: 'Descrição' },
                },
                PayloadImageField({ name: 'image', label: { en: 'Image', pt: 'Imagem' } }),
              ],
            },
          ],
        },
        {
          name: 'finances',
          label: { en: 'Accounts', pt: 'Contas' },
          interfaceName: 'ImpactReportFinances',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'income',
                  type: 'number',
                  min: 0,
                  label: { en: 'Total income (€)', pt: 'Receita total (€)' },
                  admin: { width: '33%' },
                },
                {
                  name: 'expenses',
                  type: 'number',
                  min: 0,
                  label: { en: 'Total expenses (€)', pt: 'Despesa total (€)' },
                  admin: { width: '33%' },
                },
                {
                  name: 'closingBalance',
                  type: 'number',
                  label: { en: 'Balance carried forward (€)', pt: 'Saldo para o ano seguinte (€)' },
                  admin: { width: '33%' },
                },
              ],
            },
            moneyLines('incomeLines', { en: 'Income breakdown', pt: 'Detalhe das receitas' }),
            moneyLines('expenseLines', { en: 'Expense breakdown', pt: 'Detalhe das despesas' }),
          ],
        },
        {
          name: 'documents',
          label: { en: 'Documents', pt: 'Documentos' },
          interfaceName: 'ImpactReportDocuments',
          fields: [
            documentField('activityReport', {
              en: 'Activity report',
              pt: 'Relatório de atividades',
            }),
            documentField('accountsReport', { en: 'Accounts report', pt: 'Relatório de contas' }),
            documentField('fiscalCouncilOpinion', {
              en: 'Fiscal council opinion',
              pt: 'Parecer do Conselho Fiscal',
            }),
            documentField('activityPlan', {
              en: "Next year's activity plan and budget",
              pt: 'Plano de atividades e orçamento do ano seguinte',
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateImpactReports],
    afterDelete: [revalidateImpactReportsDelete],
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 10,
  },
};
