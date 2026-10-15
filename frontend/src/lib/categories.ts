import type { Lang } from '../i18n/dict';

export type Category = 'shops' | 'food' | 'entertainment' | 'services';
export const CATEGORIES: Category[] = ['shops', 'food', 'entertainment', 'services'];

/** Each section keeps its colour from the original site, slightly refined. */
export const SECTION_COLOR: Record<Category | 'offers' | 'news' | 'floors', string> = {
  shops: 'var(--teal)',
  food: 'var(--blue)',
  entertainment: 'var(--violet)',
  services: 'var(--pink)',
  offers: 'var(--orange)',
  news: 'var(--pink)',
  floors: 'var(--violet)',
};

type Label = Record<Lang, string>;
const l = (ka: string, en: string, ru: string): Label => ({ ka, en, ru });

export const SUBCATEGORIES: Record<Category, { id: number; label: Label }[]> = {
  shops: [
    { id: 1, label: l('ტანსაცმელი', 'Fashion', 'Одежда') },
    { id: 2, label: l('ფეხსაცმელი', 'Shoes', 'Обувь') },
    { id: 5, label: l('აქსესუარები', 'Accessories', 'Аксессуары') },
    { id: 6, label: l('სილამაზე', 'Beauty', 'Красота') },
    { id: 3, label: l('სპორტი', 'Sport', 'Спорт') },
    { id: 4, label: l('საბავშვო', 'Kids', 'Детям') },
    { id: 9, label: l('ტექნიკა', 'Electronics', 'Техника') },
    { id: 8, label: l('სახლი', 'Home', 'Для дома') },
    { id: 7, label: l('სუპერმარკეტი', 'Supermarket', 'Супермаркет') },
    { id: 10, label: l('სხვა', 'Other', 'Другое') },
  ],
  food: [
    { id: 17, label: l('კაფე', 'Café', 'Кафе') },
    { id: 26, label: l('რესტორანი', 'Restaurant', 'Ресторан') },
    { id: 15, label: l('სწრაფი კვება', 'Fast food', 'Фастфуд') },
    { id: 18, label: l('ქართული', 'Georgian', 'Грузинская кухня') },
  ],
  entertainment: [
    { id: 21, label: l('კინო', 'Cinema', 'Кино') },
    { id: 19, label: l('თეატრი', 'Theatre', 'Театр') },
    { id: 23, label: l('ბოულინგი', 'Bowling', 'Боулинг') },
    { id: 22, label: l('საბავშვო სივრცე', 'Kids zone', 'Детская зона') },
  ],
  services: [
    { id: 11, label: l('ბანკი', 'Bank', 'Банк') },
    { id: 13, label: l('სილამაზის სალონი', 'Beauty salon', 'Салон красоты') },
    { id: 12, label: l('ქიმწმენდა', 'Dry cleaning', 'Химчистка') },
    { id: 14, label: l('სხვა', 'Other', 'Другое') },
  ],
};

const ALL = Object.values(SUBCATEGORIES).flat();
export const subcategoryLabel = (id: number, lang: Lang) =>
  ALL.find((s) => s.id === id)?.label[lang] ?? '';

export const FLOORS = [5, 4, 3, 2, 1, 0, -1] as const;
/** Levels on the wayfinder map; 6 is the upper level of the Cavea cinema. */
export const MAP_FLOORS = [6, 5, 4, 3, 2, 1, 0, -1] as const;
export const floorLabel = (n: number) => (n < 0 ? `−${-n}` : String(n));
