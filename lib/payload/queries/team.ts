import { BoardMember } from '@/payload-types';
import groupBy from 'lodash.groupby';
import { getPayloadConfig } from '../server';
import { cacheLife, cacheTag } from 'next/cache';
import { BOARD_MEMBER_CACHE_TAG } from '@/payload/collections/BoardMember';

export type GroupedBoardMembers = {
  board: BoardMember[];
  geral: BoardMember[];
  fiscal: BoardMember[];
};

export const getBoardMembers = async (): Promise<GroupedBoardMembers> => {
  'use cache';
  cacheLife('hours');
  cacheTag(BOARD_MEMBER_CACHE_TAG);

  const payload = await getPayloadConfig();
  const data = await payload.find({ collection: 'board-members', limit: 1000, depth: 1 });
  const boardMembers = data.docs;

  const groupedMembers = groupBy(boardMembers, 'section');

  return {
    board: groupedMembers.board || [],
    geral: groupedMembers.geral || [],
    fiscal: groupedMembers.fiscal || [],
  };
};
