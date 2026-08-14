# Awesome Docker website

The project catalog and deployment guide are built with [Astro](https://astro.build/) and deployed as a static GitHub Pages site.

## Local development

```bash
cd site
npm install
npm run dev
```

## Validation

```bash
npm run check
npm run build
```

Project metadata lives in `src/data/projects.ts`. Keep deployment commands aligned with the corresponding project directory and settlement/runtime behavior.

The production build automatically uses `/awesome-docker` as its base path when it runs in GitHub Actions. Local development uses `/`.
