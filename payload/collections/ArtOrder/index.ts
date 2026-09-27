import type { CollectionConfig } from 'payload';
import { authenticated } from '@/payload/access/authenticated';
import { GROUP_LABELS } from '@/payload/constants';

export const ART_ORDER_COLLECTION = 'art_orders' as const;

const ART_ORDER_STATUSES = [
  { value: 'pending', label: { en: 'Awaiting Payment', pt: 'A Aguardar Pagamento' } },
  { value: 'paid', label: { en: 'Paid', pt: 'Pago' } },
  { value: 'failed', label: { en: 'Payment Failed', pt: 'Pagamento Falhado' } },
  {
    value: 'expired',
    label: { en: 'Expired (not paid in time)', pt: 'Expirada (não paga a tempo)' },
  },
  { value: 'cancelled', label: { en: 'Cancelled', pt: 'Cancelado' } },
];

export type ArtOrderStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled';

const ART_DELIVERY_METHODS = [
  {
    value: 'pickup',
    label: { en: "Pickup at the Artist's Address", pt: 'Recolha na Morada do Artista' },
  },
  { value: 'carrier', label: { en: 'Shipping by Carrier', pt: 'Envio por Transportadora' } },
];

/**
 * An online artwork purchase. Created only by `/api/art-gallery/order` (server
 * side, so prices always come from the artwork, never from the browser). Its
 * status is only ever changed after confirming it with EasyPay
 * (`lib/art-gallery/orders.ts#syncArtOrder`) — from the webhook, the buyer's
 * order page, or the expiry job. A pending order reserves one copy of the
 * artwork until `reserved_until`.
 */
export const ArtOrder: CollectionConfig = {
  slug: ART_ORDER_COLLECTION,
  access: {
    admin: authenticated,
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  labels: {
    singular: { en: 'Artwork Order', pt: 'Encomenda de Obra' },
    plural: { en: 'Artwork Orders', pt: 'Encomendas de Obras' },
  },
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'artwork', 'status', 'total', 'payment_method', 'createdAt'],
    group: { ...GROUP_LABELS.artGallery },
    description: {
      en: 'Artworks bought online. Carrier orders still need the shipping quote sent to the buyer.',
      pt: 'Obras compradas online. As encomendas por transportadora ainda precisam da cotação de portes enviada ao comprador.',
    },
  },
  fields: [
    {
      name: 'reference',
      label: { en: 'Order Reference', pt: 'Referência da Encomenda' },
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'status',
      label: { en: 'Status', pt: 'Estado' },
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: ART_ORDER_STATUSES,
      admin: { position: 'sidebar' },
    },
    {
      name: 'artwork',
      label: { en: 'Artwork', pt: 'Obra' },
      type: 'relationship',
      relationTo: 'artworks',
      required: true,
    },
    {
      name: 'artwork_reference',
      label: { en: 'Artwork Reference', pt: 'Referência da Obra' },
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'delivery',
      label: { en: 'Delivery', pt: 'Entrega' },
      type: 'select',
      required: true,
      options: ART_DELIVERY_METHODS,
    },
    {
      type: 'group',
      name: 'buyer',
      label: { en: 'Buyer', pt: 'Comprador' },
      fields: [
        { name: 'name', label: { en: 'Name', pt: 'Nome' }, type: 'text', required: true },
        { name: 'nif', label: { en: 'Tax ID (NIF)', pt: 'NIF' }, type: 'text' },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: { en: 'Phone', pt: 'Telefone' }, type: 'text' },
        { name: 'address', label: { en: 'Address', pt: 'Morada' }, type: 'text' },
        {
          name: 'postal_code_city',
          label: { en: 'Postal Code & City', pt: 'Código Postal & Cidade' },
          type: 'text',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'base_value',
          label: { en: 'Base (€)', pt: 'Base (€)' },
          type: 'number',
          required: true,
        },
        {
          name: 'vat_rate',
          label: { en: 'VAT (%)', pt: 'IVA (%)' },
          type: 'number',
          required: true,
        },
        {
          name: 'vat_value',
          label: { en: 'VAT (€)', pt: 'IVA (€)' },
          type: 'number',
          required: true,
        },
        {
          name: 'total',
          label: { en: 'Total (€)', pt: 'Total (€)' },
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'payment_method',
      label: { en: 'Payment Method', pt: 'Método de Pagamento' },
      type: 'select',
      options: [
        { label: 'Multibanco', value: 'MB' },
        { label: 'MB WAY', value: 'MBW' },
        { label: { en: 'Card', pt: 'Cartão' }, value: 'CC' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'reserved_until',
      label: { en: 'Copy Reserved Until', pt: 'Exemplar Reservado Até' },
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
        description: {
          en: 'While pending, one copy is held for the buyer until this time; after it the order expires.',
          pt: 'Enquanto pendente, um exemplar fica reservado até esta hora; depois disso a encomenda expira.',
        },
      },
    },
    {
      name: 'paid_at',
      label: { en: 'Paid At', pt: 'Pago Em' },
      type: 'date',
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'easypay_id',
      label: { en: 'EasyPay Payment ID', pt: 'ID do Pagamento EasyPay' },
      type: 'text',
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'access_token',
      type: 'text',
      // Secret in the buyer's order-page link; never shown or exposed.
      access: { read: () => false, update: () => false },
      admin: { hidden: true },
    },
    {
      name: 'last_checked_at',
      type: 'date',
      admin: { hidden: true },
    },
    {
      name: 'transaction_key',
      label: { en: 'EasyPay Transaction Key', pt: 'Chave da Transação EasyPay' },
      type: 'text',
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'easypay_response',
      label: { en: 'EasyPay Response', pt: 'Resposta EasyPay' },
      type: 'json',
      admin: { readOnly: true },
    },
    {
      name: 'notes',
      label: { en: 'Internal Notes', pt: 'Notas Internas' },
      type: 'textarea',
    },
  ],
};
