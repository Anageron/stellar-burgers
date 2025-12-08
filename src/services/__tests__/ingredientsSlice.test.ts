import ingredientsReducer, {
  fetchIngredients
} from '../slices/ingredientsSlice';
import { TIngredient } from '../../utils/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: '2',
    name: 'Соус',
    type: 'sauce',
    proteins: 5,
    fat: 3,
    carbohydrates: 10,
    calories: 50,
    price: 50,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('Слайс ингридиентов', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null
  };

  test('должен быть fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен быть fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action as any);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.items).toEqual(mockIngredients);
  });

  test('должен быть fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    const action = {
      type: fetchIngredients.rejected.type,
      payload: errorMessage
    };
    const state = ingredientsReducer(initialState, action as any);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.items).toEqual([]);
  });
});
