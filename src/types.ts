export type Category = 'system-design' | 'ml-ai' | 'data-analysis'
export type Audience = 'recruiter' | 'non-tech-friend' | 'product-manager'

export interface Topic {
  id: string
  name: string
  category: Category
}

export interface Session {
  id: string
  topic: string
  category: Category
  audience?: Audience
  date: string
  selfRating: number
  notes: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  'system-design': 'System Design',
  'ml-ai': 'ML/AI',
  'data-analysis': 'Data Analysis',
}

export const AUDIENCE_LABELS: Record<Audience, string> = {
  recruiter: 'Recruiter',
  'non-tech-friend': 'Non-tech friend',
  'product-manager': 'Product manager',
}
