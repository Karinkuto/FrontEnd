import type { RootState } from '../store';

export const selectCurrentUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;

export const selectUserType = (state: RootState) => state.auth.userType;
