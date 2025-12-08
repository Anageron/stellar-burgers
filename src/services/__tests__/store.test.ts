import { rootReducer } from '../store'; 

describe('rootReducer initialization', () => {
  test('should return the initial state', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toEqual({
      ingredients: {
        items: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        orderError: null,
        orders: [],
        orderDetails: null
      },
      feed: {
        ordersData: null,
        loading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        error: null
      }
    });
  });
});
