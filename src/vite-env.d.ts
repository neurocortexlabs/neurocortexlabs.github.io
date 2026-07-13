/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional POST endpoint for the mailing-list form — any service that accepts
   * a JSON body with an `email` field (Formspree, Buttondown, a Worker, …).
   *
   * GitHub Pages cannot run server code, so when this is unset the signup form
   * degrades to a plain mailto link rather than pretending to submit.
   */
  readonly VITE_SIGNUP_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
