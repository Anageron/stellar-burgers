import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeed,
  selectFeedError,
  selectFeedLoading
} from '../../services/selectors';
import { fetchFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feedData = useSelector(selectFeed);
  const loading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);
  const orders: TOrder[] = feedData?.orders || [];
  useEffect(() => {
    if (!feedData) {
      dispatch(fetchFeed());
    }
  }, [dispatch, feedData]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!orders.length) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
