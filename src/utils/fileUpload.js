const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const ACCEPTED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

const MAX_SIZE = {
  logo: 5 * 1024 * 1024,
  seal: 3 * 1024 * 1024,
  signature: 2 * 1024 * 1024,
};

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file, { maxSize = MAX_SIZE.signature, acceptedTypes = ACCEPTED_IMAGE_TYPES } = {}) {
  if (!file) return { valid: false, error: 'No file provided' };
  if (!acceptedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Accepted: ${acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}` };
  }
  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024));
    return { valid: false, error: `File too large. Maximum size: ${maxMB}MB` };
  }
  return { valid: true, error: null };
}

export async function processImageUpload(file, options = {}) {
  const { type = 'signature', onError } = options;
  const validation = validateImageFile(file, { maxSize: MAX_SIZE[type] || MAX_SIZE.signature });
  if (!validation.valid) {
    if (onError) onError(validation.error);
    return { success: false, dataUrl: null, error: validation.error };
  }
  try {
    const dataUrl = await readFileAsDataUrl(file);
    return { success: true, dataUrl, error: null };
  } catch (err) {
    const error = 'Failed to read file';
    if (onError) onError(error);
    return { success: false, dataUrl: null, error };
  }
}

export function generateSignatureId() {
  return `sig_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export { MAX_SIZE, ACCEPTED_IMAGE_TYPES, ACCEPTED_LOGO_TYPES };
