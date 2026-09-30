import projectsData from './projects.json';

export interface Project {
  slug: string;
  title: string;
  tagline: string; // noir-style caption: "Title — tagline"
  category: 'Web' | 'App' | 'Web3' | 'Branding';
  year: string;
  status: 'live' | 'in-progress';
  work: string[]; // what was done — blockmob-style explanation
  stack: string[];
  link?: string;
  featured?: boolean;
}

// Data lives in projects.json so the admin panel can edit it (file backend)
// or seed Supabase. Pages should read via src/lib/content-store.js so admin
// edits show without a rebuild; this export is the typed seed/fallback.
export const projects = projectsData as Project[];
