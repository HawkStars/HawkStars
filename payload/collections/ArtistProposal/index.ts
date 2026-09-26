import type { CollectionConfig } from 'payload';
import { authenticated } from '@/payload/access/authenticated';
import { GROUP_LABELS } from '@/payload/constants';
import { ART_CATEGORIES } from '../ArtCollection/categories';

export const ARTIST_PROPOSAL_COLLECTION = 'artist_proposals' as const;

/**
 * "Sou artista, quero propôr obra à curadoria" submissions. Created by
 * `/api/art-gallery/proposal`; reviewed by the curators in the admin.
 */
export const ArtistProposal: CollectionConfig = {
  slug: ARTIST_PROPOSAL_COLLECTION,
  access: {
    admin: authenticated,
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  labels: {
    singular: { en: 'Artist Proposal', pt: 'Proposta de Artista' },
    plural: { en: 'Artist Proposals', pt: 'Propostas de Artistas' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'discipline', 'status', 'createdAt'],
    group: { ...GROUP_LABELS.artGallery },
    description: {
      en: 'Artworks proposed by artists to the curatorial board through the gallery website.',
      pt: 'Obras propostas por artistas à curadoria através do site da galeria.',
    },
  },
  fields: [
    {
      name: 'status',
      label: { en: 'Status', pt: 'Estado' },
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { value: 'new', label: { en: 'New', pt: 'Nova' } },
        { value: 'reviewing', label: { en: 'Under Review', pt: 'Em Análise' } },
        { value: 'accepted', label: { en: 'Accepted', pt: 'Aceite' } },
        { value: 'rejected', label: { en: 'Declined', pt: 'Recusada' } },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'name',
      label: { en: 'Artist / Collective', pt: 'Artista / Coletivo' },
      type: 'text',
      required: true,
    },
    { name: 'email', label: 'Email', type: 'email', required: true },
    {
      name: 'discipline',
      label: { en: 'Discipline', pt: 'Disciplina' },
      type: 'select',
      options: ART_CATEGORIES.map(({ value, label }) => ({ value, label })),
    },
    {
      name: 'portfolio_url',
      label: { en: 'Portfolio Link', pt: 'Link do Portfólio' },
      type: 'text',
    },
    { name: 'message', label: { en: 'Statement', pt: 'Nota de Intenções' }, type: 'textarea' },
  ],
};
