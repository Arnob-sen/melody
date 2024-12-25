'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateData() {
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/playlists', 'layout');
    revalidatePath('/playlists/[playlistId]', 'layout');
  } catch (error) {
    console.error('Error revalidating paths:', error);
  }
}
