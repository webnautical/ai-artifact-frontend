import { lazy } from 'react';
import  Loadable  from '../components/Loadable';
import  Dashboard  from '../layout/Dashboard';
import Faq from '../pages/faq/Faq';
import ArtWorkUpload from '../pages/artist/ArtWorkUpload';
const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard/index')));
const RolesPermission = Loadable(lazy(() => import('../pages/roles-permission/RolesPermission')));
const CategoriesList =  Loadable(lazy(() => import('../pages/categories/CategoriesList')));
const UserManagement = Loadable(lazy(() => import('../pages/user-management/UserManagement')));
const SubAdmin = Loadable(lazy(() => import('../pages/user-management/SubAdmin')));
const StaticPages = Loadable(lazy(() => import('../pages/StaticPages')));
const ContactQuery = Loadable(lazy(() => import('../pages/ContactQuery')));
const Notifications = Loadable(lazy(() => import('../pages/Notifications')));
const ComingSoon = Loadable(lazy(() => import('../pages/MyPage/ComingSoon')));
const Collection = Loadable(lazy(() => import("../pages/collection/collection")));
const Products = Loadable(lazy(() => import("../pages/product/product")));
const Reviews = Loadable(lazy(() => import("../pages/product/Review")));
const GeneralSettings = Loadable( lazy(() => import("../pages/GeneralSettings")));
const GelatoPrice = Loadable( lazy(() => import("../pages/web/GelatoPrice")));
const OrderList = Loadable( lazy(() => import("../pages/order/OrderList")));
const CouponList = Loadable( lazy(() => import("../pages/coupon/CouponList")));
const ArtList = Loadable( lazy(() => import("../pages/artist/ArtList")));
const SoldArt = Loadable( lazy(() => import("../pages/artist/SoldArt")));
const TransactionList = Loadable( lazy(() => import("../pages/order/TransactionList")));
const Commission = Loadable( lazy(() => import("../pages/Common/Commission")));
const EditProfile = Loadable( lazy(() => import("../pages/Common/EditProfile")));
const BlogList = Loadable( lazy(() => import("../pages/blogs/BlogList")));
const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard',
      element: <DashboardDefault />
    },
    {
      path: '/roles-permission',
      element: <RolesPermission />
    },
    {
      path: '/categories-list',
      element: <CategoriesList />
    },
    {
      path: '/user-management/:type',
      element: <UserManagement />
    },
    {
      path: '/orders/list',
      element: <OrderList />
    },
    {
      path: '/orders/transaction',
      element: <TransactionList />
    },
    {
      path: '/sub-admin',
      element: <SubAdmin />
    },
    {
      path: '/faq',
      element: <Faq />
    },
    {
      path: '/contact-query',
      element: <ContactQuery />
    },
    {
      path: '/notifications',
      element: <Notifications />
    },
    {
      path: '/pages/:route',
      element: <StaticPages />
    },
    {
      path: '/product-management',
      element: <ComingSoon />
    },
    {
      path: '/withdrawal',
      element: <ComingSoon />
    },
    {
      path: "/collection",
      element: <Collection />,
    },
    {
      path: "/products",
      element: <Products />,
    },
    {
      path: "/reviews",
      element: <Reviews />,
    },
    {
      path: "/blogs",
      element: <BlogList />,
    },
    {
      path: "/general-settings",
      element: <GeneralSettings />,
    },
    {
      path: "/gelato-price",
      element: <GelatoPrice />,
    },
    {
      path: "/coupon",
      element: <CouponList />,
    },
    {
      path: "/commission/:role",
      element: <Commission />,
    },
    {
      path: "/edit-profile",
      element: <EditProfile />,
    },
    // 
    // // // // // ARTIST ROUTES // // // //
    // 
    {
      path: '/art-work-upload',
      element: <ArtWorkUpload />
    },
    {
      path: '/artworks',
      element: <ArtList />
    },
    {
      path: '/sold-art',
      element: <SoldArt />
    },
  ]
};

export default MainRoutes;
