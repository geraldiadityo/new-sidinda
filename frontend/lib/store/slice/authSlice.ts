import {
    createSlice,
    PayloadAction
} from '@reduxjs/toolkit';

interface AuthState {
    user: null | any;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setCredentials: (state, action:PayloadAction<{user: any}>) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
