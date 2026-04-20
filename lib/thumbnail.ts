const GRADIENTS = [
  'linear-gradient(135deg, #0f1f44 0%, #1e0f44 100%)',
  'linear-gradient(135deg, #0a2d1a 0%, #0a1a2d 100%)',
  'linear-gradient(135deg, #2d0a2d 0%, #0a0a2d 100%)',
  'linear-gradient(135deg, #1a0a30 0%, #300a10 100%)',
  'linear-gradient(135deg, #0a1a0a 0%, #0a2d1a 100%)',
  'linear-gradient(135deg, #2d1a0a 0%, #1a0a30 100%)',
];

export function getPostGradient(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}
