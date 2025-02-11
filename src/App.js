import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Route,
  Routes,
  BrowserRouter,
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
import { auth, libraries } from "./helper/Utility";
import ArtistCollections from "./front/pages/ArtistCollections";
import TestingSpeed from "./front/pages/TestingSpeed";
// const stripePromise = loadStripe('pk_test_51PdpfWCeFWsCdKvD0zd3KZ2tQGXw0SwEOaHFWiQqhTTdjGMiPCg5sLJYVdrn8AOkAsrFHqktWs9ZyjLnrvcUy2Xl00YltTFAaq');
const stripePromise = loadStripe('pk_live_51PdpfWCeFWsCdKvDhbHIAVDeAOaTEkkpd7jippudVyVCW6Mi6gBZXTnSrXAxHMNsiMbpgtShmMn1QKQIAu00UKnQ00FawrFBs6');
function App() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
 
  return (
    <>
      <BrowserRouter>
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
              <Route path="/mounting-instructions" element={<FrontWeb cmp={StaticPages} />} />
 
 
              <Route path="/order-success/:order_id" element={<FrontWeb cmp={OrderSuccess} />} />
              <Route path="/order-failure" element={<FrontWeb cmp={OrderFailure} />} />
 
              {/* ADMIN */}
              <Route path={`/${auth('admin')?.user_role || "admin"}/*`} element={<Admin />} />
 
              {/* <Route path="/admin/*" element={<Admin />} /> */}
 
            </Routes>
          </Elements>
          <ToastContainer />
        </LoadScript>
      </BrowserRouter>
    </>
  );
}
 
export default App;