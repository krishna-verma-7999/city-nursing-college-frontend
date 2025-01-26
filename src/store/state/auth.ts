import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateTypes {
  isAuthenticated: boolean;
  token: string;
}

const initialState: initialStateTypes = {
  isAuthenticated: false,
  token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = "";
      // Remove token from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
      }
    },
    loginSuccess(state, action: PayloadAction<initialStateTypes>) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", action.payload.token);
      }
    },
  },
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
