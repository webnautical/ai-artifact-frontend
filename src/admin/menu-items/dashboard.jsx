import { AccountCircleOutlined, AddModeratorOutlined, Dashboard, FolderSharedOutlined, NotificationsActiveOutlined, PaidOutlined, PeopleAltOutlined } from '@mui/icons-material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BookIcon from '@mui/icons-material/Book';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SecurityIcon from '@mui/icons-material/Security';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { auth } from '../../helper/Utility';
const icons = {
  Dashboard,
  FolderSharedOutlined,
  PeopleAltOutlined,
  AddModeratorOutlined,
  PaidOutlined,
  NotificationsActiveOutlined,
  AccountCircleOutlined,
  PermMediaIcon
};
const dashboard = {
  id: 'group-dashboard',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/admin/dashboard',
      icon: icons.Dashboard,
      breadcrumbs: false
    },
    {
      id: 'UserManagement',
      title: 'User Management',
      type: 'collapse',
      icon: icons.PeopleAltOutlined,
      children: [
        {
          id: 'customer',
          title: 'Customer',
          type: 'item',
          url: `/admin/user-management/customer`,
          breadcrumbs: false
        },
        {
          id: 'artist',
          title: 'Artist',
          type: 'item',
          url: `/admin/user-management/artist`,
          breadcrumbs: false
        },
        {
          id: 'affiliate',
          title: 'Affiliate',
          type: 'item',
          url: `/admin/user-management/affiliate`,
          breadcrumbs: false
        }
      ] 
    },

    {
      id: 'Products',
      title: 'Product Management',
      type: 'collapse',
      icon: ProductionQuantityLimitsIcon,
      children: [
        {
          id: "Products",
          title: "Products",
          type: "item",
          url: `products`,
          breadcrumbs: false,
        },
        {
          id: 'Categories List',
          title: 'Categories List',
          type: 'item',
          url: `categories-list`,
          breadcrumbs: false
        },
        {
          id: "Reviews",
          title: "Reviews",
          type: "item",
          url: `reviews`,
          breadcrumbs: false,
        },
      ] 
    },

    
    {
      id: 'orders',
      title: 'Orders Management ',
      type: 'collapse',
      icon: AddShoppingCartIcon,
      children: [
        {
          id: 'all_orders',
          title: 'All Orders',
          type: 'item',
          url: `/admin/orders/list`,
          breadcrumbs: false
        },

        {
          id: 'transaction',
          title: 'Transaction History',
          type: 'item',
          url: `/admin/orders/transaction`,
          breadcrumbs: false
        },  
      ] 
    },


    {
      id: 'pages',
      title: 'Content Management',
      type: 'collapse',
      icon: AutoStoriesIcon,
      children: [

        {
          id: 'blogs',
          title: 'Blogs',
          type: 'item',
          url: '/admin/blogs',
     
          breadcrumbs: false
        }, 
        {
          id: 'contact-us',
          title: 'Contact Us',
          type: 'item',
          url: `/admin/pages/contact-us`,
          breadcrumbs: false
        },
        {
          id: 'about-us',
          title: 'About Us',
          type: 'item',
          url: `/admin/pages/about-us`,
          breadcrumbs: false
        },
        {
          id: 'shipping',
          title: 'Shipping',
          type: 'item',
          url: `/admin/pages/shipping`,
          breadcrumbs: false
        },
        {
          id: 'copyright',
          title: 'Copyright',
          type: 'item',
          url: `/admin/pages/copyright-complaints`,
          breadcrumbs: false
        },
        {
          id: 'terms-of-use',
          title: 'Terms Of Use',
          type: 'item',
          url: `/admin/pages/terms-of-use`,
          breadcrumbs: false
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          type: 'item',
          url: `/admin/pages/privacy-policy`,
          breadcrumbs: false
        },
        {
          id: 'what-is-aiartifact',
          title: 'What is AiArtifact',
          type: 'item',
          url: `/admin/pages/what-is-aiartifact`,
          breadcrumbs: false
        },
 
        {
          id: 'aiartifact-club',
          title: 'Aiartifact club',
          type: 'item',
          url: `/admin/pages/aiartifact-club`,
          breadcrumbs: false
        },
 
        {
          id: 'mounting-instructions',
          title: 'Mounting Instructions',
          type: 'item',
          url: `/admin/pages/mounting-instructions`,
          breadcrumbs: false
        },
        {
          id: 'faq',
          title: 'Faq',
          type: 'item',
          url: `/admin/faq`,
          breadcrumbs: false
        },
      ] 
    },


    {
      id: 'notifications',
      title: 'Notifications',
      type: 'item',
      url: '/admin/notifications',
      icon: NotificationsNoneIcon,
      breadcrumbs: false
    },  





    {
      id: 'setting',
      title: 'Setting ',
      type: 'collapse',
      icon: SettingsIcon,
      children: [
        {
          id: "GeneralSettings",
          title: "General Settings",
          type: "item",
          url: "/admin/general-settings",
    
          breadcrumbs: false,
        },

        {
          id: 'transaction',
          title: 'Transaction History',
          type: 'item',
          url: `/admin/orders/transaction`,
          breadcrumbs: false
        },  

        {
          id: "GelatoPrice",
          title: "Gelato Price",
          type: "item",
          url: "/admin/gelato-price",
       
          breadcrumbs: false,
        },

        {
          id: "bannerImages",
          title: "Banner & Images",
          type: "item",
          url: `/${auth('admin')?.user_role}/banner-images`,
          
          breadcrumbs: false,
        },
      ] 
    },



    


    {
      id: 'withdrawal',
      title: 'Withdrawal',
      type: 'item',
      url: '/admin/withdrawal',
      icon: MonetizationOnIcon,
      breadcrumbs: false
    },
    {
      id: 'RolesPermission',
      title: 'Roles & Permission',
      type: 'item',
      url: '/admin/roles-permission',
      icon: icons.FolderSharedOutlined,
      breadcrumbs: false
    },
   
  
    {
      id: 'SubAdmin',
      title: 'Sub Admin',
      type: 'item',
      url: '/admin/sub-admin',
      icon: SecurityIcon,
      breadcrumbs: false
    }, 
    
    {
      id: 'contactQuery',
      title: 'Contact Query',
      type: 'item',
      url: '/admin/contact-query',
      icon: SupportAgentIcon,
      breadcrumbs: false
    },  
    {
      id: 'Subscribers',
      title: 'Subscribers',
      type: 'item',
      url: '/admin/subscribers',
      icon: SubscriptionsIcon,
      breadcrumbs: false
    },  
   
  



    {
      id: "coupon",
      title: "Coupon",
      type: "item",
      url: "/admin/coupon",
      icon: LocalOfferIcon,
      breadcrumbs: false,
    },
    {
      id: "lottery",
      title: "Lottery",
      type: "item",
      url: "/admin/lottery",
      icon: MilitaryTechIcon,
      breadcrumbs: false,
    },

    {
      id: "tier",
      title: "Tiers",
      type: "item",
      url: "/admin/tier",
      icon: MilitaryTechIcon,
      breadcrumbs: false,
    },
  ]
};

export default dashboard;
