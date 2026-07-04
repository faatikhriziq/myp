// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://faatikhriziq.my.id',
  output: 'static',
  adapter: cloudflare(),
  integrations: [sitemap(), mdx()],
});
