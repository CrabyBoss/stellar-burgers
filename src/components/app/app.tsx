import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  AuthGuard
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients/slice';
import { getUser } from '../../services/slices/user/slice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUser());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/register'
          element={
            <AuthGuard excludeAuth>
              <Register />
            </AuthGuard>
          }
        />
        <Route
          path='/login'
          element={
            <AuthGuard excludeAuth>
              <Login />
            </AuthGuard>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <AuthGuard excludeAuth>
              <ForgotPassword />
            </AuthGuard>
          }
        />
        <Route
          path='/reset-password'
          element={
            <AuthGuard excludeAuth>
              <ResetPassword />
            </AuthGuard>
          }
        />
        <Route
          path='/profile'
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <AuthGuard>
              <ProfileOrders />
            </AuthGuard>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <AuthGuard>
              <OrderInfo />
            </AuthGuard>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Информация о заказе'} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title={'Информация о заказе'} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
