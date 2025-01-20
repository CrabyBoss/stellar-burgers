import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';

import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../../utils/cookie';

export interface UserState {
  isAuthenticated: boolean;
  loginUserRequest: boolean;
  user: TUser | null;
  orders: TOrder[];
  ordersRequest: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  loginUserRequest: false,
  user: null,
  orders: [],
  ordersRequest: false,
  error: null
};

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/loginUser', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/registerUser', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    return response.user;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('user/getUserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка при получении заказов');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    isAuthCheckedSelector: (state) => state.isAuthenticated,
    loginUserRequestSelector: (state) => state.loginUserRequest,
    userNameSelector: (state) => state.user?.name || '',
    userSelector: (state) => state.user,
    userOrdersSelector: (state) => state.orders,
    errorSelector: (state) => state.error
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message!;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      })

      .addCase(logoutUser.pending, (state) => {
        state.user = null;
        state.loginUserRequest = false;
        state.isAuthenticated = false;
      })

      .addCase(getUser.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user = null;
        state.loginUserRequest = false;
        state.error = action.error.message!;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      })

      .addCase(registerUser.pending, (state) => {
        state.isAuthenticated = false;
        state.loginUserRequest = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginUserRequest = false;
        state.error = action.error.message!;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message!;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      })

      .addCase(getUserOrders.pending, (state) => {
        state.ordersRequest = true;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.error = action.error.message!;
        state.ordersRequest = false;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.ordersRequest = false;
      });
  }
});

export const { clearErrors } = userSlice.actions;
export const {
  isAuthCheckedSelector,
  userNameSelector,
  userSelector,
  loginUserRequestSelector,
  userOrdersSelector,
  errorSelector
} = userSlice.selectors;
export default userSlice.reducer;
