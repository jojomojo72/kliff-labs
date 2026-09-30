export interface ServiceItem {
  name: string;
  desc: string;
}

export interface ServiceGroup {
  key: string;
  label: string;
  blurb: string;
  href: string;
  web3?: boolean;
  items: ServiceItem[];
}

// Service catalogue from the Kliff Labs web plan.
// The navbar dropdown shows at most 4 items per group; the rest live on /services.
export const serviceGroups: ServiceGroup[] = [
  {
    key: 'web',
    label: 'Web',
    blurb: 'Websites and platforms built to convert and scale.',
    href: '/services#web',
    items: [
      { name: 'Website Design', desc: 'UI/UX, wireframes, custom design systems, landing pages' },
      { name: 'Website Development', desc: 'Custom builds, CMS integration, e-commerce' },
      { name: 'Web Apps & Platforms', desc: 'Dashboards, client portals, SaaS front-ends' },
    ],
  },
  {
    key: 'app',
    label: 'App',
    blurb: 'From first wireframe to the app stores.',
    href: '/services#app',
    items: [
      { name: 'App Design', desc: 'iOS/Android UI/UX' },
      { name: 'App Development', desc: 'Native or cross-platform' },
      { name: 'MVP Development', desc: 'For startups validating an idea fast' },
    ],
  },
  {
    key: 'web3',
    label: 'Web3',
    blurb: 'Onchain products, from contract to community.',
    href: '/web3',
    web3: true,
    items: [
      { name: 'Smart Contract Development', desc: 'Secure, audited, production-ready contracts' },
      { name: 'dApp Development', desc: 'Full-stack decentralized applications' },
      { name: 'Tokenomics & Token Design', desc: 'ERC-20/utility/governance tokens, launch strategy' },
      { name: 'NFT Platforms & Collections', desc: 'Marketplaces, mints, and collection tooling' },
      { name: 'Bots', desc: 'Trading bots, Discord/Telegram community & automation bots' },
      { name: 'Wallet Integration', desc: 'Seamless onboarding across wallets and chains' },
      { name: 'Smart Contract Audits', desc: 'In-house or partnered' },
      { name: 'DAO Tooling & Governance Systems', desc: 'Voting, treasury, and coordination tools' },
      { name: 'Blockchain Consulting', desc: 'Chain selection, architecture' },
    ],
  },
  {
    key: 'branding',
    label: 'Branding & Marketing',
    blurb: 'Brands that get remembered, campaigns that get results.',
    href: '/services#branding',
    items: [
      { name: 'Brand Strategy & Positioning', desc: 'Where you sit and why it matters' },
      { name: 'Logo & Visual Identity', desc: 'Marks, systems, and guidelines' },
      { name: 'Brand Guidelines / Style Systems', desc: 'Consistency at every touchpoint' },
      { name: 'Pitch Decks & Investor Materials', desc: 'Stories that raise' },
      { name: 'Content Kits', desc: 'Ready-to-ship content packages' },
      { name: 'Digital Marketing Strategy', desc: 'Channel plans built around your goals' },
      { name: 'SEO', desc: 'Technical, on-page, content' },
      { name: 'Paid Ads', desc: 'Google, Meta, X/Twitter, crypto-native ad networks' },
      { name: 'Social Media Management', desc: 'Always-on presence, run for you' },
      { name: 'Content Marketing', desc: 'Blogs, newsletters, video' },
      { name: 'Email Marketing & Automation', desc: 'Flows that nurture and convert' },
      { name: 'Growth & Performance Marketing', desc: 'Measured, compounding acquisition' },
    ],
  },
];
