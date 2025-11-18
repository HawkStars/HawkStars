import { BoardMember } from '@/payload-types';
import groupBy from 'lodash.groupby';
import { getPayloadConfig } from '../server';

type GroupedBoardMembers = {
  board: BoardMember[];
  geral: BoardMember[];
  fiscal: BoardMember[];
};

export const getBoardMembers = async (): Promise<GroupedBoardMembers> => {
  const payload = await getPayloadConfig();
  const data = await payload.find({ collection: 'board-members' });
  const boardMembers = data.docs;

  const groupedMembers = groupBy(boardMembers, 'section');

  return {
    board: groupedMembers.board || [],
    geral: groupedMembers.geral || [],
    fiscal: groupedMembers.fiscal || [],
  };
};
