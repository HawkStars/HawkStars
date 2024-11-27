export const PAGE_SIZE = 10 as const;

export const getPageRange = (page: number) => {
  return [page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1];
};
