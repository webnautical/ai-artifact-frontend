import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useFrontDataContext } from "../../../helper/context/FrontContextProvider";
import { getTokenType } from "../../../helper/Utility";
import Profile from "./Profile";
import Orders from "./Orders";
import OrderDetails from "./OrderDetails";
import MyAddress from "./MyAddress";

const CustomerRoot = () => {
  const { getCustomerInfoFun } = useFrontDataContext();
  const navigate = useNavigate()
  const location = useLocation();
  const pageURI = location.pathname.split('/customer/')[1];
  const handleLogout = () => {
    getCustomerInfoFun()
    localStorage.removeItem(getTokenType("customer"))
    navigate('/')
  }
  return (
    <section className="profile-add">
      <Container>
        <Row className="justify-content-between">
          <Col md={2} className="mb-4">
            <div className="sidebr-frontAc">
              <div className="inner-menus">
                <ul>
                  <li>
                    <Link className={`${pageURI === 'profile' && 'active'}`} to="/customer/profile"> My Profile </Link>
                  </li>
                  <li>
                    <Link to="/customer/my-address" className={`${pageURI === 'my-address' && 'active'}`}>My Address</Link>
                  </li>
                  <li>
                    <Link to="/customer/my-orders" className={`${pageURI === 'my-orders' && 'active'}`}>My Orders</Link>
                  </li>
                  <li>
                    <Link to="/" onClick={() => handleLogout()}>Logout</Link>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
          <Col md={10}>
            {
              pageURI === 'profile' ?
                <Profile />
                :
                pageURI === 'my-address' ?
                  <MyAddress />
                  :
                  pageURI === 'my-orders' ?
                    <Orders />
                    :
                    pageURI === 'order-details' ?
                      <OrderDetails />
                      :
                      <>
                        Work in progress
                      </>
            }

          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CustomerRoot;
