import { createHmac, timingSafeEqual } from 'node:crypto';

// Dev-only fallback credentials — never active in production builds.
const DEV_EMAIL = 'admin@kliff.io';
const DEV_PASSWORD = 'kliff';

export const adminCreds = () => {
  const email = import.meta.env.ADMIN_EMAIL;
  const password = import.meta.env.ADMIN_PASSWORD;
  if (email && password) return { email, password, isDevDefault: false };
  if (import.meta.env.DEV) return { email: DEV_EMAIL, password: DEV_PASSWORD, isDevDefault: true };
  return null; // prod without env: admin is disabled
};

// Cookie carries an HMAC derived from the admin password, so it can't be
// forged by simply setting a known literal (unlike a static marker value).
const sign = (password) =>
  createHmac('sha256', password).update('kliff-admin-session').digest('hex');

export const sessionValue = () => {
  const creds = adminCreds();
  return creds ? sign(creds.password) : null;
};

export const setSessionCookie = (cookies) => {
  cookies.set('admin_session', sessionValue(), {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day, same as blockmob
  });
};

export const clearSessionCookie = (cookies) => {
  cookies.delete('admin_session', { path: '/' });
};

export const isAuthed = (cookies) => {
  const expected = sessionValue();
  const value = cookies.get('admin_session')?.value;
  if (!expected || !value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};
