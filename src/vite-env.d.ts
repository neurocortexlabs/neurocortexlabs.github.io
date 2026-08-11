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

  /**
   * Optional POST endpoint for the intake form, which carries a résumé file and
   * so must accept `multipart/form-data`.
   *
   * Until this is set the form is a working preview that submits nowhere, and
   * says so. It must stay that way: a résumé is personal data, and a form that
   * looks like it filed something when it did not is worse than no form.
   */
  readonly VITE_INTAKE_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
