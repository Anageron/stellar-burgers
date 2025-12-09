import { rootReducer } from '../store';
import { initialState as ingredientsInitialState } from '../slices/ingredientsSlice';
import { initialState as burgerConstructorInitialState } from '../slices/constructorSlice';
import { initialState as orderInitialState } from '../slices/orderSlice';
import { initialState as feedInitialState } from '../slices/feedSlice';
import { initialState as userInitialState } from '../slices/userSlice';

describe('rootReducer initialization', () => {
  test('should return the initial state', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: burgerConstructorInitialState,
      order: orderInitialState,
      feed: feedInitialState,
      user: userInitialState
    });
  });
});
