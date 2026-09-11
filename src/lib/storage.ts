import { supabase } from './supabase'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']

/**
 * Uploads an image to a public Supabase Storage bucket under `{userId}/…`
 * (the storage policies only allow writes to the caller's own folder) and
 * returns its public URL.
 */
export async function uploadImage(bucket: 'avatars' | 'company-logos', userId: string, file: File): Promise<string> {
  if (!ALLOWED.includes(file.type)) throw new Error('Please choose a PNG, JPEG, WebP or SVG image.')
  if (file.size > MAX_BYTES) throw new Error('Image must be smaller than 5 MB.')
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const path = `${userId}/${bucket === 'avatars' ? 'avatar' : 'logo'}-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })
  if (error) throw error
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}
