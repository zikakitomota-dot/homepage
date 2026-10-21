export function permanentRedirect(request: Request, pathname: string) {
  const source = new URL(request.url);
  const destination = new URL(pathname, source.origin);
  destination.search = source.search;

  return new Response(null, {
    status: 301,
    headers: {
      Location: destination.href,
      'Cache-Control': 'public, max-age=0, s-maxage=31536000',
    },
  });
}
