import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest,
  selectUser
} from '../../services/selectors';
import { useDispatch, useSelector } from '../../services/store';
import { closeOrderModal, createOrder } from '../../services/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../modal';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleModalClose = () => {
    setShowAuthModal(false);
  };

  const onOrderClick = () => {
    if (!user) {
      setShowAuthModal(true);
      setTimeout(() => {
        setShowAuthModal(false);
        navigate('/register');
      }, 2000);
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredients));
  };
  const handleCloseModal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );
  return (
    <>
      {showAuthModal && (
        <Modal title='Необходима авторизация' onClose={handleModalClose}>
          <p className='text text_type_main-medium'>
            Пожалуйста, зарегистрируйтесь для оформления заказа
          </p>
        </Modal>
      )}
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={handleCloseModal}
      />
    </>
  );
};
