/**
 * API utility for communicating with Flask backend.
 */

const API_BASE = '/api';
const DIRECT_API_BASE = 'http://127.0.0.1:5000/api';

async function fetchWithFallback(urlPath, options) {
  try {
    const response = await fetch(`${API_BASE}${urlPath}`, options);
    if (response.ok || response.status === 400 || response.status === 422) {
      return response;
    }
  } catch (err) {
    console.warn(`Proxy fetch failed for ${urlPath}, attempting direct connect:`, err);
  }
  return await fetch(`${DIRECT_API_BASE}${urlPath}`, options);
}

export async function verifyFilesApi(originalFile, downloadedFile) {
  const formData = new FormData();
  formData.append('original_file', originalFile);
  formData.append('downloaded_file', downloadedFile);

  const response = await fetchWithFallback('/verify', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Server error occurred' }));
    throw new Error(errorData.error || `HTTP ${response.status} Verification failed`);
  }

  return await response.json();
}

export async function corruptDemoApi(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetchWithFallback('/corrupt-demo', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Server error occurred' }));
    throw new Error(errorData.error || `HTTP ${response.status} Corruption demo failed`);
  }

  return await response.json();
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Backend health check warning:", err);
  }

  try {
    const response = await fetch(`${DIRECT_API_BASE}/health`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Backend direct health check failed:", err);
  }

  return { status: "offline" };
}
