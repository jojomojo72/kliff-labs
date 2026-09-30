import { isAuthed } from '../../../lib/admin-auth.js';
import { createBlog, deleteBlogById, getBlogById, listBlogs, updateBlog } from '../../../lib/content-store.js';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

const unauthorized = () => json({ error: 'Unauthorized' }, 401);

// Blank-line-separated textarea -> paragraphs array
const toParagraphs = (text) =>
  String(text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const fromForm = (formData) => ({
  title: formData.get('title'),
  description: formData.get('description'),
  category: formData.get('category'),
  publisher: formData.get('publisher') || 'Kliff Labs',
  author: formData.get('author') || 'Kliff Labs Team',
  publishDate: formData.get('publishDate'),
  readTime: Number(formData.get('readTime')) || 3,
  content: toParagraphs(formData.get('content')),
});

export const GET = async ({ request }) => {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (id) {
      const blog = await getBlogById(id);
      return blog ? json(blog) : json({ error: 'Blog not found' }, 404);
    }
    return json(await listBlogs());
  } catch (error) {
    return json({ error: 'Failed to read blogs', details: error.message }, 500);
  }
};

export const POST = async ({ request, cookies }) => {
  if (!isAuthed(cookies)) return unauthorized();
  try {
    const payload = fromForm(await request.formData());
    if (!payload.title || !payload.description) {
      return json({ error: 'Title and description are required' }, 400);
    }
    return json(await createBlog(payload), 201);
  } catch (error) {
    return json({ error: 'Failed to save blog', details: error.message }, 500);
  }
};

export const PUT = async ({ request, cookies }) => {
  if (!isAuthed(cookies)) return unauthorized();
  try {
    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (!id) return json({ error: 'ID is required' }, 400);
    const updated = await updateBlog(id, fromForm(formData));
    return updated ? json(updated) : json({ error: 'Blog not found' }, 404);
  } catch (error) {
    return json({ error: 'Failed to update blog', details: error.message }, 500);
  }
};

export const DELETE = async ({ request, cookies }) => {
  if (!isAuthed(cookies)) return unauthorized();
  try {
    const id = Number(new URL(request.url).searchParams.get('id'));
    if (!id) return json({ error: 'ID is required' }, 400);
    await deleteBlogById(id);
    return json({ success: true });
  } catch (error) {
    return json({ error: 'Failed to delete blog', details: error.message }, 500);
  }
};
