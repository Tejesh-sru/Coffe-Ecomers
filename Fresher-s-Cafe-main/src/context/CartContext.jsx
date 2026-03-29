import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    const initializeSession = async () => {
      if (!token) {
        setCart([]);
        return;
      }

      try {
        const [profile, cartItems] = await Promise.all([
          api.getProfile(token),
          api.getCart(token),
        ]);
        setUser(profile);
        setCart(cartItems);
      } catch {
        setToken(null);
        setUser(null);
        setCart([]);
      }
    };

    initializeSession();
  }, [token]);

  const applyAuthState = async (authResponse) => {
    setToken(authResponse.token);
    setUser({ username: authResponse.username, email: authResponse.email });
    const cartItems = await api.getCart(authResponse.token);
    setCart(cartItems);
  };

  const register = async (payload) => {
    const response = await api.register(payload);
    await applyAuthState(response);
    return response;
  };

  const login = async (payload) => {
    const response = await api.login(payload);
    await applyAuthState(response);
    return response;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCart([]);
  };

  const refreshProfile = async () => {
    if (!token) {
      throw new Error('Please login first');
    }
    const profile = await api.getProfile(token);
    setUser(profile);
    return profile;
  };

  const updateProfile = async (username) => {
    if (!token) {
      throw new Error('Please login first');
    }
    const profile = await api.updateProfile(token, { username });
    setUser(profile);
    return profile;
  };

  const addToCart = async (product) => {
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    const updatedCart = await api.addToCart(token, {
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    setCart(updatedCart);
  };

  const removeFromCart = async (productName) => {
    if (!token) {
      throw new Error('Please login to manage cart');
    }

    const updatedCart = await api.removeFromCart(token, productName);
    setCart(updatedCart);
  };

  const updateQuantity = async (productName, quantity) => {
    if (!token) {
      throw new Error('Please login to manage cart');
    }

    const updatedCart = await api.updateCartQuantity(token, {
      name: productName,
      quantity,
    });
    setCart(updatedCart);
  };

  const clearCart = async () => {
    if (!token) {
      throw new Error('Please login to manage cart');
    }

    const updatedCart = await api.clearCart(token);
    setCart(updatedCart);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        user,
        token,
        isAuthenticated: Boolean(token),
        register,
        login,
        logout,
        refreshProfile,
        updateProfile,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
