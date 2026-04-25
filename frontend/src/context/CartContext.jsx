import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (product, color, orderType) => {
    const newItem = { 
      product_id: product._id, 
      name: product.name,
      price: product.price,
      image: color?.image || product.images?.[0],
      colorName: color?.name || 'Default',
      orderType, 
      quantity: 1, 
      cartId: Date.now() 
    };
    const newCart = [...cartItems, newItem];
    setCartItems(newCart);
    localStorage.setItem('cartItems', JSON.stringify(newCart));
  };

  const removeFromCart = (cartId) => {
    const newCart = cartItems.filter(item => item.cartId !== cartId);
    setCartItems(newCart);
    localStorage.setItem('cartItems', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
