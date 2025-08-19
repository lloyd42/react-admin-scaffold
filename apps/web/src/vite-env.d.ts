/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Public path for static assets */
    readonly VITE_APP_PUBLIC_PATH: string;
    /** Base URL for API endpoints */
    readonly VITE_APP_API_BASE_URL: string;
    /** Current mode for request */
    readonly VITE_APP_API_MODE:string
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}