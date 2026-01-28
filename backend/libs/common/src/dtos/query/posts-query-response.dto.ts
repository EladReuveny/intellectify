export class PostsQueryResponseDto<T> {
  items: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}
