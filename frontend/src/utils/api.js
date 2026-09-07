/**
 * API utility for communicating with Flask backend.
 */

const API_BASE = '/api';

export async function verifyFilesApi(originalFile, downloadedFile) {
  const formData = new FormData();
  formData.append('original_file', originalFile);
  formData.append('downloaded_file', downloadedFile);

  const response = await fetch(`${API_BASE}/verify`, {
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

  const response = await fetch(`${API_BASE}/corrupt-demo`, {
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
  return { status: "offline" };
}
