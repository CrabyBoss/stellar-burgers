import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

interface OrderResponse {
  order: TOrder;
}

export const orderBurger = createAsyncThunk<
  OrderResponse,
  string[],
  { rejectValue: string }
>('order/postOrderBurger', async (data, { rejectWithValue }) => {
  try {
    return await orderBurgerApi(data);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка при заказе бургера');
  }
});

export interface OrderState {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  isLoading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    isOrderLoadingSelector: (state) => state.isLoading,
    orderSelector: (state) => state.order
  },
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export const { isOrderLoadingSelector, orderSelector } = orderSlice.selectors;
export default orderSlice.reducer;
