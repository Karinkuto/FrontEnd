import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { logout as authLogout, authTokens, userType } from '@/lib/auth';
import type { Admin, User } from '@/types/api';

interface AuthState {
  user: User | Admin | null;
  isAuthenticated: boolean;
  userType: 'user' | 'admin' | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  userType: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Login success
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User | Admin; userType: 'user' | 'admin' }>
    ) => {
      state.user = action.payload.user;
      state.userType = action.payload.userType;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Set user type in cookies
      userType.set(action.payload.userType);
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.userType = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // Clear all auth data
      authLogout();
    },

    // Initialize auth state from cookies (for app startup)
    initializeAuth: (state) => {
      const isAuthenticated = authTokens.isAuthenticated();
      const currentUserType = userType.get();

      state.isAuthenticated = isAuthenticated;
      state.userType = currentUserType;

      // Note: We don't set user data here since we need to fetch it from API
      // This will be handled by a separate action/thunk
    },

    // Update user profile
    updateUser: (state, action: PayloadAction<User | Admin>) => {
      state.user = action.payload;
    },
  },
});

export const { setLoading, loginSuccess, logout, initializeAuth, updateUser } =
  authSlice.actions;

export default authSlice.reducer;
