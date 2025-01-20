import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  burgerConstructorSelector,
  clearBurgerConstructor
} from '../../services/slices/burger-constructor/slice';
import {
  clearOrder,
  isOrderLoadingSelector,
  orderSelector,
  orderBurger
} from '../../services/slices/order/slice';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthCheckedSelector } from '../../services/slices/user/slice';

interface LocationState {
  from?: Location;
  orderData?: string[];
}

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(burgerConstructorSelector);
  const orderRequest = useSelector(isOrderLoadingSelector);
  const orderModalData = useSelector(orderSelector);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(isAuthCheckedSelector);

  const onOrderClick = () => {
    const { bun, ingredients } = constructorItems;
    if (!bun || orderRequest) return;

    const orderData: string[] = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id
    ];

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location, orderData } });
      return;
    }
    dispatch(orderBurger(orderData));
  };

  const closeOrderModal = () => {
    navigate('/', { replace: true });
    dispatch(clearOrder());
    dispatch(clearBurgerConstructor());
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
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};