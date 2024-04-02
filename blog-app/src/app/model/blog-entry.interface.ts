import {User} from "./user.interface";

export interface BlogEntryInterface {
  id?: number;
  title?: string;
  slug?: string;
  description?: string;
  body?: string;
  createdAt?: Date;
  updatedAt?: Date;
  likes?: number;
  author?: User;
  headerImage?: string;
  publishedDate?: Date;
  isPublished?: boolean;
}

export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface Links {
  first: string,
  previous: string,
  next: string,
  last: string
}

export interface BlogEntriesPageable {
  items: BlogEntryInterface[],
  meta: Meta,
  links: Links;
}
