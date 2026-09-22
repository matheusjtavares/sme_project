/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend API base URL, baked in at build time (e.g. https://app.onrender.com/api). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}