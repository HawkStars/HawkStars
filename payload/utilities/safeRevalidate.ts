import { revalidatePath, revalidateTag } from 'next/cache';

// Next's revalidate functions throw ("static generation store missing") when
// called outside a Next request — e.g. from `payload run` scripts, migrations
// or the dev seed in `onInit`. There is no Next cache to invalidate there, so
// skipping is the correct behaviour rather than failing the whole write.
const isOutsideNext = (error: unknown) =>
  error instanceof Error && error.message.includes('static generation store missing');

export function safeRevalidateTag(tag: string) {
  try {
    revalidateTag(tag, 'max');
  } catch (error) {
    if (!isOutsideNext(error)) throw error;
  }
}

export function safeRevalidatePath(path: string, type?: 'layout' | 'page') {
  try {
    revalidatePath(path, type);
  } catch (error) {
    if (!isOutsideNext(error)) throw error;
  }
}
