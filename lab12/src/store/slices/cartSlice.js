import { createSlice } from '@reduxjs/toolkit';

const getUserCartKey = (email) => `cart_${email}`;

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  },
  reducers: {
    loadUserCart: (state) => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        state.items = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
        return;
      }
      
      const cartKey = getUserCartKey(userEmail);
      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          state.items = parsedCart.items || [];
          state.totalQuantity = parsedCart.totalQuantity || 0;
          state.totalAmount = parsedCart.totalAmount || 0;
        } catch (error) {
          state.items = [];
          state.totalQuantity = 0;
          state.totalAmount = 0;
        }
      } else {
        state.items = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
      }
    },
    
    saveUserCart: (state) => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;
      
      const cartKey = getUserCartKey(userEmail);
      const cartToSave = {
        items: state.items,
        totalQuantity: state.totalQuantity,
        totalAmount: state.totalAmount,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(cartKey, JSON.stringify(cartToSave));
    },
    
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.totalQuantity = action.payload.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = action.payload.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
      
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const cartKey = getUserCartKey(userEmail);
        const cartToSave = {
          items: state.items,
          totalQuantity: state.totalQuantity,
          totalAmount: state.totalAmount,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(cartKey, JSON.stringify(cartToSave));
      }
    },
    
    addToCart: (state, action) => {
      const { id, title, price, image, temperature, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product_id === id && item.temperature === temperature
      );
      
      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          product_id: id,
          title,
          price,
          image,
          temperature,
          quantity,
          stock: 50 
        });
      }
      
      state.totalQuantity += quantity;
      state.totalAmount = state.items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
      
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const cartKey = getUserCartKey(userEmail);
        const cartToSave = {
          items: state.items,
          totalQuantity: state.totalQuantity,
          totalAmount: state.totalAmount,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(cartKey, JSON.stringify(cartToSave));
      }
    },
    
    updateCartItemQuantity: (state, action) => {
      const { productId, temperature, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        item => item.product_id === productId && item.temperature === temperature
      );
      
      if (itemIndex >= 0) {
        const oldQuantity = state.items[itemIndex].quantity;
        state.items[itemIndex].quantity = quantity;
        
        state.totalQuantity += (quantity - oldQuantity);
        state.totalAmount = state.items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
        
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          const cartKey = getUserCartKey(userEmail);
          const cartToSave = {
            items: state.items,
            totalQuantity: state.totalQuantity,
            totalAmount: state.totalAmount,
            lastUpdated: new Date().toISOString()
          };
          localStorage.setItem(cartKey, JSON.stringify(cartToSave));
        }
      }
    },
    
    removeCartItem: (state, action) => {
      const { productId, temperature } = action.payload;
      const itemIndex = state.items.findIndex(
        item => item.product_id === productId && item.temperature === temperature
      );
      
      if (itemIndex >= 0) {
        state.totalQuantity -= state.items[itemIndex].quantity;
        state.items.splice(itemIndex, 1);
        state.totalAmount = state.items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
        
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          const cartKey = getUserCartKey(userEmail);
          const cartToSave = {
            items: state.items,
            totalQuantity: state.totalQuantity,
            totalAmount: state.totalAmount,
            lastUpdated: new Date().toISOString()
          };
          localStorage.setItem(cartKey, JSON.stringify(cartToSave));
        }
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const cartKey = getUserCartKey(userEmail);
        localStorage.removeItem(cartKey);
      }
    },
    
    clearCartState: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    }
  },
});

export const { 
  loadUserCart,
  saveUserCart,
  setCartItems, 
  addToCart, 
  updateCartItemQuantity, 
  removeCartItem, 
  clearCart,
  clearCartState
} = cartSlice.actions;
export default cartSlice.reducer;