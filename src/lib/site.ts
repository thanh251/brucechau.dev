export const SITE = {
  name: 'Bruce Chau',
  title: 'Bruce Chau — Developer, builder, and lifelong learner',
  description: 'I write about software, health, and unfinished ideas.',
  url: 'https://brucechau.pages.dev',
  email: 'hello@brucechau.dev',
  socials: {
    github: import.meta.env.PUBLIC_GITHUB_URL || 'https://github.com/',
    linkedin: import.meta.env.PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/',
    facebook: import.meta.env.PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/',
  },
} as const

export const NAV_GROUPS = [
  {
    label: 'BLOGS',
    href: '/blogs',
    children: [
      { label: 'tech', href: '/blogs/tech' },
      { label: 'health', href: '/blogs/health' },
      { label: 'ideas', href: '/blogs/ideas' },
    ],
  },
  { label: 'FAVORITES', href: '/favorites' },
  {
    label: 'ABOUT',
    href: '/about/whoami',
    children: [
      { label: 'whoami', href: '/about/whoami' },
      { label: 'uses', href: '/about/uses' },
      { label: 'inspiration', href: '/about/inspiration' },
      { label: 'collections', href: '/about/collections' },
      { label: 'setup', href: '/about/setup' },
    ],
  },
  { label: 'PROJECTS', href: '/projects' },
  { label: 'CALENDAR', href: '/calendar' },
] as const
