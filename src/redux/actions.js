// Action types
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';
export const ADD_TO_SAVED = 'ADD_TO_SAVED';
export const REMOVE_FROM_SAVED = 'REMOVE_FROM_SAVED';

// Action creators
export const addToCart = (book) => {
  return {
    type: ADD_TO_CART,
    payload: book
  };
};

export const removeFromCart = (bookId) => {
  return {
    type: REMOVE_FROM_CART,
    payload: bookId
  };
};

export const updateQuantity = (bookId, newQuantity) => {
  return {
    type: UPDATE_QUANTITY,
    payload: { bookId, newQuantity }
  };
};

export const addToWishlist = (bookId) => {
  return {
    type: ADD_TO_WISHLIST,
    payload: bookId
  };
};

export const removeFromWishlist = (bookId) => {
  return {
    type: REMOVE_FROM_WISHLIST,
    payload: bookId
  };
};

export const addToSaved = (bookId) => {
  return {
    type: ADD_TO_SAVED,
    payload: bookId
  };
};

export const removeFromSaved = (bookId) => {
  return {
    type: REMOVE_FROM_SAVED,
    payload: bookId
  };
};