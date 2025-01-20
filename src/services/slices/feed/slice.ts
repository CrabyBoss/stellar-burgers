import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi } from '@api';

interface GetFeedsResponse {
  orders: TOrder[];
  total: number;
  totalToday: number;
}

interface GetOrderByNumberResponse {
  orders: TOrder[];
}

interface FeedState {
  orders: TOrder[];
  isFeedsLoading: boolean;
  order: TOrder | null;
  isOrderLoading: boolean;
  total: number;
  totalToday: number;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  isFeedsLoading: false,
  order: null,
  isOrderLoading: false,
  total: 0,
  totalToday: 0,
  error: null
};

export const getFeeds = createAsyncThunk<
  GetFeedsResponse,
  void,
  { rejectValue: string }
>('feeds/getFeeds', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Асинхронное действие для получения заказа по номеру
export const getOrderByNumber = createAsyncThunk<
  GetOrderByNumberResponse,
  number,
  { rejectValue: string }
>('orders/getOrder', async (number: number, { rejectWithValue }) => {
  try {
    return await getOrderByNumberApi(number);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  selectors: {
    ordersSelector: (state) => state.orders,
    orderSelector: (state) => state.order,
    totalSelector: (state) => state.total,
    totalTodaySelector: (state) => state.totalToday
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isFeedsLoading = true;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isFeedsLoading = false;
        state.error = action.error.message!;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isFeedsLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message!;
        state.isOrderLoading = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload.orders[0];
        state.isOrderLoading = false;
      });
  }
});

export const {
  ordersSelector,
  orderSelector,
  totalSelector,
  totalTodaySelector
} = feedSlice.selectors;
export default feedSlice.reducer;
