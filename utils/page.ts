export const PAGE_SIZE = 10 as const;

export const getPageCount = (total: number) => Math.ceil(total / PAGE_SIZE);

export const getPageRange = (page: number) => {
  return [page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1];
};
