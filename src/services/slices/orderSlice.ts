import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { TOrder, TOrdersData } from '../../utils/types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
  orders: TOrder[];
  orderDetails: TOrder | null;
};

export const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderError: null,
  orders: [],
  orderDetails: null
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'order/createOrder',
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      if (response?.success) {
        return response.order;
      }
      return rejectWithValue('Не удалось создать заказ');
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Ошибка при создании заказа'
      );
    }
  }
);

export const getOrders = createAsyncThunk<TOrder[]>(
  'order/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Ошибка при получении заказов'
      );
    }
  }
);

export const getOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/getOrderByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      const order = response.orders[0];
      return order;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Ошибка при получении заказа'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.orderError = null;
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload as string;
      })
      .addCase(getOrders.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload as string;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload as string;
      });
  }
});
export const { closeOrderModal, clearOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
