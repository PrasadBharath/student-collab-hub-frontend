const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function fetchPosts(token, skip = 0, limit = 20) {
  const res = await fetch(`${API_BASE_URL}/api/posts?skip=${skip}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function createPost(data, token) {
  const formData = new FormData();
  formData.append('type', data.type);
  formData.append('title', data.title);
  formData.append('content', data.content || '');
  formData.append('tags', (data.tags || []).join(','));
  if (data.file) formData.append('file', data.file);
  if (data.jobLink) formData.append('jobLink', data.jobLink);
  if (data.referrals) formData.append('referrals', data.referrals);
  if (data.description) formData.append('description', data.description);
  const res = await fetch(`${API_BASE_URL}/api/posts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
      // Do NOT set Content-Type; browser will set it for FormData
    },
    body: formData
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function likePost(id, token) {
  const res = await fetch(`${API_BASE_URL}/api/posts/${id}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to like post');
  return res.json();
}

export async function commentPost(id, text, token) {
  const formData = new FormData();
  formData.append('text', text);
  const res = await fetch(`${API_BASE_URL}/api/posts/${id}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  if (!res.ok) throw new Error('Failed to comment');
  return res.json();
}

export async function uploadFile(file, token) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error('Failed to upload file');
  return res.json();
}

export async function deletePost(id, token) {
  const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return res.json();
}

export async function updatePost(id, data, token) {
  const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
} 