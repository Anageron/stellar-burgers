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
  const params = useParams<{ id: string }>();
  const id = params?.id || '';
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  const ingredientData = ingredients.find((item) => item._id === id) || null;
  useEffect(() => {
    if (id && ingredients.length === 0 && !loading && !error) {
      dispatch(fetchIngredients());
    }
  }, [id, ingredients.length, loading, error, dispatch]);

  if (error) {
    return (
      <div>
        <p>Ошибка загрузки: {error}</p>
      </div>
    );
  }

  if (!loading && !ingredientData) {
    return (
      <div>
        <p>Ингредиент не найден</p>
      </div>
    );
  }

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
