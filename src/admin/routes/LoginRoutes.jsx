import { lazy } from 'react';

import Loadable from '../components/Loadable';
import MinimalLayout from './../layout/MinimalLayout/index';
const AuthLogin = Loadable(lazy(() => import('../pages/authentication/login')));
const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: <AuthLogin />
    }
  ]
};

export default LoginRoutes;
