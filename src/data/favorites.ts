// Add entries to a category when the collection is ready to grow.
export const favoriteCategories = [
  { label: 'Artist', slug: 'artist', description: 'Artists and creative work that stay with me.' },
  { label: 'Food', slug: 'food', description: 'Meals, dishes, and places worth returning to.' },
  { label: 'Beverage', slug: 'beverage', description: 'Drinks I reach for, from everyday staples to small rituals.' },
  { label: 'Agent Model', slug: 'agent-model', description: 'AI models and agents I use, test, or keep an eye on.' },
  { label: 'Software', slug: 'software', description: 'Apps and tools that make my daily work feel better.' },
] as const

export const favoriteHref = (slug: string) => `/favorites/${slug}`
