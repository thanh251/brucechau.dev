import { favoriteCategories, favoriteHref } from '~/data/favorites'

export const SITE = {
  name: 'Bruce Chau',
  title: 'Bruce Chau — Developer, builder, and lifelong learner',
  description: 'I write about software, health, and unfinished ideas.',
  url: 'https://brucechau.pages.dev',
  email: 'hello@brucechau.dev',
  socials: {
    github: import.meta.env.PUBLIC_GITHUB_URL || 'https://github.com/thanh251/',
    linkedin: import.meta.env.PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/tuanthanhchau/',
    facebook: import.meta.env.PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/ctthnh25/',
  },
} as const

export const NAV_GROUPS = [
  {
    label: 'blogs',
    href: '/blogs',
    children: [
      { label: 'tech', href: '/blogs/tech' },
      { label: 'health', href: '/blogs/health' },
      { label: 'ideas', href: '/blogs/ideas' },
    ],
  },
  {
    label: 'favorites',
    href: '/favorites',
    children: [
      { label: 'all favorites', href: '/favorites' },
      ...favoriteCategories.map(({ label, slug }) => ({ label: label.toLowerCase(), href: favoriteHref(slug) })),
    ],
  },
  {
    label: 'about',
    href: '/about/whoami',
    children: [
      { label: 'whoami', href: '/about/whoami' },
      { label: 'uses', href: '/about/uses' },
      { label: 'inspiration', href: '/about/inspiration' },
      { label: 'collections', href: '/about/collections' },
      { label: 'setup', href: '/about/setup' },
    ],
  },
  { label: 'projects', href: '/projects' },
  { label: 'calendar', href: '/calendar' },
] as const
