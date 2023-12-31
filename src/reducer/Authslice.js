
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    storeID: localStorage.getItem('storeID') || null,
  },
  reducers: {
    setLoggedIn: (state) => {
      state.isLoggedIn = true;
    },
    setLoggedOut: (state) => {
      state.isLoggedIn = false;
    },
    setUser: (state, action) => {
      state.storeID = action.payload.storeID; 
    },
  },
});

export const { setLoggedIn, setLoggedOut,setUser } = authSlice.actions;
export default authSlice.reducer;
