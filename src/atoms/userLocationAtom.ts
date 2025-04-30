import { atom } from 'jotai';

export const userLocationAtom = atom<{ lat: number; lon: number } | null>(null);
