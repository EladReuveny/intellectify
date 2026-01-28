export type PostsQueryDto = {
  q?: string;

  page?: number;

  limit?: number;

  sortBy?: "title" | "createdAt" | "likes" | "comments";

  order?: "asc" | "desc";
};

export type PostsQueryResponse<T> = {
  items: T[];
  meta: PaginationResponseMeta;
};

export type PaginationResponseMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
};
