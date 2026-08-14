import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'awesome-docker';
const isGitHubPages = Boolean(process.env.GITHUB_ACTIONS);
const base = isGitHubPages ? `/${repository}` : '';

export default defineConfig({
  site: 'https://enwaiax.github.io',
  base,
  output: 'static',
  integrations: [sitemap()],
  vite: {
    base,
  },
});
