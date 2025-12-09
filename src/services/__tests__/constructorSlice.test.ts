import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  addBun,
  clearConstructor
} from '../slices/constructorSlice';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 43,
  calories: 420,
  price: 1255,
  image: 'image.jpg',
  image_mobile: 'image_mobile.jpg',
  image_large: 'image_large.jpg'
};

const mockIngredient1: TConstructorIngredient = {
  ...mockBun,
  type: 'main',
  _id: 'ing-1',
  id: 'temp-1'
};

const mockIngredient2: TConstructorIngredient = {
  ...mockBun,
  _id: 'ing-2',
  type: 'sauce',
  id: 'temp-2'
};

describe('Слайс конструктора', () => {
  const initialState = {
    bun: null,
    ingredients: [] as TConstructorIngredient[]
  };

  test('должен добавить булку', () => {
    const newState = constructorReducer(initialState, addBun(mockBun));
    expect(newState.bun).toEqual(mockBun);
  });

  test('должен добавить ингридиент', () => {
    const newState = constructorReducer(
      initialState,
      addIngredient(mockIngredient1)
    );
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual(mockIngredient1);
  });

  test('должен удалить ингридиент', () => {
    const stateWithIng = {
      ...initialState,
      ingredients: [mockIngredient1, mockIngredient2]
    };
    const newState = constructorReducer(
      stateWithIng,
      removeIngredient('temp-1')
    );
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0].id).toBe('temp-2');
  });

  test('должен перенести ингридент выше', () => {
    const stateWithIng = {
      ...initialState,
      ingredients: [mockIngredient1, mockIngredient2]
    };
    const newState = constructorReducer(stateWithIng, moveIngredientUp(1));
    expect(newState.ingredients[0]).toEqual(mockIngredient2);
    expect(newState.ingredients[1]).toEqual(mockIngredient1);
  });

  test('не должен перенести ингридент выше', () => {
    const stateWithIng = {
      ...initialState,
      ingredients: [mockIngredient1, mockIngredient2]
    };
    const newState = constructorReducer(stateWithIng, moveIngredientUp(0));
    expect(newState.ingredients[0]).toEqual(mockIngredient1);
    expect(newState.ingredients[1]).toEqual(mockIngredient2);
  });

  test('должен перенести ингридент ниже', () => {
    const stateWithIng = {
      ...initialState,
      ingredients: [mockIngredient1, mockIngredient2]
    };
    const newState = constructorReducer(stateWithIng, moveIngredientDown(0));
    expect(newState.ingredients[0]).toEqual(mockIngredient2);
    expect(newState.ingredients[1]).toEqual(mockIngredient1);
  });

  test('не должен перенести ингридент ниже', () => {
    const stateWithIng = {
      ...initialState,
      ingredients: [mockIngredient1, mockIngredient2]
    };
    const newState = constructorReducer(stateWithIng, moveIngredientDown(1));
    expect(newState.ingredients[0]).toEqual(mockIngredient1);
    expect(newState.ingredients[1]).toEqual(mockIngredient2);
  });

  test('должен очистить конструктор', () => {
    const fullState = {
      bun: mockBun,
      ingredients: [mockIngredient1, mockIngredient2]
    };
    const newState = constructorReducer(fullState, clearConstructor());
    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(0);
  });
});
