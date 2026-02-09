import { cookies } from 'next/headers';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
}

const SESSION_COOKIE_NAME = 'session';
const SESSION_COOKIE_VALUE = 'active';
const DEMO_EMAIL = process.env.DEMO_EMAIL ?? 'demo@example.com';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? 'demo123';
const DEMO_USER: AuthUser = {
  id: 'demo-user',
  email: DEMO_EMAIL,
  name: 'Usuario Demo',
  company: 'Demo Company',
};

export async function getSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || sessionCookie.value !== SESSION_COOKIE_VALUE) {
      return null;
    }

    return DEMO_USER;
  } catch (error) {
    console.error('getSession error:', error);
    return null;
  }
}

export async function login(email: string, password: string): Promise<AuthUser | null> {
  try {
    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      return null;
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return DEMO_USER;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getSession();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}
