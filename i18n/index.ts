import { createInstance, type i18n as I18nInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions } from './settings';

const createI18nextInstance = async (lng: string, ns: string[] | string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(lng, ns));
  return i18nInstance;
};

/**
 * One i18next instance per (language, namespace-set), created lazily and then
 * reused.
 *
 * This used to create a brand new instance — plus a fresh dynamic `import()` of
 * the locale JSON — on *every call*, i.e. on every render of every async server
 * component that translates. That is unbounded allocation driven by render
 * count, which is fine when a render happens once per request but is a memory
 * bomb anywhere a component re-renders in a loop (Storybook with
 * `features.experimentalRSC` wraps stories in `<Suspense>`, so an async
 * component that returns a new promise on each attempt never settles).
 *
 * Caching by key is safe because an instance is only ever read through
 * `getFixedT`: it is initialised with a fixed `lng`/`ns` and nothing in the app
 * mutates it afterwards (no `changeLanguage` on the server), so two callers
 * asking for the same language and namespaces cannot observe each other. The
 * previous "new instance per render" note was about parallel *different*
 * renders sharing one global instance — keying on lng + ns rules that out.
 */
const instanceCache = new Map<string, Promise<I18nInstance>>();

const cacheKey = (lng: string, ns: string[] | string) =>
  `${lng}::${Array.isArray(ns) ? [...ns].sort().join(',') : ns}`;

const initI18next = (lng: string, ns: string[] | string): Promise<I18nInstance> => {
  const key = cacheKey(lng, ns);
  const cached = instanceCache.get(key);
  if (cached) return cached;

  const pending = createI18nextInstance(lng, ns).catch((error) => {
    instanceCache.delete(key);
    throw error;
  });
  instanceCache.set(key, pending);
  return pending;
};

const translationCache = new Map<string, Promise<{ t: TFunction; i18n: I18nInstance }>>();

type TFunction = ReturnType<I18nInstance['getFixedT']>;

/**
 * Deliberately not an `async function`: an async function allocates a new
 * promise on every call, and callers that re-render (see above) depend on
 * getting back the *same* settled promise so the render can complete.
 */
export function getServerTranslation(
  lng: string,
  ns: string[] | string,
  options?: { keyPrefix: string }
): Promise<{ t: TFunction; i18n: I18nInstance }> {
  const key = `${cacheKey(lng, ns)}::${options?.keyPrefix ?? ''}`;
  const cached = translationCache.get(key);
  if (cached) return cached;

  const pending = initI18next(lng, ns)
    .then((i18nextInstance) => ({
      t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options?.keyPrefix),
      i18n: i18nextInstance,
    }))
    .catch((error) => {
      translationCache.delete(key);
      throw error;
    });
  translationCache.set(key, pending);
  return pending;
}
