import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TAuthResponse, TUser } from '../../utils/types';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: { name: string; password: string; email: string }) => {
    const response: TAuthResponse = await registerUserApi(userData);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (userData: { password: string; email: string }) => {
    const response: TAuthResponse = await loginUserApi(userData);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    userData: Partial<{ email: string; password: string; name: string }>
  ) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
  return null;
});

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (userData: { email: string }) => {
    const response = await forgotPasswordApi(userData);
    return response;
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (userData: { password: string; token: string }) => {
    const response = await resetPasswordApi(userData);
    return response;
  }
);

interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null;
}

export const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка регистрации';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка входа';
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error =
          action.error.message || 'Не удалось получить данные пользователя';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || 'Не удалось обновить данные';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка выхода';
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка смены пароля';
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка смены пароля';
      });
  }
});

export const { authChecked, clearError } = userSlice.actions;
export default userSlice.reducer;
