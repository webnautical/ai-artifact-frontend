import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.webp";
import { auth, getTokenType, imgBaseURL } from "../../helper/Utility";
import { Row, Col } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useFrontDataContext } from "../../helper/context/FrontContextProvider";
const Header = () => {
  const pathname = useLocation().pathname;
  const {
    getHeaderContent,
    headerContent,
    customerInfo,
    getCustomerInfoFun,
    guestWishlist,
    guestCart,
  } = useFrontDataContext();

  const [show, setShow] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    getHeaderContent();
  }, []);

  useEffect(() => {
    const handleBodyClick = (event) => {
      if (!event.target.closest(".dropdown") && isOpen) {
      }
    };

    document.body.addEventListener("click", handleBodyClick);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, [isOpen]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchText("");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    getCustomerInfoFun();
    localStorage.removeItem(getTokenType("customer"));
    navigate("/");
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBrowseClose = () => setShowBrowse(false);
  const handleBrowseShow = () => setShowBrowse(true);
  const [searchText, setSearchText] = useState("");

  const habdleRedirect = (page) => {
    const data = { category: page };
    setShow(false);
    setShowBrowse(false);
    navigate(`/product-list`, { state: { data: data } });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const data = { category: searchText };
    setShow(false);
    setShowBrowse(false);
    navigate(`/product-list`, { state: { data: data } });
  };

  const getActive = (path) => {
    if (pathname === path) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="mbile-heaader d-lg-none d-block">
        <div className="container">
          <div className="mobile-menu-inner">
            <div className="moble-logo">
              <Link to="/" aria-label="Home">
                <img src={logo} alt=" Logo" loading="lazy" />
              </Link>
            </div>
            <div className="mboiel-right">
              <ul>
                <li className="wish_li">
                  <Link to="/wishlist" aria-label="View Wishlist">
                    <i class="fa-regular fa-heart"></i>
                    {auth("customer") ? (
                      customerInfo?.wishlistTotal > 0 && (
                        <div className="count">
                          {customerInfo?.wishlistTotal}
                        </div>
                      )
                    ) : (
                      <>
                        {guestWishlist?.length > 0 && (
                          <div className="count">{guestWishlist?.length}</div>
                        )}
                      </>
                    )}
                  </Link>
                </li>
                <li className="cart_li cart_li_phone ">
                  <Link to="/cart" aria-label="View Cart">
                    <svg
                      className=""
                      width="26"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_153_8863"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                      >
                        <rect width="24" height="24" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_153_8863)">
                        <path
                          d="M7.15382 21.5576C6.66794 21.5576 6.25481 21.3874 5.91442 21.0471C5.57404 20.7067 5.40385 20.2936 5.40385 19.8077C5.40385 19.3218 5.57404 18.9086 5.91442 18.5683C6.25481 18.2279 6.66794 18.0577 7.15382 18.0577C7.63972 18.0577 8.05287 18.2279 8.39325 18.5683C8.73363 18.9086 8.90382 19.3218 8.90382 19.8077C8.90382 20.2936 8.73363 20.7067 8.39325 21.0471C8.05287 21.3874 7.63972 21.5576 7.15382 21.5576ZM16.8461 21.5576C16.3602 21.5576 15.9471 21.3874 15.6067 21.0471C15.2663 20.7067 15.0961 20.2936 15.0961 19.8077C15.0961 19.3218 15.2663 18.9086 15.6067 18.5683C15.9471 18.2279 16.3602 18.0577 16.8461 18.0577C17.332 18.0577 17.7451 18.2279 18.0855 18.5683C18.4259 18.9086 18.5961 19.3218 18.5961 19.8077C18.5961 20.2936 18.4259 20.7067 18.0855 21.0471C17.7451 21.3874 17.332 21.5576 16.8461 21.5576ZM6.01535 5.74998L8.54997 11.0577H15.3673C15.425 11.0577 15.4763 11.0433 15.5211 11.0144C15.566 10.9856 15.6045 10.9455 15.6365 10.8942L18.3192 6.0192C18.3577 5.94868 18.3609 5.88618 18.3288 5.8317C18.2968 5.7772 18.2423 5.74995 18.1653 5.74995L6.01535 5.74998ZM5.29613 4.25003H19.1807C19.5897 4.25003 19.899 4.42406 20.1086 4.77213C20.3182 5.12021 20.3281 5.47566 20.1384 5.83847L16.9346 11.6423C16.7705 11.9307 16.5535 12.1554 16.2836 12.3163C16.0137 12.4772 15.7179 12.5576 15.3961 12.5576H8.09998L6.94227 14.673C6.89099 14.75 6.88939 14.8333 6.93747 14.9231C6.98556 15.0128 7.05767 15.0577 7.15382 15.0577H18.5961V16.5576H7.15382C6.48717 16.5576 5.98622 16.2701 5.65095 15.6952C5.3157 15.1202 5.30384 14.5461 5.61538 13.9731L7.04233 11.4077L3.40385 3.74995H1.5V2.25H4.34612L5.29613 4.25003Z"
                          fill="#1C1B1F"
                        />
                      </g>
                    </svg>
                    {auth("customer") ? (
                      customerInfo?.cartTotal > 0 && (
                        <div className="count">{customerInfo?.cartTotal}</div>
                      )
                    ) : (
                      <>
                        {guestCart?.length > 0 && (
                          <div className="count">{guestCart?.length}</div>
                        )}
                      </>
                    )}
                  </Link>
                </li>

                <li className="join_drp">
                  {auth("customer") ? (
                    <>
                      <div className="dropdown">
                        <button
                          className="dropdown-toggle border-0 p-0"
                          type="button"
                          onClick={toggleDropdown}
                          aria-expanded={isOpen}
                          aria-haspopup="true"
                        >
                          <svg
                            width="26"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <mask
                              id="mask0_152_8859"
                              style={{ maskType: "alpha" }}
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="24"
                              height="24"
                            >
                              <rect width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_152_8859)">
                              <path
                                d="M12 11.6923C11.0375 11.6923 10.2135 11.3496 9.52813 10.6642C8.84271 9.97879 8.5 9.15484 8.5 8.19236C8.5 7.22986 8.84271 6.40591 9.52813 5.72051C10.2135 5.03509 11.0375 4.69238 12 4.69238C12.9625 4.69238 13.7864 5.03509 14.4718 5.72051C15.1572 6.40591 15.5 7.22986 15.5 8.19236C15.5 9.15484 15.1572 9.97879 14.4718 10.6642C13.7864 11.3496 12.9625 11.6923 12 11.6923ZM4.5 19.3077V17.0846C4.5 16.5949 4.63302 16.1414 4.89905 15.7241C5.16507 15.3068 5.52051 14.986 5.96537 14.7616C6.95384 14.277 7.95096 13.9135 8.95672 13.6712C9.96249 13.4289 10.9769 13.3078 12 13.3078C13.023 13.3078 14.0375 13.4289 15.0432 13.6712C16.049 13.9135 17.0461 14.277 18.0346 14.7616C18.4794 14.986 18.8349 15.3068 19.1009 15.7241C19.3669 16.1414 19.5 16.5949 19.5 17.0846V19.3077H4.5ZM5.99997 17.8077H18V17.0846C18 16.8821 17.9413 16.6946 17.824 16.5221C17.7067 16.3497 17.5474 16.209 17.3461 16.1C16.4846 15.6757 15.6061 15.3542 14.7107 15.1356C13.8152 14.917 12.9117 14.8077 12 14.8077C11.0883 14.8077 10.1847 14.917 9.28927 15.1356C8.39384 15.3542 7.51536 15.6757 6.65382 16.1C6.45254 16.209 6.29325 16.3497 6.17595 16.5221C6.05863 16.6946 5.99997 16.8821 5.99997 17.0846V17.8077ZM12 10.1924C12.55 10.1924 13.0208 9.99653 13.4125 9.60486C13.8041 9.21319 14 8.74236 14 8.19236C14 7.64236 13.8041 7.17153 13.4125 6.77986C13.0208 6.38819 12.55 6.19236 12 6.19236C11.45 6.19236 10.9791 6.38819 10.5875 6.77986C10.1958 7.17153 9.99997 7.64236 9.99997 8.19236C9.99997 8.74236 10.1958 9.21319 10.5875 9.60486C10.9791 9.99653 11.45 10.1924 12 10.1924Z"
                                fill="#1C1B1F"
                              />
                            </g>
                          </svg>
                        </button>

                        {isOpen && (
                          <div className="dropdown-menu show">
                            {" "}
                            {/* Added 'show' class for Bootstrap */}
                            {/* <span className="d-block">
                              {auth("customer")?.name}
                            </span> */}
                            <Link
                              className="dropdown-item"
                              to="/customer/profile"
                              onClick={handleLinkClick}
                            >
                              <i className="fa-regular fa-user me-2"></i>My
                              Profile
                            </Link>
                            <hr className="m-0"></hr>
                            <Link
                              className="dropdown-item"
                              to="/customer/my-orders"
                              onClick={handleLinkClick}
                            >
                              <i className="fa-regular fa-rectangle-list  me-2"></i>
                              My Orders
                            </Link>
                            <hr className="m-0"></hr>
                            <Link
                              className="dropdown-item"
                              to="/"
                              onClick={() => {
                                handleLinkClick();
                                handleLogout(); // Logout function
                              }}
                            >
                              <i className="fa-solid fa-arrow-right-from-bracket me-2"></i>
                              Logout
                            </Link>
                          </div>
                        )}
                      </div>
                    </>
                  ) : auth("admin") ? (
                    <Link className="text-center" to="/admin/dashboard">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_152_8859"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_152_8859)">
                          <path
                            d="M12 11.6923C11.0375 11.6923 10.2135 11.3496 9.52813 10.6642C8.84271 9.97879 8.5 9.15484 8.5 8.19236C8.5 7.22986 8.84271 6.40591 9.52813 5.72051C10.2135 5.03509 11.0375 4.69238 12 4.69238C12.9625 4.69238 13.7864 5.03509 14.4718 5.72051C15.1572 6.40591 15.5 7.22986 15.5 8.19236C15.5 9.15484 15.1572 9.97879 14.4718 10.6642C13.7864 11.3496 12.9625 11.6923 12 11.6923ZM4.5 19.3077V17.0846C4.5 16.5949 4.63302 16.1414 4.89905 15.7241C5.16507 15.3068 5.52051 14.986 5.96537 14.7616C6.95384 14.277 7.95096 13.9135 8.95672 13.6712C9.96249 13.4289 10.9769 13.3078 12 13.3078C13.023 13.3078 14.0375 13.4289 15.0432 13.6712C16.049 13.9135 17.0461 14.277 18.0346 14.7616C18.4794 14.986 18.8349 15.3068 19.1009 15.7241C19.3669 16.1414 19.5 16.5949 19.5 17.0846V19.3077H4.5ZM5.99997 17.8077H18V17.0846C18 16.8821 17.9413 16.6946 17.824 16.5221C17.7067 16.3497 17.5474 16.209 17.3461 16.1C16.4846 15.6757 15.6061 15.3542 14.7107 15.1356C13.8152 14.917 12.9117 14.8077 12 14.8077C11.0883 14.8077 10.1847 14.917 9.28927 15.1356C8.39384 15.3542 7.51536 15.6757 6.65382 16.1C6.45254 16.209 6.29325 16.3497 6.17595 16.5221C6.05863 16.6946 5.99997 16.8821 5.99997 17.0846V17.8077ZM12 10.1924C12.55 10.1924 13.0208 9.99653 13.4125 9.60486C13.8041 9.21319 14 8.74236 14 8.19236C14 7.64236 13.8041 7.17153 13.4125 6.77986C13.0208 6.38819 12.55 6.19236 12 6.19236C11.45 6.19236 10.9791 6.38819 10.5875 6.77986C10.1958 7.17153 9.99997 7.64236 9.99997 8.19236C9.99997 8.74236 10.1958 9.21319 10.5875 9.60486C10.9791 9.99653 11.45 10.1924 12 10.1924Z"
                            fill="#1C1B1F"
                          />
                        </g>
                      </svg>
                      {/* <span className="d-block">{"Join"}</span> */}
                    </Link>
                  ) : (
                    <Link
                      className="text-center"
                      to="/login/customer"
                      aria-label="Login as Customer"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_152_8859"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_152_8859)">
                          <path
                            d="M12 11.6923C11.0375 11.6923 10.2135 11.3496 9.52813 10.6642C8.84271 9.97879 8.5 9.15484 8.5 8.19236C8.5 7.22986 8.84271 6.40591 9.52813 5.72051C10.2135 5.03509 11.0375 4.69238 12 4.69238C12.9625 4.69238 13.7864 5.03509 14.4718 5.72051C15.1572 6.40591 15.5 7.22986 15.5 8.19236C15.5 9.15484 15.1572 9.97879 14.4718 10.6642C13.7864 11.3496 12.9625 11.6923 12 11.6923ZM4.5 19.3077V17.0846C4.5 16.5949 4.63302 16.1414 4.89905 15.7241C5.16507 15.3068 5.52051 14.986 5.96537 14.7616C6.95384 14.277 7.95096 13.9135 8.95672 13.6712C9.96249 13.4289 10.9769 13.3078 12 13.3078C13.023 13.3078 14.0375 13.4289 15.0432 13.6712C16.049 13.9135 17.0461 14.277 18.0346 14.7616C18.4794 14.986 18.8349 15.3068 19.1009 15.7241C19.3669 16.1414 19.5 16.5949 19.5 17.0846V19.3077H4.5ZM5.99997 17.8077H18V17.0846C18 16.8821 17.9413 16.6946 17.824 16.5221C17.7067 16.3497 17.5474 16.209 17.3461 16.1C16.4846 15.6757 15.6061 15.3542 14.7107 15.1356C13.8152 14.917 12.9117 14.8077 12 14.8077C11.0883 14.8077 10.1847 14.917 9.28927 15.1356C8.39384 15.3542 7.51536 15.6757 6.65382 16.1C6.45254 16.209 6.29325 16.3497 6.17595 16.5221C6.05863 16.6946 5.99997 16.8821 5.99997 17.0846V17.8077ZM12 10.1924C12.55 10.1924 13.0208 9.99653 13.4125 9.60486C13.8041 9.21319 14 8.74236 14 8.19236C14 7.64236 13.8041 7.17153 13.4125 6.77986C13.0208 6.38819 12.55 6.19236 12 6.19236C11.45 6.19236 10.9791 6.38819 10.5875 6.77986C10.1958 7.17153 9.99997 7.64236 9.99997 8.19236C9.99997 8.74236 10.1958 9.21319 10.5875 9.60486C10.9791 9.99653 11.45 10.1924 12 10.1924Z"
                            fill="#1C1B1F"
                          />
                        </g>
                      </svg>
                      {/* <span className="d-block">{"Join"}</span> */}
                    </Link>
                  )}
                </li>
                <li>
                  <button
                    onClick={handleShow}
                    className="navbar-toggler"
                    aria-label="Toggle navigation"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      width="24"
                      height="24"
                      x="0"
                      y="0"
                      viewBox="0 0 512 512"
                      style={{ enableBackground: "new 0 0 512 512" }}
                      xmlSpace="preserve"
                      className=""
                    >
                      <g>
                        <path
                          d="M128 102.4c0-14.138 11.462-25.6 25.6-25.6h332.8c14.138 0 25.6 11.462 25.6 25.6S500.538 128 486.4 128H153.6c-14.138 0-25.6-11.463-25.6-25.6zm358.4 128H25.6C11.462 230.4 0 241.863 0 256c0 14.138 11.462 25.6 25.6 25.6h460.8c14.138 0 25.6-11.462 25.6-25.6 0-14.137-11.462-25.6-25.6-25.6zm0 153.6H256c-14.137 0-25.6 11.462-25.6 25.6 0 14.137 11.463 25.6 25.6 25.6h230.4c14.138 0 25.6-11.463 25.6-25.6 0-14.138-11.462-25.6-25.6-25.6z"
                          fill="#000000"
                          opacity="1"
                          data-original="#000000"
                        ></path>
                      </g>
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button onClick={handleSearch} aria-label="Search">
              <i className="fa fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>

      <section
        className={`header d-lg-block d-none ${
          scrolled ? "scrolled-class" : ""
        }`}
      >
        <div className="container">
          <div className="main_inner_header">
            <div className="left_option_bar">
              <header className=" main_menu d-md-block d-none">
                <nav>
                  <ul>
                    <li className="hover_menu">
                      <Link
                        to="/product-list"
                        className={getActive("/product-list") && "active"}
                      >
                        Browse
                      </Link>

                      <div className="hover_menu_show_box">
                        <div className="container">
                          <Row className="g-2">
                            {headerContent?.slice(0, 4)?.map((item, i) => (
                              <Col md={3}>
                                <div className="row">
                                  <div className="col-md-6 menu_header_box">
                                    <h5>{item?.name}</h5>
                                    <ul>
                                      {item?.subcategories
                                        ?.slice(0, 7)
                                        ?.map((sub, i) => (
                                          <li>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                habdleRedirect(sub)
                                              }
                                            >
                                              {sub?.name}
                                            </button>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                  <div className="col-md-6">
                                    <Row>
                                      <div
                                        className="col-md-12 mb-0"
                                        style={{ cursor: "pointer" }}
                                      >
                                        <Link
                                          to={`/product-details/${item?.randomProduct?.slug}`}
                                        >
                                          <div className="browse_with_img">
                                            <img
                                              className="w-100"
                                              src={
                                                imgBaseURL() +
                                                item?.randomProduct?.thumbnail
                                              }
                                              alt="browse_with_img"
                                              width="100%"
                                              height="100%"
                                              loading="lazy"
                                            />
                                            <Link>
                                              {item?.subcategories.find(
                                                (category) =>
                                                  category._id ===
                                                  item?.randomProduct
                                                    ?.subcategory
                                              )?.name || "Category not found"}
                                            </Link>
                                          </div>
                                        </Link>
                                      </div>
                                    </Row>
                                  </div>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      </div>
                    </li>

                    <li>
                      <Link
                        to="/collections"
                        className={getActive("/collections") && "active"}
                      >
                        Collections
                      </Link>
                    </li>
                    {/* <li>
                      <Link to="/product-list" className={getActive("/product-list") && "active"}>Artworks</Link>
                    </li> */}
                    <li>
                      <Link
                        to="/artists"
                        className={getActive("/artists") && "active"}
                      >
                        Artists
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/ranking"
                        className={getActive("/ranking") && "active"}
                      >
                        Ranking
                      </Link>
                    </li>
                  </ul>
                </nav>
              </header>
            </div>

            <div className=" top_logo_section">
              <Link to="/">
                <img
                  className=""
                  src={logo}
                  alt="logo"
                  width="300"
                  height="69px"
                  loading="lazy"
                />
              </Link>
            </div>

            <div className="right_option_bar">
              <ul>
                <li>
                  <Link>
                    <div
                      className="search-icon text-center"
                      onClick={toggleSearch}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_152_8846"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_152_8846)">
                          <path
                            d="M19.5427 20.577L13.2619 14.2962C12.7619 14.7091 12.1869 15.0321 11.5369 15.2655C10.8869 15.4988 10.2145 15.6155 9.51965 15.6155C7.81048 15.6155 6.36396 15.0237 5.1801 13.8401C3.99623 12.6566 3.4043 11.2104 3.4043 9.50169C3.4043 7.79296 3.99608 6.34628 5.17965 5.16167C6.36321 3.97707 7.80936 3.38477 9.5181 3.38477C11.2268 3.38477 12.6735 3.9767 13.8581 5.16057C15.0427 6.34443 15.635 7.79095 15.635 9.50012C15.635 10.2142 15.5151 10.8963 15.2754 11.5463C15.0356 12.1963 14.7158 12.7616 14.3158 13.2424L20.5965 19.5232L19.5427 20.577ZM9.51965 14.1155C10.8081 14.1155 11.8995 13.6684 12.7937 12.7742C13.6879 11.8799 14.135 10.7886 14.135 9.50012C14.135 8.21165 13.6879 7.1203 12.7937 6.22607C11.8995 5.33183 10.8081 4.88472 9.51965 4.88472C8.23118 4.88472 7.13983 5.33183 6.2456 6.22607C5.35138 7.1203 4.90427 8.21165 4.90427 9.50012C4.90427 10.7886 5.35138 11.8799 6.2456 12.7742C7.13983 13.6684 8.23118 14.1155 9.51965 14.1155Z"
                            fill="#1C1B1F"
                          />
                        </g>
                      </svg>
                      <span className="d-block">Search</span>
                    </div>
                    {isSearchOpen && (
                      <>
                        <div className="search-bar" ref={searchRef}>
                          <form onSubmit={handleSearch}>
                            <input
                              type="text"
                              placeholder="Search..."
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                            />
                          </form>
                          <button
                            type="button"
                            onClick={closeSearch}
                            aria-label="Search"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </>
                    )}
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-center wishlist_desktop"
                    to="/wishlist"
                    aria-label="View Wishlist"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_152_8850"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                      >
                        <rect width="24" height="24" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_152_8850)">
                        <path
                          d="M12 20.3272L10.8962 19.335C9.23847 17.8311 7.86763 16.5388 6.78365 15.458C5.69968 14.3773 4.84072 13.4154 4.20675 12.5725C3.57277 11.7295 3.12982 10.9606 2.8779 10.2657C2.62597 9.57087 2.5 8.86575 2.5 8.15037C2.5 6.73115 2.97852 5.54302 3.93558 4.58597C4.89263 3.62892 6.08076 3.15039 7.49998 3.15039C8.37306 3.15039 9.19806 3.35457 9.97498 3.76292C10.7519 4.17125 11.4269 4.75682 12 5.51964C12.5731 4.75682 13.2481 4.17125 14.025 3.76292C14.8019 3.35457 15.6269 3.15039 16.5 3.15039C17.9192 3.15039 19.1073 3.62892 20.0644 4.58597C21.0214 5.54302 21.5 6.73115 21.5 8.15037C21.5 8.86575 21.374 9.57087 21.1221 10.2657C20.8701 10.9606 20.4272 11.7295 19.7932 12.5725C19.1592 13.4154 18.3019 14.3773 17.2211 15.458C16.1403 16.5388 14.7679 17.8311 13.1038 19.335L12 20.3272ZM12 18.3004C13.6 16.8606 14.9166 15.6266 15.95 14.5984C16.9833 13.5702 17.8 12.677 18.4 11.9186C19 11.1603 19.4166 10.4869 19.65 9.89844C19.8833 9.30997 20 8.72728 20 8.15037C20 7.15037 19.6666 6.31703 19 5.65037C18.3333 4.9837 17.5 4.65037 16.5 4.65037C15.7102 4.65037 14.9804 4.87441 14.3106 5.32249C13.6407 5.77056 13.1102 6.39396 12.7192 7.19269H11.2808C10.8833 6.38756 10.3513 5.76255 9.6846 5.31767C9.01793 4.8728 8.28973 4.65037 7.49998 4.65037C6.50639 4.65037 5.67466 4.9837 5.00478 5.65037C4.33491 6.31703 3.99998 7.15037 3.99998 8.15037C3.99998 8.72728 4.11664 9.30997 4.34998 9.89844C4.58331 10.4869 4.99998 11.1603 5.59998 11.9186C6.19998 12.677 7.01664 13.5686 8.04998 14.5936C9.08331 15.6186 10.4 16.8542 12 18.3004Z"
                          fill="#1C1B1F"
                        />
                      </g>
                    </svg>
                    <span className="d-block">Wishlist</span>
                    {auth("customer") ? (
                      customerInfo?.wishlistTotal > 0 && (
                        <div className="count">
                          {customerInfo?.wishlistTotal}
                        </div>
                      )
                    ) : (
                      <>
                        {guestWishlist?.length > 0 && (
                          <div className="count">{guestWishlist?.length}</div>
                        )}
                      </>
                    )}
                  </Link>
                </li>

                <li className="cart_li">
                  <Link
                    to="/cart"
                    className="text-center"
                    aria-label="View Cart"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_153_8863"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                      >
                        <rect width="24" height="24" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_153_8863)">
                        <path
                          d="M7.15382 21.5576C6.66794 21.5576 6.25481 21.3874 5.91442 21.0471C5.57404 20.7067 5.40385 20.2936 5.40385 19.8077C5.40385 19.3218 5.57404 18.9086 5.91442 18.5683C6.25481 18.2279 6.66794 18.0577 7.15382 18.0577C7.63972 18.0577 8.05287 18.2279 8.39325 18.5683C8.73363 18.9086 8.90382 19.3218 8.90382 19.8077C8.90382 20.2936 8.73363 20.7067 8.39325 21.0471C8.05287 21.3874 7.63972 21.5576 7.15382 21.5576ZM16.8461 21.5576C16.3602 21.5576 15.9471 21.3874 15.6067 21.0471C15.2663 20.7067 15.0961 20.2936 15.0961 19.8077C15.0961 19.3218 15.2663 18.9086 15.6067 18.5683C15.9471 18.2279 16.3602 18.0577 16.8461 18.0577C17.332 18.0577 17.7451 18.2279 18.0855 18.5683C18.4259 18.9086 18.5961 19.3218 18.5961 19.8077C18.5961 20.2936 18.4259 20.7067 18.0855 21.0471C17.7451 21.3874 17.332 21.5576 16.8461 21.5576ZM6.01535 5.74998L8.54997 11.0577H15.3673C15.425 11.0577 15.4763 11.0433 15.5211 11.0144C15.566 10.9856 15.6045 10.9455 15.6365 10.8942L18.3192 6.0192C18.3577 5.94868 18.3609 5.88618 18.3288 5.8317C18.2968 5.7772 18.2423 5.74995 18.1653 5.74995L6.01535 5.74998ZM5.29613 4.25003H19.1807C19.5897 4.25003 19.899 4.42406 20.1086 4.77213C20.3182 5.12021 20.3281 5.47566 20.1384 5.83847L16.9346 11.6423C16.7705 11.9307 16.5535 12.1554 16.2836 12.3163C16.0137 12.4772 15.7179 12.5576 15.3961 12.5576H8.09998L6.94227 14.673C6.89099 14.75 6.88939 14.8333 6.93747 14.9231C6.98556 15.0128 7.05767 15.0577 7.15382 15.0577H18.5961V16.5576H7.15382C6.48717 16.5576 5.98622 16.2701 5.65095 15.6952C5.3157 15.1202 5.30384 14.5461 5.61538 13.9731L7.04233 11.4077L3.40385 3.74995H1.5V2.25H4.34612L5.29613 4.25003Z"
                          fill="#1C1B1F"
                        />
                      </g>
                    </svg>

                    <span className="d-block">Cart</span>
                    {auth("customer") ? (
                      customerInfo?.cartTotal > 0 && (
                        <div className="count">{customerInfo?.cartTotal}</div>
                      )
                    ) : (
                      <>
                        {guestCart?.length > 0 && (
                          <div className="count">{guestCart?.length}</div>
                        )}
                      </>
                    )}
                  </Link>
                </li>

                <li className="join_drp">
                  {auth("customer") ? (
                    <>
                      <div className="dropdown">
                        <button
                          className="dropdown-toggle border-0 p-0"
                          type="button"
                        >
                          <svg
                            width="26"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <mask
                              id="mask0_152_8859"
                              style={{ maskType: "alpha" }}
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="24"
                              height="24"
                            >
                              <rect width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_152_8859)">
                              <path
                                d="M12 11.6923C11.0375 11.6923 10.2135 11.3496 9.52813 10.6642C8.84271 9.97879 8.5 9.15484 8.5 8.19236C8.5 7.22986 8.84271 6.40591 9.52813 5.72051C10.2135 5.03509 11.0375 4.69238 12 4.69238C12.9625 4.69238 13.7864 5.03509 14.4718 5.72051C15.1572 6.40591 15.5 7.22986 15.5 8.19236C15.5 9.15484 15.1572 9.97879 14.4718 10.6642C13.7864 11.3496 12.9625 11.6923 12 11.6923ZM4.5 19.3077V17.0846C4.5 16.5949 4.63302 16.1414 4.89905 15.7241C5.16507 15.3068 5.52051 14.986 5.96537 14.7616C6.95384 14.277 7.95096 13.9135 8.95672 13.6712C9.96249 13.4289 10.9769 13.3078 12 13.3078C13.023 13.3078 14.0375 13.4289 15.0432 13.6712C16.049 13.9135 17.0461 14.277 18.0346 14.7616C18.4794 14.986 18.8349 15.3068 19.1009 15.7241C19.3669 16.1414 19.5 16.5949 19.5 17.0846V19.3077H4.5ZM5.99997 17.8077H18V17.0846C18 16.8821 17.9413 16.6946 17.824 16.5221C17.7067 16.3497 17.5474 16.209 17.3461 16.1C16.4846 15.6757 15.6061 15.3542 14.7107 15.1356C13.8152 14.917 12.9117 14.8077 12 14.8077C11.0883 14.8077 10.1847 14.917 9.28927 15.1356C8.39384 15.3542 7.51536 15.6757 6.65382 16.1C6.45254 16.209 6.29325 16.3497 6.17595 16.5221C6.05863 16.6946 5.99997 16.8821 5.99997 17.0846V17.8077ZM12 10.1924C12.55 10.1924 13.0208 9.99653 13.4125 9.60486C13.8041 9.21319 14 8.74236 14 8.19236C14 7.64236 13.8041 7.17153 13.4125 6.77986C13.0208 6.38819 12.55 6.19236 12 6.19236C11.45 6.19236 10.9791 6.38819 10.5875 6.77986C10.1958 7.17153 9.99997 7.64236 9.99997 8.19236C9.99997 8.74236 10.1958 9.21319 10.5875 9.60486C10.9791 9.99653 11.45 10.1924 12 10.1924Z"
                                fill="#1C1B1F"
                              />
                            </g>
                          </svg>
                        </button>
                        <div className="dropdown-menu">
                          {/* <span className="d-block">
                            {auth("customer")?.name}
                          </span> */}
                          <Link
                            className="dropdown-item"
                            to="/customer/profile"
                          >
                            <i class="fa-regular fa-user me-2"></i>My Profile
                          </Link>
                          <hr className="m-0"></hr>

                          <Link
                            className="dropdown-item"
                            to="/customer/my-orders"
                          >
                            <i class="fa-regular fa-rectangle-list  me-2"></i>My
                            Orders
                          </Link>

                          <hr className="m-0"></hr>
                          <Link
                            className="dropdown-item"
                            to="/"
                            onClick={() => handleLogout()}
                          >
                            <i class="fa-solid fa-arrow-right-from-bracket me-2"></i>
                            Logout
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : auth("admin") ? (
                    <Link
                      className="text-center"
                      to={`/${auth("admin")?.user_role}/dashboard`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_152_8859"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_152_8859)">
                          <path
                            d="M12 11.6923C11.0375 11.6923 10.2135 11.3496 9.52813 10.6642C8.84271 9.97879 8.5 9.15484 8.5 8.19236C8.5 7.22986 8.84271 6.40591 9.52813 5.72051C10.2135 5.03509 11.0375 4.69238 12 4.69238C12.9625 4.69238 13.7864 5.03509 14.4718 5.72051C15.1572 6.40591 15.5 7.22986 15.5 8.19236C15.5 9.15484 15.1572 9.97879 14.4718 10.6642C13.7864 11.3496 12.9625 11.6923 12 11.6923ZM4.5 19.3077V17.0846C4.5 16.5949 4.63302 16.1414 4.89905 15.7241C5.16507 15.3068 5.52051 14.986 5.96537 14.7616C6.95384 14.277 7.95096 13.9135 8.95672 13.6712C9.96249 13.4289 10.9769 13.3078 12 13.3078C13.023 13.3078 14.0375 13.4289 15.0432 13.6712C16.049 13.9135 17.0461 14.277 18.0346 14.7616C18.4794 14.986 18.8349 15.3068 19.1009 15.7241C19.3669 16.1414 19.5 16.5949 19.5 17.0846V19.3077H4.5ZM5.99997 17.8077H18V17.0846C18 16.8821 17.9413 16.6946 17.824 16.5221C17.7067 16.3497 17.5474 16.209 17.3461 16.1C16.4846 15.6757 15.6061 15.3542 14.7107 15.1356C13.8152 14.917 12.9117 14.8077 12 14.8077C11.0883 14.8077 10.1847 14.917 9.28927 15.1356C8.39384 15.3542 7.51536 15.6757 6.65382 16.1C6.45254 16.209 6.29325 16.3497 6.17595 16.5221C6.05863 16.6946 5.99997 16.8821 5.99997 17.0846V17.8077ZM12 10.1924C12.55 10.1924 13.0208 9.99653 13.4125 9.60486C13.8041 9.21319 14 8.74236 14 8.19236C14 7.64236 13.8041 7.17153 13.4125 6.77986C13.0208 6.38819 12.55 6.19236 12 6.19236C11.45 6.19236 10.9791 6.38819 10.5875 6.77986C10.1958 7.17153 9.99997 7.64236 9.99997 8.19236C9.99997 8.74236 10.1958 9.21319 10.5875 9.60486C10.9791 9.99653 11.45 10.1924 12 10.1924Z"
                            fill="#1C1B1F"
                          />
                        </g>
                      </svg>
                      <span className="d-block">{"Me"}</span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        className="text-center"
                        to="/login/customer"
                        aria-label="Login as Customer"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_152_8859"
                            style={{ maskType: "alpha" }}
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="24"
                            height="24"
                          >
                            <rect width="24" height="24" fill="#D9D9D9" />
                          </mask>
                          <g mask="url(#mask0_152_8859)">
                            <path
                              d="M12 11.6923C11.0375 11.6923 10.2135 11.3496 9.52813 10.6642C8.84271 9.97879 8.5 9.15484 8.5 8.19236C8.5 7.22986 8.84271 6.40591 9.52813 5.72051C10.2135 5.03509 11.0375 4.69238 12 4.69238C12.9625 4.69238 13.7864 5.03509 14.4718 5.72051C15.1572 6.40591 15.5 7.22986 15.5 8.19236C15.5 9.15484 15.1572 9.97879 14.4718 10.6642C13.7864 11.3496 12.9625 11.6923 12 11.6923ZM4.5 19.3077V17.0846C4.5 16.5949 4.63302 16.1414 4.89905 15.7241C5.16507 15.3068 5.52051 14.986 5.96537 14.7616C6.95384 14.277 7.95096 13.9135 8.95672 13.6712C9.96249 13.4289 10.9769 13.3078 12 13.3078C13.023 13.3078 14.0375 13.4289 15.0432 13.6712C16.049 13.9135 17.0461 14.277 18.0346 14.7616C18.4794 14.986 18.8349 15.3068 19.1009 15.7241C19.3669 16.1414 19.5 16.5949 19.5 17.0846V19.3077H4.5ZM5.99997 17.8077H18V17.0846C18 16.8821 17.9413 16.6946 17.824 16.5221C17.7067 16.3497 17.5474 16.209 17.3461 16.1C16.4846 15.6757 15.6061 15.3542 14.7107 15.1356C13.8152 14.917 12.9117 14.8077 12 14.8077C11.0883 14.8077 10.1847 14.917 9.28927 15.1356C8.39384 15.3542 7.51536 15.6757 6.65382 16.1C6.45254 16.209 6.29325 16.3497 6.17595 16.5221C6.05863 16.6946 5.99997 16.8821 5.99997 17.0846V17.8077ZM12 10.1924C12.55 10.1924 13.0208 9.99653 13.4125 9.60486C13.8041 9.21319 14 8.74236 14 8.19236C14 7.64236 13.8041 7.17153 13.4125 6.77986C13.0208 6.38819 12.55 6.19236 12 6.19236C11.45 6.19236 10.9791 6.38819 10.5875 6.77986C10.1958 7.17153 9.99997 7.64236 9.99997 8.19236C9.99997 8.74236 10.1958 9.21319 10.5875 9.60486C10.9791 9.99653 11.45 10.1924 12 10.1924Z"
                              fill="#1C1B1F"
                            />
                          </g>
                        </svg>
                        <span className="d-block">{"Join"}</span>
                      </Link>
                    </>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* offcanvas */}
      <div className="mobile_menu_bar">
        <Offcanvas className="mobile_menu_bar" show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <div className="logo_side_mrenu">
                <img src={logo} alt="logo" loading="lazy" />
              </div>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="mobile_side_menu">
              <ul className="p-0">
                <li>
                  <Link
                    to="/"
                    className={getActive("/") && "active"}
                    onClick={handleClose}
                  >
                    Home
                  </Link>
                </li>
                <li className="d-flex justify-content-between">
                  <Link
                    to="#"
                    onClick={(e) => {
                      handleBrowseShow();
                      handleClose();
                    }}
                  >
                    Browse
                  </Link>
                  <Link
                    to="/product-list"
                    className={getActive("/product-list") && "active"}
                    onClick={(e) => {
                      handleClose();
                    }}
                  >
                    <i class="fa-solid fa-chevron-right"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections"
                    className={getActive("/collections") && "active"}
                    onClick={handleClose}
                  >
                    Collection
                  </Link>
                </li>
                {/* <li>
                      <Link to="/product-list" className={getActive("/product-list") && "active"}>Artworks</Link>
                    </li> */}
                <li>
                  <Link
                    to="/artists"
                    className={getActive("/artists") && "active"}
                    onClick={handleClose}
                  >
                    Artists
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ranking"
                    className={getActive("/ranking") && "active"}
                    onClick={handleClose}
                  >
                    Ranking
                  </Link>
                </li>
              </ul>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>

      <Offcanvas
        className="mobile_menu_bar_cat"
        show={showBrowse}
        onHide={handleBrowseClose}
      >
        <Offcanvas.Header className="back_btn" closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          <div className="cat_gories_mobile">
            {headerContent?.slice(0, 4)?.map((item, i) => (
              <>
                <h6>
                  <Spinner animation="grow" size="sm" /> {item?.name}
                </h6>

                <ul>
                  {item?.subcategories?.slice(0, 7)?.map((sub, i) => (
                    <li>
                      <button
                        type="button"
                        onClick={() => habdleRedirect(item)}
                      >
                        {sub?.name}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* {(() => {
                  const filteredSubs = item?.subcategories?.filter((sub) => sub?.randomProduct);

                  if (filteredSubs?.length > 0) {
                    const randomSub = filteredSubs[Math.floor(Math.random() * filteredSubs.length)];
                    return ( */}
                <div
                  className="mobile_cat"
                  onClick={() => habdleRedirect(item)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="">
                    <img
                      className="w-100"
                      src={imgBaseURL() + item?.randomProduct?.thumbnail}
                      alt="Cart"
                      loading="lazy"
                    />
                    <p className="m-0">
                      {item?.subcategories.find(
                        (category) =>
                          category._id === item?.randomProduct?.subcategory
                      )?.name || "Category not found"}
                    </p>
                  </div>
                </div>
                {/* );
                  }
                  return null;
                })()} */}
              </>
            ))}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
