export const isValidImageUrl = (url) => {
  const pattern = /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/i;
  return pattern.test(url);
};