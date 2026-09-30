import { isAuthed } from '../../../lib/admin-auth.js';
import {
  createProject,
  deleteProjectBySlug,
  getProjectBySlug,
  listProjects,
  updateProject,
} from '../../../lib/content-store.js';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

const unauthorized = () => json({ error: 'Unauthorized' }, 401);

// Comma-separated form field -> trimmed array
const toList = (text) =>
  String(text ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const fromForm = (formData) => ({
  title: formData.get('title'),
  tagline: formData.get('tagline'),
  category: formData.get('category'),
  year: formData.get('year'),
  status: formData.get('status'),
  work: toList(formData.get('work')),
  stack: toList(formData.get('stack')),
  link: formData.get('link') || null,
  featured: formData.get('featured') === 'on',
});

export const GET = async ({ request }) => {
  try {
    const slug = new URL(request.url).searchParams.get('slug');
    if (slug) {
      const project = await getProjectBySlug(slug);
      return project ? json(project) : json({ error: 'Project not found' }, 404);
    }
    return json(await listProjects());
  } catch (error) {
    return json({ error: 'Failed to read projects', details: error.message }, 500);
  }
};

export const POST = async ({ request, cookies }) => {
  if (!isAuthed(cookies)) return unauthorized();
  try {
    const payload = fromForm(await request.formData());
    if (!payload.title || !payload.category) {
      return json({ error: 'Title and category are required' }, 400);
    }
    return json(await createProject(payload), 201);
  } catch (error) {
    return json({ error: 'Failed to save project', details: error.message }, 500);
  }
};

export const PUT = async ({ request, cookies }) => {
  if (!isAuthed(cookies)) return unauthorized();
  try {
    const formData = await request.formData();
    const slug = formData.get('slug');
    if (!slug) return json({ error: 'Slug is required' }, 400);
    const updated = await updateProject(slug, fromForm(formData));
    return updated ? json(updated) : json({ error: 'Project not found' }, 404);
  } catch (error) {
    return json({ error: 'Failed to update project', details: error.message }, 500);
  }
};

export const DELETE = async ({ request, cookies }) => {
  if (!isAuthed(cookies)) return unauthorized();
  try {
    const slug = new URL(request.url).searchParams.get('slug');
    if (!slug) return json({ error: 'Slug is required' }, 400);
    await deleteProjectBySlug(slug);
    return json({ success: true });
  } catch (error) {
    return json({ error: 'Failed to delete project', details: error.message }, 500);
  }
};
