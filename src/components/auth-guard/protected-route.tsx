import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  isAuthCheckedSelector,
  loginUserRequestSelector
} from '../../services/slices/user/slice';
import React from 'react';

interface AuthGuardProps {
  redirectTo?: string;
  excludeAuth?: boolean;
  children: React.ReactElement;
}

export const AuthGuard = ({
  redirectTo = '/login',
  excludeAuth = false,
  children
}: AuthGuardProps) => {
  const isAuthComplete = useSelector(isAuthCheckedSelector);
  const isLoading = useSelector(loginUserRequestSelector);
  const currentLocation = useLocation();

  // Отображение индикатора загрузки во время проверки аутентификации
  if (!isAuthComplete && isLoading) {
    return <Preloader />;
  }

  // Если требуется аутентификация и пользователь не авторизован
  if (!excludeAuth && !isAuthComplete) {
    return (
      <Navigate replace to={redirectTo} state={{ from: currentLocation }} />
    );
  }

  // Если доступ разрешён только неавторизованным пользователям и пользователь авторизован
  if (excludeAuth && isAuthComplete) {
    const destination = currentLocation.state?.from || { pathname: '/' };
    return (
      <Navigate replace to={destination} state={{ from: currentLocation }} />
    );
  }

  // Если все условия выполнены, отображаем дочерний компонент
  return children;
};
