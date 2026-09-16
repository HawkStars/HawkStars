import { BoardMember } from '@/payload-types';
import groupBy from 'lodash.groupby';
import { getPayloadConfig } from '../server';
import { cacheLife, cacheTag } from 'next/cache';
import { BOARD_MEMBER_CACHE_TAG } from '@/payload/collections/BoardMember';
import { Language } from '@/i18n/settings';

export type GroupedBoardMembers = {
  board: BoardMember[];
  geral: BoardMember[];
  fiscal: BoardMember[];
};

// Uncached, this Payload call made every route that renders it fully dynamic
// under `cacheComponents` — Payload/its Mongo driver touch `Date.now()`, which
// aborts prerendering outright. `BoardMember` already ships the matching
// revalidate hooks (BOARD_MEMBER_CACHE_TAG), so the cache stays fresh on save.
export const getBoardMembers = async (lng: Language): Promise<GroupedBoardMembers> => {
  'use cache';
  cacheLife('hours');
  cacheTag(BOARD_MEMBER_CACHE_TAG);

  const payload = await getPayloadConfig();
  const data = await payload.find({
    collection: 'board-members',
    limit: 200,
    depth: 1,
    locale: lng,
  });
  const boardMembers = data.docs;

  const groupedMembers = groupBy(boardMembers, 'section');

  return {
    board: groupedMembers.board || [],
    geral: groupedMembers.geral || [],
    fiscal: groupedMembers.fiscal || [],
  };
};
