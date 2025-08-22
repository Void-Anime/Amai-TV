// Utility function to generate a slug from a title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Utility function to create title URL
export function createTitleUrl(title: string, postId?: number): string {
  const slug = generateSlug(title);
  return postId ? `/title/${slug}?post_id=${postId}` : `/title/${slug}`;
}
