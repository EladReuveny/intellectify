import { metadata } from 'reflect-metadata/no-conflict';

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => metadata(IS_PUBLIC_KEY, true);
