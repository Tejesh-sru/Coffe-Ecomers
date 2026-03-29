const API_BASE_URL = 'http://localhost:8081/api';

const buildHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'Request failed';
    throw new Error(message);
  }

  return payload;
};

export const api = {
  register: async (data) =>
    request('/auth/register', {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }),

  login: async (data) =>
    request('/auth/login', {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }),

  getProfile: async (token) =>
    request('/auth/profile', {
      method: 'GET',
      headers: buildHeaders(token),
    }),

  updateProfile: async (token, data) =>
    request('/auth/profile', {
      method: 'PUT',
      headers: buildHeaders(token),
      body: JSON.stringify(data),
    }),

  getCart: async (token) =>
    request('/cart', {
      method: 'GET',
      headers: buildHeaders(token),
    }),

  addToCart: async (token, item) =>
    request('/cart/add', {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify(item),
    }),

  updateCartQuantity: async (token, item) =>
    request('/cart/quantity', {
      method: 'PUT',
      headers: buildHeaders(token),
      body: JSON.stringify(item),
    }),

  removeFromCart: async (token, productName) =>
    request(`/cart/${encodeURIComponent(productName)}`, {
      method: 'DELETE',
      headers: buildHeaders(token),
    }),

  clearCart: async (token) =>
    request('/cart/clear', {
      method: 'DELETE',
      headers: buildHeaders(token),
    }),
};
