export type CareerEvent = {
  id: string
  side: 'left' | 'right'
  year: string
  title: string
  logo: string
  subtitle: string
  range: string
  eyebrow: string
  description: string
  note?: string
}

export const careerContent: {
  title: string
  instruction: string
  initialEventId: string
  events: CareerEvent[]
} = {
  title: 'Career Path',
  instruction: 'Click an event to inspect the chapter.',
  initialEventId: 'ptit',
  // Newest first. The side controls where the event sits; its detail appears opposite.
  events: [
    {
      id: 'weaverse',
      side: 'left',
      year: 'JAN 2026',
      title: 'Weaverse',
      logo: '/brand/weaverse.svg',
      subtitle: 'Shopify developer',
      range: 'JAN 2026 — PRESENT',
      eyebrow: 'WEAVERSE',
      description: 'I joined Weaverse as an intern and later became a full-time team member. Today, I build Shopify themes and apps.',
    },
    {
      id: 'ptit',
      side: 'right',
      year: '2023',
      title: 'PTIT',
      logo: '/brand/ptit.svg',
      subtitle: 'FinTech student',
      range: '2023 — Expected 2027',
      eyebrow: 'POSTS AND TELECOMMUNICATIONS INSTITUTE OF TECHNOLOGY',
      description: 'Studying FinTech at PTIT with a focus on building real products, from apps to websites. Beyond coursework, I have learned how to learn and built meaningful connections.',
      note: 'Overlaps with Weaverse from 2026.',
    },
  ],
}
