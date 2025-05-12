import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  ADD_TO_SAVED,
  REMOVE_FROM_SAVED
} from './actions';

// Load initial state from localStorage if available
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('bookStoreState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const initialState = loadState() || {
  cart: [],
  wishlist: [],
  saved: []
};

const bookStoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: (item.quantity || 0) + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };

    case UPDATE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.bookId
            ? { ...item, quantity: Math.max(1, action.payload.newQuantity) }
            : item
        )
      };

    case ADD_TO_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.includes(action.payload)
          ? state.wishlist
          : [...state.wishlist, action.payload]
      };

    case REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter(id => id !== action.payload)
      };

    case ADD_TO_SAVED:
      return {
        ...state,
        saved: state.saved.includes(action.payload)
          ? state.saved
          : [...state.saved, action.payload]
      };

    case REMOVE_FROM_SAVED:
      return {
        ...state,
        saved: state.saved.filter(id => id !== action.payload)
      };

    default:
      return state;
  }
};

// Middleware to save state to localStorage
export const saveStateMiddleware = store => next => action => {
  const result = next(action);
  try {
    const serializedState = JSON.stringify(store.getState());
    localStorage.setItem('bookStoreState', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
  return result;
};

export default bookStoreReducer;