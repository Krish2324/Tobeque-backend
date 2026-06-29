const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Extract the Cloudinary public_id from a full Cloudinary URL.
 * Example URL:
 *   https://res.cloudinary.com/mycloud/image/upload/v1234567890/tobeque/products/image-123.jpg
 * Returns:
 *   tobeque/products/image-123
 *
 * Also handles video resource types.
 */
const extractPublicId = (url) => {
  if (!url || typeof url !== 'string') return null;
  // Only process Cloudinary URLs
  if (!url.includes('cloudinary.com')) return null;

  try {
    // Remove query-string if present
    const cleanUrl = url.split('?')[0];

    // Match anything after /upload/v<version>/ or /upload/
    const match = cleanUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) return null;

    // Strip the file extension to get the public_id
    const withExt = match[1];
    const publicId = withExt.replace(/\.[^/.]+$/, '');
    return publicId;
  } catch {
    return null;
  }
};

/**
 * Delete one Cloudinary asset by its stored URL.
 * Tries image first, then video if image deletion says "not found".
 * Silently swallows errors so a missing asset never blocks a DB delete.
 */
const deleteCloudinaryAsset = async (url) => {
  const publicId = extractPublicId(url);
  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
    if (result.result === 'not found') {
      // May be a video
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video', invalidate: true });
    }
  } catch (err) {
    // Non-fatal — log and continue
    console.warn(`[Cloudinary] Could not delete asset "${publicId}":`, err.message);
  }
};

/**
 * Delete multiple Cloudinary assets from an array of URLs.
 * Runs all deletions in parallel.
 */
const deleteCloudinaryAssets = async (urls = []) => {
  const filtered = (urls || []).filter(Boolean);
  if (filtered.length === 0) return;
  await Promise.all(filtered.map(deleteCloudinaryAsset));
};

module.exports = { deleteCloudinaryAsset, deleteCloudinaryAssets, extractPublicId };
