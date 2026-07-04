import type { APIRoute } from 'astro';

const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://faatikhriziq.my.id/sitemap-index.xml
`;

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
