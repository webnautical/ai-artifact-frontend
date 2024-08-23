import React from 'react'
import { useRoutes } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
const ThemeRoutes = () => {
    let routes;
    routes = [MainRoutes, LoginRoutes];

  return (
    <>
    {useRoutes(routes)}
    </>
  )
}

export default ThemeRoutes