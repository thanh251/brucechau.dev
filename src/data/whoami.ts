export type WhoamiSection = {
  title: string
  paragraphs?: string[]
  points?: string[]
}

export const whoamiContent: {
  eyebrow: string
  title: string
  description: string
  introduction: string[]
  sections: WhoamiSection[]
} = {
  eyebrow: 'about',
  title: 'Who am I?',
  description: 'I’m Bruce — a frontend-focused software engineer in Hanoi who enjoys turning fuzzy ideas into useful, carefully made software.',
  introduction: [
    'I study Financial Technology at PTIT and build e-commerce experiences at Weaverse. I like the space where thoughtful interfaces meet solid engineering: products that feel calm and obvious to use, even when the systems behind them are complex.',
    'This site is my public notebook. I write about software, health, and unfinished ideas so I can share what I learn before the details fade.',
  ],
  sections: [
    {
      title: 'What I’m building',
      paragraphs: [
        'At Weaverse, I started as an intern and grew into a full-time software engineer. I work on Shopify storefronts and apps, primarily with Hydrogen, React, TypeScript, and GraphQL.',
        'On the Aspen Shopify Hydrogen theme, I have built customer-facing flows across products, collections, cart, search, accounts, blog, and wishlist. I enjoy carrying a feature from a Figma design through the small implementation details that make it reliable in real use.',
      ],
    },
    {
      title: 'Where I’m learning',
      paragraphs: [
        'At PTIT, FinTech has given me room to connect software with finance and to turn ideas into real apps and websites. Just as importantly, university has taught me how to keep learning and helped me build meaningful relationships.',
        'My curiosity also reaches into financial data and emerging technology. I have explored Bitcoin transactions, AI-assisted financial analysis, and DAO governance through side projects and research.',
      ],
    },
    {
      title: 'What I care about',
      points: [
        'Software that feels calm, useful, and obvious to use.',
        'Strong fundamentals over fashionable complexity.',
        'Health, curiosity, and the patience to keep learning.',
      ],
    },
    {
      title: 'Away from the screen',
      paragraphs: [
        'I make time for the gym and running. And when I want to unwind, PES is still my favorite game.',
      ],
    },
  ],
}
