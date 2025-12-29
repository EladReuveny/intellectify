import { atom } from "jotai";
import type { Post } from "../types/post.types";

export const postsAtom = atom<Post[]>([]);
