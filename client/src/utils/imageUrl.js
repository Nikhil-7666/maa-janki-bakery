/**
 * Returns the correct image URL for a product image.
 * - New uploads: stored as full Cloudinary URLs → used directly.
 * - Old uploads: stored as bare filenames → prefixed with backendUrl/products/.
 */
export const getImageUrl = (image, backendUrl) => {
  if (!image) return "/placeholder.png";
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image; // Already a full Cloudinary URL
  }
  return `${backendUrl}/products/${image}`; // Legacy local file
};
