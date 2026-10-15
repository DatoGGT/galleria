import type { Category } from '../lib/categories';

// These shapes are the contract with the future Django REST API.

export type Hours = { from: string; to: string };

export type Store = {
  slug: string;
  name: string;
  logo: string;
  phone: string | null;
  hours: Hours | null;
  floor: number | null;
  /** Wayfinder unit ids, e.g. ["2.14"]. */
  places: string[];
  category: Category;
  subcategories: number[];
  audience: ('male' | 'female' | 'kids')[];
};

export type Offer = {
  id: number;
  store: string;
  storeName: string;
  logo: string;
  badge: string | null;
  description: string;
  date: string;
  category: string;
};

export type NewsItem = {
  slug: string;
  title: string;
  cover: string | null;
  date: string;
  excerpt: string;
};
