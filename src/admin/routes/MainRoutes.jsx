import { lazy } from 'react';
import  Loadable  from '../components/Loadable';
import  Dashboard  from '../layout/Dashboard';
import Faq from '../pages/faq/Faq';
import ArtWorkUpload from '../pages/artist/ArtWorkUpload';
import ViewUserDetails from '../pages/user-management/ViewUserDetails';
import ProductDetails from '../pages/product/ProductDetails';
import ChangePassword from '../pages/Common/ChangePassword';
const Tier = Loadable( lazy(() => import("../pages/web/Tier")));
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
const SubscribersList = Loadable( lazy(() => import("../pages/web/SubscribersList")));
const BannerAndImages = Loadable( lazy(() => import("../pages/web/BannerAndImages")));
const OrderList = Loadable( lazy(() => import("../pages/order/OrderList")));
const CouponList = Loadable( lazy(() => import("../pages/coupon/CouponList")));
const ArtList = Loadable( lazy(() => import("../pages/artist/ArtList")));
const SoldArt = Loadable( lazy(() => import("../pages/artist/SoldArt")));
const TransactionList = Loadable( lazy(() => import("../pages/order/TransactionList")));
const Commission = Loadable( lazy(() => import("../pages/Common/Commission")));
const EditProfile = Loadable( lazy(() => import("../pages/Common/EditProfile")));
const Withdrawal = Loadable( lazy(() => import("../pages/withdrawal/Withdrawal")));
const BlogList = Loadable( lazy(() => import("../pages/blogs/BlogList")));
const Lottery = Loadable( lazy(() => import("../pages/lottery/Lottery")));
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
      path: '/user-management-details/:id',
      element: <ViewUserDetails />
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
    // {
    //   path: '/product-management',
    //   element: <ComingSoon />
    // },
    {
      path: '/withdrawal',
      element: <Withdrawal/>
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
      path: "/product-details/:id",
      element: <ProductDetails />,
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
      path: "/banner-images",
      element: <BannerAndImages />,
    },
    {
      path: "/coupon",
      element: <CouponList />,
    },
    {
      path: "/lottery",
      element: <Lottery />,
    },
    {
      path: "/subscribers",
      element: <SubscribersList />,
    },
    {
      path: "/commission/:role",
      element: <Commission />,
    },
    {
      path: "/edit-profile",
      element: <EditProfile />,
    },
    {
      path: "/change-password",
      element: <ChangePassword />,
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

    {
      path: "/tier",
      element: <Tier />,
    },

    
  ]
};
 
export default MainRoutes;