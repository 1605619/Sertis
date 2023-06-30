import { configureStore, createSlice } from "@reduxjs/toolkit";

// Define a login session slice
const loginSessionSlice = createSlice({
  name: "loginSession",
  initialState: {
    isLoggedIn: false,
    // accessToken: null,
    // userInfo: null,
  },
  reducers: {
    setLoginSession(state, action) {
      state.isLoggedIn = true;
      // state.accessToken = action.payload.accessToken;
      // state.userInfo = action.payload.userInfo;
    },
    clearLoginSession(state) {
      state.isLoggedIn = false;
      // state.accessToken = null;
      // state.userInfo = null;
    },
  },
});

// Create the Redux store
const store = configureStore({
  reducer: {
    loginSession: loginSessionSlice.reducer, 
  },
});

// Export the login session actions
export const { setLoginSession, clearLoginSession } = loginSessionSlice.actions;

export default store;
