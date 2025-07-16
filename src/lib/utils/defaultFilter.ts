import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export async function getDefaultFilter(
  url: string,
  cookieStore?: ReadonlyRequestCookies
) {
  const headers: HeadersInit = cookieStore
    ? { Cookie: cookieStore.toString() }
    : {};

  const res = await fetch(`${process.env.NEXT_LOCAL_SITE_URL}${url}`, {
    cache: 'no-store',
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch API: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json?.data?.[0]?.year ?? json?.[0]?.year ?? null;
}