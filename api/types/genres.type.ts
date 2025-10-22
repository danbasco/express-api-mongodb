export const GENRES = [
  'Fiction',
  'Fantasy',
  'Romance',
  'Horror',
  'Mystery',
  'Biography',
  'History',
  'Science',
  'Adventure',
  'Drama'
] as const;

export type Genre = typeof GENRES[number];