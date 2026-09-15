# GitHealth — client

React 19 + Vite + Tailwind CSS 4 single-page app for the GitHub Repository
Health Dashboard.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production bundle in dist/
npm run lint
```

The app talks to the API at `http://localhost:5000/api` by default; override it
at runtime on the **Settings** page (stored per-browser in `localStorage`).

See the [root README](../README.md) for the full stack, environment variables,
and API reference.
