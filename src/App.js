import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Route,
  Routes,
  BrowserRouter,
  useNavigate,
} from "react-router-dom";
import Home from "./front/pages/Home";
import FrontLogin from "./auth/FrontLogin";
import FrontWeb from "./layout/FrontWeb";
import FrontSignup from "./auth/FrontSignup";
import ProductList from "./front/pages/ProductList";
import Collection from "./front/pages/Collection";
import AOS from "aos";
import "aos/dist/aos.css";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Favorite from "./front/pages/Favorite";
import Admin from "./Admin";
import 'swiper';
import 'swiper/css';
import ForgotPassword from "./auth/ForgotPassword";
import { LoadScript } from '@react-google-maps/api';
import "./App.css";
import '../src/assets/css/responsive.css'
import Faq from './front/pages/Faq';
import StaticPages from "./front/pages/static_pages/StaticPages";
import Cart from "./front/pages/Cart";
import ShippingAddress from "./front/pages/ShippingAddress";
import ProductDetail from "./front/pages/ProductDetails";
import Wishlist from "./front/pages/Wishlist";
import Blog from "./front/pages/Blog";
import Artists from "./front/pages/Ranking/Artists";
import RankingStatus from "./front/pages/Ranking/RankingStatus";
import BlogDetails from "./front/pages/BlogDetails";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from "./components/ScrollToTop";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from "./front/pages/orders/OrderSuccess";
import OrderFailure from "./front/pages/orders/OrderFailure";
import CustomerRoot from "./front/pages/customer/CustomerRoot";
import { auth, getTokenType, libraries } from "./helper/Utility";
import ArtistCollections from "./front/pages/ArtistCollections";
import TestingSpeed from "./front/pages/TestingSpeed";
import { AUTO_LOGOUT_TIME_AFTER_SIXTY_DAYS, AUTO_LOGOUT_TIME_IF_NO_ACTIVITY } from "./helper/Constant";
import CookieConsent from "./components/CookieConsent";
import TrackOrders from './front/pages/orders/TrackOrders';
import { APICALL } from "./helper/api/api";
// const stripePromise = loadStripe('pk_test_51PdpfWCeFWsCdKvD0zd3KZ2tQGXw0SwEOaHFWiQqhTTdjGMiPCg5sLJYVdrn8AOkAsrFHqktWs9ZyjLnrvcUy2Xl00YltTFAaq');
const stripePromise = loadStripe('pk_live_51PdpfWCeFWsCdKvDhbHIAVDeAOaTEkkpd7jippudVyVCW6Mi6gBZXTnSrXAxHMNsiMbpgtShmMn1QKQIAu00UKnQ00FawrFBs6');
function App() {

  useEffect(() => {
    AOS.init();
    AOS.refresh();
    getRoutesFunc()
  }, []);


  const navigate = useNavigate();

  const setLastActivity = () => {
    const currentTime = new Date().getTime();
    if (auth("customer") || auth("admin")) {
      localStorage.setItem("lastActivityTime", currentTime);
    }
  };

  const checkForInactivity = () => {
    const lastActivityTime = localStorage.getItem("lastActivityTime");
    const loginTimestamp = localStorage.getItem("loginTimestamp");
    const currentTime = new Date().getTime();

    // Check for inactivity
    if (lastActivityTime && currentTime - lastActivityTime > AUTO_LOGOUT_TIME_IF_NO_ACTIVITY) {
      handleLogout();
    }

    // Check if 60 days have passed since login
    if (loginTimestamp && currentTime - loginTimestamp > AUTO_LOGOUT_TIME_AFTER_SIXTY_DAYS) {
      handleLogout();
    }
  };

  const handleLogout = (type) => {
    if (auth('admin')?.user_role === 'admin') {
      navigate('/admin/login')
    } else if (auth('admin')?.user_role === 'artist') {
      navigate('/login/artist')
    } else if (auth('admin')?.user_role === 'affiliate') {
      navigate('/login/affiliate')
    } else {
      navigate('/login/customer')
    }
    localStorage.removeItem(getTokenType("customer"));
    localStorage.removeItem(getTokenType("admin"));
    localStorage.removeItem("lastActivityTime");
    localStorage.removeItem("loginTimestamp");
  }

  useEffect(() => {
    const currentTime = new Date().getTime();

    // Save the login timestamp if not already set
    if (!localStorage.getItem("loginTimestamp")) {
      localStorage.setItem("loginTimestamp", currentTime);
    }

    setLastActivity();
    const activityEvents = ["mousemove", "keydown", "click"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, setLastActivity)
    );
    const interval = setInterval(checkForInactivity, 60 * 1000);
    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, setLastActivity)
      );
      clearInterval(interval);
    };
  }, []);

  const [sidebar, setSidebar] = useState([])
  const getRoutesFunc = async () => {
    try {
      const res = await APICALL("admin/getNestedPages", "post", { type: "route" })
      if (res?.status) setSidebar(res?.data); else setSidebar([]);
    } catch (error) { console.log(error); setSidebar([]) }
  }

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyB_UmCcbfXD-tjZv_Mxk-O8z45xrAEloT0" libraries={libraries} loadingElement={<div style={{ display: "none" }} />}>
        <ScrollToTop />
        <Elements stripe={stripePromise}>
          <Routes>
            <Route path="/" element={<FrontWeb cmp={Home} header={true} footer={true} />} />
            <Route path="/testing-speed" element={<TestingSpeed />} />
            <Route path="/login/:role" element={<FrontWeb cmp={FrontLogin} header={false} footer={false} />} />
            <Route path="/forgot-password" element={<FrontWeb cmp={ForgotPassword} header={true} footer={true} />} />
            <Route path="/collection/:artist/:directory?" element={<FrontWeb cmp={Collection} header={true} footer={true} />} />
            <Route path="/signup/:role" element={<FrontWeb cmp={FrontSignup} header={true} footer={true} />} />
            <Route path="/favorite" element={<FrontWeb cmp={Favorite} header={true} footer={true} />} />
            <Route path="/product-list" element={<FrontWeb cmp={ProductList} header={true} footer={true} />} />
            <Route path="/customer/:page" element={<FrontWeb cmp={CustomerRoot} header={true} footer={true} />} />
            <Route path="/faq" element={<FrontWeb cmp={Faq} />} />
            <Route path="/collections" element={<FrontWeb cmp={ArtistCollections} />} />
            <Route path="/cart" element={<FrontWeb cmp={Cart} />} />
            <Route path="/artists" element={<FrontWeb cmp={Artists} />} />
            <Route path="/ranking" element={<FrontWeb cmp={RankingStatus} />} />
            <Route path="/product-details/:id" element={<FrontWeb cmp={ProductDetail} />} />
            <Route path="/wishlist" element={<FrontWeb cmp={Wishlist} />} />
            <Route path="/blog" element={<FrontWeb cmp={Blog} />} />
            <Route path="/blog-details" element={<FrontWeb cmp={BlogDetails} />} />
            <Route path="/shipping-details" element={<FrontWeb cmp={ShippingAddress} />} />

            <Route path="/contact-us" element={<FrontWeb cmp={StaticPages} />} />
            <Route path="/shipping" element={<FrontWeb cmp={StaticPages} />} />
            <Route path="/terms-of-use" element={<FrontWeb cmp={StaticPages} />} />
            <Route path="/privacy-policy" element={<FrontWeb cmp={StaticPages} />} />
            <Route path="/content-guidelines" element={<FrontWeb cmp={StaticPages} />} />
            <Route path="/copyright-complaints" element={<FrontWeb cmp={StaticPages} />} />
            <Route path="/about-us" element={<FrontWeb cmp={StaticPages} />} />
            <Route path="/what-is-aiartifact" element={<FrontWeb cmp={StaticPages} />} />
            <Route path="/aiartifact-club" element={<FrontWeb cmp={StaticPages} />} />


            {sidebar?.length > 0 && sidebar?.map((item, i) => (
              <Route path={item} element={<FrontWeb cmp={StaticPages} />} />
            ))}

            <Route path="/order-success/:order_id" element={<FrontWeb cmp={OrderSuccess} />} />
            <Route path="/order-failure" element={<FrontWeb cmp={OrderFailure} />} />
            <Route path="/tracking" element={<FrontWeb cmp={TrackOrders} />} />

            {/* ADMIN */}
            <Route path={`/${auth('admin')?.user_role || "admin"}/*`} element={<Admin />} />

          </Routes>
        </Elements>
        <CookieConsent />
        <ToastContainer />
      </LoadScript>
    </>
  );
}

export default App;