export const resourceTypes = { game: 'Game', mission: 'Mission', worksheet: 'Worksheet', freebie: 'Freebie', guide: 'Guide', calculator: 'Calculator' } as const;
export const resourceCategories = {
  english: 'English', mathematics: 'Mathematics', science: 'Science', geography: 'Geography',
  finance: 'Finance', 'work-time': 'Work & Time', education: 'Study & Education', 'early-learning': 'Early Learning', health: 'Health',
} as const;
export type ResourceType = keyof typeof resourceTypes;
export type ResourceCategory = keyof typeof resourceCategories;
export type Resource = {
  id: string;
  title: string;
  description: string;
  canonicalUrl: string;
  href: string;
  type: ResourceType;
  categories: readonly ResourceCategory[];
  keywords: readonly string[];
  status: 'available';
  access: 'free';
  displayOrder: number;
};
export type ResourceFilters = { query: string; type: ResourceType | 'all'; category: ResourceCategory | 'all'; sort: 'relevance' | 'title' };
export const initialResourceFilters: ResourceFilters = { query: '', type: 'all', category: 'all', sort: 'relevance' };
