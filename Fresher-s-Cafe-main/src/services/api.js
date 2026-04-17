const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const OFFLINE_MODE = String(import.meta.env.VITE_OFFLINE_MODE || '').toLowerCase() === 'true';

const LOCAL_USERS_KEY = 'offline_users_v1';
const LOCAL_CARTS_KEY = 'offline_carts_v1';
const LOCAL_TOKEN_PREFIX = 'local:';

const buildHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const isNetworkError = (error) => {
  if (!error) {
    return false;
  }

  if (error instanceof TypeError) {
    return true;
  }

  const message = String(error.message || '').toLowerCase();
  return (
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('network request failed') ||
    message.includes('load failed')
  );
};

const shouldForceLocalMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const isHttpsPage = window.location.protocol === 'https:';
  const pointsToLocalApi =
    API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');

  return isHttpsPage && pointsToLocalApi;
};

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const createLocalToken = (email) => `${LOCAL_TOKEN_PREFIX}${normalizeEmail(email)}`;

const getEmailFromToken = (token) => {
  if (!token || !String(token).startsWith(LOCAL_TOKEN_PREFIX)) {
    return null;
  }
  return String(token).slice(LOCAL_TOKEN_PREFIX.length);
};

const getLocalUsers = () => readJSON(LOCAL_USERS_KEY, []);

const setLocalUsers = (users) => writeJSON(LOCAL_USERS_KEY, users);

const getLocalCarts = () => readJSON(LOCAL_CARTS_KEY, {});

const setLocalCarts = (carts) => writeJSON(LOCAL_CARTS_KEY, carts);

const requireLocalUserByToken = (token) => {
  const email = getEmailFromToken(token);
  if (!email) {
    throw new Error('Please login first');
  }

  const users = getLocalUsers();
  const user = users.find((item) => item.email === email);
  if (!user) {
    throw new Error('Please login first');
  }

  return user;
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

const registerLocal = async (data) => {
  const username = String(data?.username || '').trim();
  const email = normalizeEmail(data?.email);
  const password = String(data?.password || '');

  if (!username || !email || !password) {
    throw new Error('All fields are required');
  }

  const users = getLocalUsers();
  if (users.some((item) => item.email === email)) {
    throw new Error('User already exists with this email');
  }

  const nextUsers = [...users, { username, email, password }];
  setLocalUsers(nextUsers);

  return { token: createLocalToken(email), username, email };
};

const loginLocal = async (data) => {
  const email = normalizeEmail(data?.email);
  const password = String(data?.password || '');

  const users = getLocalUsers();
  const user = users.find((item) => item.email === email);

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }

  return { token: createLocalToken(email), username: user.username, email: user.email };
};

const getProfileLocal = async (token) => {
  const user = requireLocalUserByToken(token);
  return { username: user.username, email: user.email };
};

const updateProfileLocal = async (token, data) => {
  const email = getEmailFromToken(token);
  const username = String(data?.username || '').trim();

  if (!email) {
    throw new Error('Please login first');
  }

  if (!username) {
    throw new Error('Username is required');
  }

  const users = getLocalUsers();
  const nextUsers = users.map((item) => (item.email === email ? { ...item, username } : item));
  setLocalUsers(nextUsers);

  const updated = nextUsers.find((item) => item.email === email);
  return { username: updated.username, email: updated.email };
};

const getCartLocal = async (token) => {
  const user = requireLocalUserByToken(token);
  const carts = getLocalCarts();
  return carts[user.email] || [];
};

const saveCartForToken = (token, items) => {
  const user = requireLocalUserByToken(token);
  const carts = getLocalCarts();
  const nextCarts = {
    ...carts,
    [user.email]: items,
  };
  setLocalCarts(nextCarts);
  return nextCarts[user.email];
};

const addToCartLocal = async (token, item) => {
  const existing = await getCartLocal(token);
  const normalizedName = String(item?.name || '');
  const quantityToAdd = Number(item?.quantity) || 1;
  const index = existing.findIndex((entry) => entry.name === normalizedName);

  if (index === -1) {
    return saveCartForToken(token, [
      ...existing,
      {
        name: normalizedName,
        price: Number(item?.price) || 0,
        image: item?.image || '',
        quantity: quantityToAdd,
      },
    ]);
  }

  const updated = existing.map((entry, idx) =>
    idx === index ? { ...entry, quantity: entry.quantity + quantityToAdd } : entry
  );
  return saveCartForToken(token, updated);
};

const updateCartQuantityLocal = async (token, item) => {
  const existing = await getCartLocal(token);
  const name = String(item?.name || '');
  const quantity = Number(item?.quantity) || 1;
  const updated = existing
    .map((entry) => (entry.name === name ? { ...entry, quantity } : entry))
    .filter((entry) => entry.quantity > 0);

  return saveCartForToken(token, updated);
};

const removeFromCartLocal = async (token, productName) => {
  const existing = await getCartLocal(token);
  const updated = existing.filter((entry) => entry.name !== productName);
  return saveCartForToken(token, updated);
};

const clearCartLocal = async (token) => saveCartForToken(token, []);

const withLocalFallback = async (remoteCall, localCall) => {
  if (OFFLINE_MODE) {
    return localCall();
  }

  if (shouldForceLocalMode()) {
    return localCall();
  }

  try {
    return await remoteCall();
  } catch (error) {
    if (isNetworkError(error)) {
      return localCall();
    }
    throw error;
  }
};

export const api = {
  register: async (data) =>
    withLocalFallback(
      () =>
        request('/auth/register', {
          method: 'POST',
          headers: buildHeaders(),
          body: JSON.stringify(data),
        }),
      () => registerLocal(data)
    ),

  login: async (data) =>
    withLocalFallback(
      () =>
        request('/auth/login', {
          method: 'POST',
          headers: buildHeaders(),
          body: JSON.stringify(data),
        }),
      () => loginLocal(data)
    ),

  getProfile: async (token) =>
    withLocalFallback(
      () =>
        request('/auth/profile', {
          method: 'GET',
          headers: buildHeaders(token),
        }),
      () => getProfileLocal(token)
    ),

  updateProfile: async (token, data) =>
    withLocalFallback(
      () =>
        request('/auth/profile', {
          method: 'PUT',
          headers: buildHeaders(token),
          body: JSON.stringify(data),
        }),
      () => updateProfileLocal(token, data)
    ),

  getCart: async (token) =>
    withLocalFallback(
      () =>
        request('/cart', {
          method: 'GET',
          headers: buildHeaders(token),
        }),
      () => getCartLocal(token)
    ),

  addToCart: async (token, item) =>
    withLocalFallback(
      () =>
        request('/cart/add', {
          method: 'POST',
          headers: buildHeaders(token),
          body: JSON.stringify(item),
        }),
      () => addToCartLocal(token, item)
    ),

  updateCartQuantity: async (token, item) =>
    withLocalFallback(
      () =>
        request('/cart/quantity', {
          method: 'PUT',
          headers: buildHeaders(token),
          body: JSON.stringify(item),
        }),
      () => updateCartQuantityLocal(token, item)
    ),

  removeFromCart: async (token, productName) =>
    withLocalFallback(
      () =>
        request(`/cart/${encodeURIComponent(productName)}`, {
          method: 'DELETE',
          headers: buildHeaders(token),
        }),
      () => removeFromCartLocal(token, productName)
    ),

  clearCart: async (token) =>
    withLocalFallback(
      () =>
        request('/cart/clear', {
          method: 'DELETE',
          headers: buildHeaders(token),
        }),
      () => clearCartLocal(token)
    ),
};
