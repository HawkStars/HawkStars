export const PAGE_SIZE = 10 as const;

export const getPageCount = (total: number) => Math.ceil(total / PAGE_SIZE);

export const getPageRange = (page: number) => {
  return [page == 1 ? 0 : (page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1];
};
