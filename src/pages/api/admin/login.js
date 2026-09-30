import { adminCreds, setSessionCookie } from '../../../lib/admin-auth.js';

export const POST = async ({ request, cookies }) => {
  let body;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(JSON.stringify({ message: 'Invalid JSON body provided.' }), { status: 400 });
  }

  const creds = adminCreds();
  if (!creds) {
    return new Response(
      JSON.stringify({ message: 'Admin is disabled: set ADMIN_EMAIL and ADMIN_PASSWORD.' }),
      { status: 500 }
    );
  }

  if (body.email === creds.email && body.password === creds.password) {
    setSessionCookie(cookies);
    return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });
  }

  return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
};
