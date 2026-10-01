/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_CALENDAR_BOOKING_URL?: string
  readonly PUBLIC_GISCUS_REPO?: `${string}/${string}`
  readonly PUBLIC_GISCUS_REPO_ID?: string
  readonly PUBLIC_GISCUS_CATEGORY?: string
  readonly PUBLIC_GISCUS_CATEGORY_ID?: string
  readonly PUBLIC_UMAMI_WEBSITE_ID?: string
  readonly PUBLIC_UMAMI_SCRIPT_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
