import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/selectors';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  // Ищем ингредиент только если id есть
  const ingredientData = id
    ? ingredients.find((item) => item._id === id)
    : null;

  useEffect(() => {
    // Если id есть, но ингредиент не найден и данные ещё не грузились — загружаем
    if (id && !ingredientData && !loading && !error) {
      dispatch(fetchIngredients());
    }
  }, [id, ingredientData, loading, error, dispatch]);

  // Обработка ошибок и состояний
  if (error) {
    return <div>Ошибка загрузки: {error}</div>;
  }

  if (!id) {
    return <div>Ингредиент не указан</div>;
  }

  if (loading && !ingredientData) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <div>Ингредиент не найден</div>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
