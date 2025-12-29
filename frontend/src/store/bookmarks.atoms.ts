import { atom } from "jotai";
import type { Bookmark } from "../types/bookmark.types";

export const bookmarkAtom = atom<Bookmark | null>(null);

export const bookmarksAtom = atom<Bookmark[]>([]);

export const postIdToAddToBookmarkAtom = atom<number | null>(null);
