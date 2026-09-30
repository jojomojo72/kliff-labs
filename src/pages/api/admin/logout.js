import { clearSessionCookie } from '../../../lib/admin-auth.js';

export const POST = async ({ cookies }) => {
  clearSessionCookie(cookies);
  return new Response(JSON.stringify({ message: 'Logged out successfully' }), { status: 200 });
};
