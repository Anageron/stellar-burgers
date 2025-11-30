import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const selectIngredients = (state: RootState) => state.ingredients.items;

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectConstructorItems = createSelector(
  [(state: RootState) => state.burgerConstructor],
  (constructorState) => ({
    bun: constructorState?.bun || null,
    ingredients: constructorState?.ingredients || []
  })
);

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;

export const selectOrderError = (state: RootState) => state.order.orderError;

export const selectUserOrders = (state: RootState) => state.order.orders;

export const selectOrderDetails = (state: RootState) =>
  state.order.orderDetails;

export const selectFeed = (state: RootState) => state.feed.ordersData;

export const selectFeedLoading = (state: RootState) => state.feed.loading;

export const selectFeedError = (state: RootState) => state.feed.error;

export const selectUser = (state: RootState) => state.user.user;

export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;

export const selectAuthError = (state: RootState) => state.user.error;
