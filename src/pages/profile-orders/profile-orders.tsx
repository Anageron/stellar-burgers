import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserOrders } from '../../services/selectors';
import { getOrders } from '../../services/slices/orderSlice';
import { Outlet } from 'react-router-dom';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrders);
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return (
    <>
      <Outlet />
      <ProfileOrdersUI orders={orders} />;
    </>
  );
};
