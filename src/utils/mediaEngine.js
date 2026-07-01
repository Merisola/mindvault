// src/utils/mediaEngine.js

/**
 * Compresses an image data URL down to maximum web-safe bounds to safeguard IndexedDB storage.
 * @param {string} base64Str - Source base64 data stream
 * @param {number} maxWidth - Upper horizontal scale constraint
 * @param {number} maxHeight - Upper vertical scale constraint
 * @returns {Promise<string>} Downsampled base64 image data string
 */
export const downsampleImage = (base64Str, maxWidth = 800, maxHeight = 600) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate perfect aspect ratio coefficients
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Export at balanced web compression quality (75%)
      const idealDataUrl = canvas.toDataURL("image/jpeg", 0.75);
      resolve(idealDataUrl);
    };

    img.onerror = (err) => reject(err);
  });
};

/**
 * Generates an elegant, stable abstract gradient background based on a node's string token seed.
 * @param {string} seedText - A string token (e.g., auto_title) to keep color selections permanent per node
 * @returns {string} Tailwind inline CSS background style properties matrix
 */
export const generateAbstractCanvasVibe = (seedText = "vibe") => {
  const gradients = [
    "from-moment/20 to-vibe/10",
    "from-spark/20 to-moment/10",
    "from-vibe/20 to-reminder/10",
    "from-reminder/20 to-spark/10",
    "from-accentCustom/15 to-surface",
  ];

  // Calculate deterministic index string map
  let score = 0;
  for (let i = 0; i < seedText.length; i++) {
    score += seedText.charCodeAt(i);
  }

  const designIndex = score % gradients.length;
  return `bg-gradient-to-br ${gradients[designIndex]}`;
};
