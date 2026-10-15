import storesJson from '../data/stores.json';
import offersJson from '../data/offers.json';
import newsJson from '../data/news.json';
import type { NewsItem, Offer, Store } from './types';

export type { NewsItem, Offer, Store } from './types';

// Mock data taken from the current galleria.ge API. When the Django API is
// ready, replace this module with fetch('/api/...') calls returning the same types.
export const stores = storesJson as Store[];
export const offers = offersJson as Offer[];
export const news = newsJson as NewsItem[];

export const findStore = (slug: string) => stores.find((s) => s.slug === slug);
export const findNews = (slug: string) => news.find((n) => n.slug === slug);
