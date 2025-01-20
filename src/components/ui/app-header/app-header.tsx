import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const currentLocation = location.pathname;

  const getIconType = (path: string) =>
    currentLocation === path ? 'primary' : 'secondary';

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Конструктор */}
          <NavLink
            to='/'
            className={({ isActive }) =>
              classNames(
                styles.link,
                { [styles.link_active]: isActive },
                'mr-10'
              )
            }
            aria-label='Конструктор'
          >
            <BurgerIcon type={getIconType('/')} />
            <p className='text text_type_main-default ml-2'>Конструктор</p>
          </NavLink>

          <NavLink
            to='/feed'
            className={({ isActive }) =>
              classNames(styles.link, { [styles.link_active]: isActive })
            }
            aria-label='Лента заказов'
          >
            <ListIcon type={getIconType('/feed')} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to='/' aria-label='Главная'>
            <Logo className='' />
          </NavLink>
        </div>

        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              classNames(styles.link, { [styles.link_active]: isActive })
            }
            aria-label='Личный кабинет'
          >
            <ProfileIcon type={getIconType('/profile')} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
