import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Content store for blogs + projects (same pattern as blockmob's stores):
// Supabase when configured, otherwise the JSON files in src/data — reads
// always work; file writes are dev-only (serverless prod FS is read-only).

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const FILE = { blogs: 'blogs.json', projects: 'projects.json' };

let supabaseClient;

const hasSupabase = () =>
  Boolean(import.meta.env.SUPABASE_URL && import.meta.env.SUPABASE_SERVICE_ROLE_KEY);

const getSupabase = () => {
  if (!hasSupabase()) return null;
  if (supabaseClient) return supabaseClient;
  supabaseClient = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  return supabaseClient;
};

// ---------- file backend ----------

const readRows = (kind) => {
  const file = path.join(DATA_DIR, FILE[kind]);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf-8') || '[]');
};

const writeRows = (kind, rows) => {
  if (import.meta.env.PROD) {
    throw new Error(
      'Saving without Supabase is dev-only. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in production.'
    );
  }
  fs.writeFileSync(path.join(DATA_DIR, FILE[kind]), JSON.stringify(rows, null, 2) + '\n');
};

// ---------- blogs ----------

const blogFromRow = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  category: row.category,
  publisher: row.publisher,
  author: row.author,
  publishDate: row.publish_date,
  readTime: row.read_time,
  content: row.content ?? [],
});

const blogToRow = (b) => ({
  title: b.title,
  description: b.description,
  category: b.category ?? null,
  publisher: b.publisher ?? null,
  author: b.author ?? null,
  publish_date: b.publishDate ?? null,
  read_time: b.readTime ? Number(b.readTime) : null,
  content: b.content ?? [],
});

export const listBlogs = async () => {
  const supabase = getSupabase();
  if (!supabase) return readRows('blogs');
  const { data, error } = await supabase.from('blogs').select('*').order('id', { ascending: true });
  if (error) throw error;
  return (data || []).map(blogFromRow);
};

export const getBlogById = async (id) => {
  const numericId = Number(id);
  if (!numericId) return null;
  const supabase = getSupabase();
  if (!supabase) return readRows('blogs').find((b) => Number(b.id) === numericId) ?? null;
  const { data, error } = await supabase.from('blogs').select('*').eq('id', numericId).maybeSingle();
  if (error) throw error;
  return data ? blogFromRow(data) : null;
};

export const createBlog = async (payload) => {
  const supabase = getSupabase();
  if (!supabase) {
    const rows = readRows('blogs');
    const blog = { id: Math.max(0, ...rows.map((b) => Number(b.id) || 0)) + 1, ...payload };
    writeRows('blogs', [...rows, blog]);
    return blog;
  }
  const { data, error } = await supabase.from('blogs').insert(blogToRow(payload)).select('*').single();
  if (error) throw error;
  return blogFromRow(data);
};

export const updateBlog = async (id, payload) => {
  const numericId = Number(id);
  if (!numericId) return null;
  const supabase = getSupabase();
  if (!supabase) {
    const rows = readRows('blogs');
    const i = rows.findIndex((b) => Number(b.id) === numericId);
    if (i === -1) return null;
    rows[i] = { ...rows[i], ...payload, id: numericId };
    writeRows('blogs', rows);
    return rows[i];
  }
  const { data, error } = await supabase
    .from('blogs')
    .update(blogToRow(payload))
    .eq('id', numericId)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data ? blogFromRow(data) : null;
};

export const deleteBlogById = async (id) => {
  const numericId = Number(id);
  if (!numericId) return false;
  const supabase = getSupabase();
  if (!supabase) {
    const rows = readRows('blogs');
    writeRows('blogs', rows.filter((b) => Number(b.id) !== numericId));
    return true;
  }
  const { error } = await supabase.from('blogs').delete().eq('id', numericId);
  if (error) throw error;
  return true;
};

// ---------- projects ----------

const projectFromRow = (row) => ({
  slug: row.slug,
  title: row.title,
  tagline: row.tagline,
  category: row.category,
  year: row.year,
  status: row.status,
  work: row.work ?? [],
  stack: row.stack ?? [],
  ...(row.link ? { link: row.link } : {}),
  ...(row.featured ? { featured: true } : {}),
});

const projectToRow = (p) => ({
  slug: p.slug,
  title: p.title,
  tagline: p.tagline ?? '',
  category: p.category,
  year: p.year ?? '',
  status: p.status ?? 'live',
  work: p.work ?? [],
  stack: p.stack ?? [],
  link: p.link || null,
  featured: Boolean(p.featured),
});

export const slugify = (title) =>
  String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const listProjects = async () => {
  const supabase = getSupabase();
  if (!supabase) return readRows('projects');
  const { data, error } = await supabase.from('projects').select('*').order('year', { ascending: false });
  if (error) throw error;
  return (data || []).map(projectFromRow);
};

export const getProjectBySlug = async (slug) => {
  if (!slug) return null;
  const supabase = getSupabase();
  if (!supabase) return readRows('projects').find((p) => p.slug === slug) ?? null;
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? projectFromRow(data) : null;
};

export const createProject = async (payload) => {
  const project = projectFromRow(projectToRow({ ...payload, slug: payload.slug || slugify(payload.title) }));
  if (await getProjectBySlug(project.slug)) {
    throw new Error(`A project with slug "${project.slug}" already exists.`);
  }
  const supabase = getSupabase();
  if (!supabase) {
    writeRows('projects', [...readRows('projects'), project]);
    return project;
  }
  const { data, error } = await supabase.from('projects').insert(projectToRow(project)).select('*').single();
  if (error) throw error;
  return projectFromRow(data);
};

export const updateProject = async (slug, payload) => {
  const supabase = getSupabase();
  if (!supabase) {
    const rows = readRows('projects');
    const i = rows.findIndex((p) => p.slug === slug);
    if (i === -1) return null;
    rows[i] = projectFromRow(projectToRow({ ...rows[i], ...payload, slug }));
    writeRows('projects', rows);
    return rows[i];
  }
  const { data, error } = await supabase
    .from('projects')
    .update(projectToRow({ ...payload, slug }))
    .eq('slug', slug)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data ? projectFromRow(data) : null;
};

export const deleteProjectBySlug = async (slug) => {
  if (!slug) return false;
  const supabase = getSupabase();
  if (!supabase) {
    writeRows('projects', readRows('projects').filter((p) => p.slug !== slug));
    return true;
  }
  const { error } = await supabase.from('projects').delete().eq('slug', slug);
  if (error) throw error;
  return true;
};
