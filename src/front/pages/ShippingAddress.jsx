import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Box from "@mui/material/Box";
import Spinner from "react-bootstrap/Spinner";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Form from "react-bootstrap/Form";
import { useFrontDataContext } from "../../helper/context/FrontContextProvider";
import paypalimg from "../../assets/images/Paypal.png";
import stripeimg from "../../assets/images/stripe.png";
import { useLocation, useNavigate } from "react-router";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { APICALL, axiosInstance } from "../../helper/api/api";
import { Country, State, City } from "country-state-city";
import {
  auth,
  encryptLocalStorageData,
  imgBaseURL,
  toastifyError,
  toastifySuccess,
} from "../../helper/Utility";
import ReactCountryFlag from "react-country-flag";
import { Autocomplete, Select, TextField } from "@mui/material";
import PlacesAutocomplete from "react-places-autocomplete";
const steps = ["Shipping details", "Payments"];
const ShippingAddress = () => {
  const {
    getCustomerInfoFun,
    customerInfo,
    cartList,
    getCartListFun,
    guestCart,
    getGestCartListFun,
  } = useFrontDataContext();

  useEffect(() => {
    if (auth("customer")) {
      getCartListFun();
    } else {
      if (guestCart?.length > 0) {
        getGestCartListFun(guestCart);
      }
    }
  }, [guestCart]);

  const itemTotal = cartList.reduce((acc, item) => {
    return acc + (item?.row_uid?.price * item?.quantity || 0);
  }, 0);
  const paramstotalPrice = parseInt(itemTotal);
  const navigate = useNavigate();
  const orderDetails = {
    cartItem: cartList,
    subTotal: itemTotal,
    totalPrice: paramstotalPrice,
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const stripe = useStripe();
  const elements = useElements();
  const [openPaymentForm, setOpenPaymentForm] = useState();
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const [stateList, setStateList] = useState([]);
  const [stateList1, setStateList1] = useState([]);
  const [shippingChargeRes, setShippingChargeRes] = useState(null);
  const [couponRes, setCouponRes] = useState(null);
  const [code, setCode] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
    contactPhone: "",
    email: "",
    useDifferentBillingAddress: false,

    billingFirstName: "",
    billingLastName: "",
    billingAddressLine1: "",
    billingAddressLine2: "",
    billingPostalCode: "",
    billingCity: "",
    billingState: "",
    billingCountry: "",
    billingContactPhone: "",
  });
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    // addressLine2: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
    contactPhone: "",
  });
  const [addUpdateApiCallCount, setAddUpdateApiCallCount] = useState(0);
  const handleNext = () => {
    setAddUpdateApiCallCount(addUpdateApiCallCount + 1);
    const {
      email,
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      postalCode,
      country,
      city,
      state,
      contactPhone,
      useDifferentBillingAddress,
      billingFirstName,
      billingLastName,
      billingAddressLine1,
      // billingAddressLine2,
      billingPostalCode,
      billingCity,
      billingState,
      billingCountry,
      billingContactPhone,
    } = formData;

    const errors = {};

    if (email.trim() === "") {
      errors.email = "Required *";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Invalid email format";
      }
    }

    if (firstName.trim() === "") errors.firstName = "Required *";
    if (lastName.trim() === "") errors.lastName = "Required *";
    if (addressLine1.trim() === "") errors.addressLine1 = "Required *";
    // if (addressLine2.trim() === "") errors.addressLine2 = "Required *";
    if (postalCode.trim() === "") {
      errors.postalCode = "Required *";
    } else if (!/^\d+$/.test(postalCode)) {
      errors.postalCode = "Invalid Postal code";
    }
    if (country.trim() === "") errors.country = "Required *";
    if (state.trim() === "") errors.state = "Required *";
    if (city.trim() === "") errors.city = "Required *";

    const phonePattern = /^\+?[1-9]\d{1,14}$/;
    if (contactPhone === "") {
      errors.contactPhone = "Required *";
    } else if (!phonePattern.test(contactPhone)) {
      errors.contactPhone = "Invalid phone number for DHL/UPS";
    }

    if (useDifferentBillingAddress) {
      if (billingFirstName.trim() === "")
        errors.billingFirstName = "Required *";
      if (billingLastName.trim() === "") errors.billingLastName = "Required *";
      if (billingAddressLine1.trim() === "")
        errors.billingAddressLine1 = "Required *";
      // if (billingAddressLine2.trim() === "") errors.billingAddressLine2 = "Required *";
      if (billingPostalCode.trim() === "") {
        errors.billingPostalCode = "Required *";
      } else if (!/^\d+$/.test(billingPostalCode)) {
        errors.billingPostalCode = "Invalid Postal code";
      }
      if (billingCountry.trim() === "") errors.billingCountry = "Required *";
      if (billingState.trim() === "") errors.billingState = "Required *";
      if (billingCity.trim() === "") errors.billingCity = "Required *";

      if (billingContactPhone === "") {
        errors.billingContactPhone = "Required *";
      } else if (!phonePattern.test(billingContactPhone)) {
        errors.billingContactPhone = "Invalid phone number for DHL/UPS";
      }
    }

    setError(errors);

    if (Object.keys(errors).length === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      getShippingRateFun();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    if (customerInfo) {
      setFormData({
        ...formData,
        firstName: customerInfo?.user?.first_name,
        lastName: customerInfo?.user?.last_name,
        addressLine1: customerInfo?.user?.address1,
        addressLine2: customerInfo?.user?.address2,
        postalCode: customerInfo?.user?.postalCode,
        city: customerInfo?.user?.city,
        state: customerInfo?.user?.state,
        country: customerInfo?.user?.country,
        contactPhone: customerInfo?.user?.phone,
        email: customerInfo?.user?.email,
        useDifferentBillingAddress: false,
      });
      getStateFun(customerInfo?.user?.country);
    }
  }, [customerInfo]);

  const handleChange = (e) => {
    if (e.target.name === "country") {
      setFormData({ ...formData, country: e.target.value });
      getStateFun(e.target.value);
    } else if (e.target.name === "billingCountry") {
      setFormData({ ...formData, billingCountry: e.target.value });
      getStateFun1(e.target.value);
    } else if (e.target.name === "state") {
      setFormData({ ...formData, state: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const getStateFun = (country) => {
    const stateData = State?.getStatesOfCountry(country).map((state) => ({
      value: state.isoCode,
      displayValue: state.name,
    }));
    setStateList(stateData);
  };

  const getStateFun1 = (country) => {
    const stateData = State?.getStatesOfCountry(country).map((state) => ({
      value: state.isoCode,
      displayValue: state.name,
    }));
    setStateList1(stateData);
  };

  const [billingAddressSame, setBillingAddressSame] = useState(true);
  const handleRadioChange = (e) => {
    setBillingAddressSame(e.target.value === "same");
    setFormData({
      ...formData,
      useDifferentBillingAddress: e.target.value !== "same",
    });
  };

  const [selectedMethod, setSelectedMethod] = useState("");

  const handleChange1 = (event) => {
    setSelectedMethod(event.target.value);
    if (event.target.value === "Stripe") {
      setOpenPaymentForm(event.target.value);
      getClientSecretFun(orderDetails?.totalPrice);
    } else {
      setOpenPaymentForm();
    }
  };

  useEffect(() => {
    if (shippingChargeRes) {
      getClientSecretFun(orderDetails?.totalPrice);
    }
  }, [shippingChargeRes]);

  const [stripErr, setStripErr] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const getClientSecretFun = async (amount) => {
    try {
      const params = { amount: amount };
      const res = await APICALL("user/createPaymentInstant", "post", params);
      if (res?.status == 200) {
        setClientSecret(res?.data?.paymentIntent);
      }
    } catch (error) {
      return error;
    }
  };

  // console.log("orderDetails?.cartItem",orderDetails)

  const totalPrice =
    orderDetails?.totalPrice +
    (shippingChargeRes?.price || 0) -
    (couponRes?.discount || 0);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const productArr = orderDetails?.cartItem?.map((item) => ({
      productId: item?.product_id?._id,
      quantity: item?.quantity,
      price: item?.row_uid?.price,
      affiliateId: item?.affiliateId,
      artistId: item?.product_id?.artist_id,
      productUID: item?.row_uid?.test_id || item?.row_uid?.productUid,
      image: item?.product_id?.image,
      quality: item?.quality || "",
      frame: item?.frame || "",
      size: item?.size || "",
      assembly: item?.assembly || "",
      frameType: item?.frameType || "",
    }));

    setProcessing(true);

    try {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      const createOrderParams = {
        couponCode: couponRes?.coupon,
        couponAmount: couponRes?.discount,
        shipmentMethodUid: shippingChargeRes?.shipmentMethodUid,
        shippingCharge: shippingChargeRes?.price,
        totalPrice: totalPrice,
        useDifferentBillingAddress: formData?.useDifferentBillingAddress,
        shippingAddress: {
          firstName: formData?.firstName,
          lastName: formData?.lastName,
          addressLine1: formData?.addressLine1,
          addressLine2: formData?.addressLine2,
          postalCode: formData?.postalCode,
          city: formData?.city,
          state: formData?.state,
          country: formData?.country,
          contactPhone: formData?.contactPhone,
          email: formData?.email,
        },
        billingAddress: {
          firstName: formData?.billingFirstName,
          lastName: formData?.billingLastName,
          addressLine1: formData?.billingAddressLine1,
          addressLine2: formData?.billingAddressLine2,
          postalCode: formData?.billingPostalCode,
          city: formData?.billingCity,
          state: formData?.billingState,
          country: formData?.billingCountry,
          contactPhone: formData?.billingContactPhone,
          email: formData?.email,
        },
        orderItems: productArr,
        payment_success: "success",
        paymentGateway: "Stripe",
        paymentResponse: payload?.paymentIntent,
        status: "Success",
        transactionId: payload?.paymentIntent?.id,
      };
      if (payload?.paymentIntent?.status == "succeeded") {
        setStripErr(null);
        createOrder(createOrderParams);
      } else {
        setStripErr(`Payment failed - Somthing wrong !!`);
        setProcessing(false);
      }
      if (payload.error) {
        setStripErr(`Payment failed ${payload.error.message}`);
        setProcessing(false);
      }
    } catch (error) {
      setProcessing(false);
    }
  };

  const createOrder = async (params) => {
    try {
      const res = await APICALL("user/createOrder", "post", params);
      console.log("gestResponse", res);
      if (res?.status) {
        if (res?.token) {
          const dataParam = {
            token: res?.token,
            name: res?.data?.shippingAddress?.first_name,
            email: res?.data?.shippingAddress?.email,
            id: res?.data?.userId,
            user_role: "customer",
          };
          encryptLocalStorageData(
            "customer-secret",
            dataParam,
            "DoNotTryToAccess"
          );
          localStorage.removeItem("guestCart");
        }
        getCustomerInfoFun();
        navigate(`/order-success/${res?.data?._id}`);
      } else {
        navigate("/order-failure");
      }
    } catch (error) {
      navigate("/order-failure");
    } finally {
      setProcessing(false);
    }
  };

  const shippingRateProduct = orderDetails?.cartItem?.map((item, i) => ({
    itemReferenceId: `REF${i + 1}`,
    productUid: item?.row_uid?.test_id || item?.row_uid?.productUid,
    files: [
      {
        type: "default",
        url: imgBaseURL() + item?.product_id?.image,
      },
    ],
    quantity: item?.quantity,
  }));

  const shippingRateParams = {
    orderReferenceId: "ORDER123",
    customerReferenceId: "Customer123",
    currency: "USD",
    allowMultipleQuotes: true,
    recipient: {
      country: formData?.country,
      companyName: "Sample Company",
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      addressLine1: formData?.addressLine1,
      addressLine2: formData?.addressLine2,
      state: formData?.state,
      city: formData?.city,
      postCode: formData?.postalCode,
      email: formData?.email,
      phone: formData?.contactPhone,
    },
    products: shippingRateProduct,
  };

  const getShippingRateFun = async () => {
    try {
      const res = await APICALL(
        "user/getShippingRate",
        "post",
        shippingRateParams
      );
      if (res?.status) {
        setShippingChargeRes(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const applyCoupon = async () => {
    try {
      const params = { code: code, orderTotal: orderDetails?.subTotal };
      const res = await APICALL("admin/applyCoupon", "post", params);
      if (res?.status) {
        if (res?.freeShipping) {
          const re = {
            coupon: res?.coupon,
            discount: shippingChargeRes?.price,
            message: res?.message,
            status: res?.status,
          };
          setCouponRes(re);
        } else {
          const re = {
            coupon: res?.coupon,
            discount: res?.discountAmount,
            message: res?.message,
            status: res?.status,
          };
          setCouponRes(re);
        }
      } else {
        const re = { message: res?.message, status: res?.status };
        setCouponRes(re);
      }
    } catch (error) {
      console.log("error", error);
      const re = { message: "Invalid Coupon", status: false };
      setCouponRes(re);
    }
  };

  const countryOptions = Country?.getAllCountries()?.map((country) => ({
    value: country.isoCode,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ReactCountryFlag
          countryCode={country.isoCode}
          svg
          style={{ width: "1.5em", height: "1.5em", marginRight: "0.5em" }}
        />
        {country.name}
      </div>
    ),
  }));

  const countryOptions1 = Country?.getAllCountries()?.map((country) => ({
    value: country.isoCode,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ReactCountryFlag
          countryCode={country.isoCode}
          svg
          style={{ width: "1.5em", height: "1.5em", marginRight: "0.5em" }}
        />
        {country.name}
      </div>
    ),
  }));

  const handleCountryChange = (event, selectedOption) => {
    handleChange({
      target: {
        name: "country",
        value: selectedOption ? selectedOption.value : "",
      },
    });
  };

  const handleCountryChange1 = (event, selectedOption) => {
    handleChange({
      target: {
        name: "billingCountry",
        value: selectedOption ? selectedOption.value : "",
      },
    });
  };

  const checkGuestEmailExists = async () => {
    try {
      const res = await APICALL("user/checkEmailExists", "post", {
        email: formData?.email,
      });
      if (res?.isExist) {
        setError({ ...error, email: res?.message });
      } else {
        setError({ ...error, email: "" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLocationSelect = async (value) => {
    try {
      setFormData((prevValue) => ({
        ...prevValue,
        addressLine1: value,
      }));
    } catch (error) {
      console.error("Error selecting address", error);
    }
  };

  const handleLocationChange = (value) => {
    setFormData((prevValue) => ({
      ...prevValue,
      addressLine1: value,
    }));
  };

  const handleLocationSelect2 = async (value) => {
    try {
      setFormData((prevValue) => ({
        ...prevValue,
        addressLine2: value,
      }));
    } catch (error) {
      console.error("Error selecting address", error);
    }
  };

  const handleLocationChange2 = (value) => {
    setFormData((prevValue) => ({
      ...prevValue,
      addressLine2: value,
    }));
  };

  const handleLocationSelect3 = async (value) => {
    try {
      setFormData((prevValue) => ({
        ...prevValue,
        billingAddressLine1: value,
      }));
    } catch (error) {
      console.error("Error selecting address", error);
    }
  };

  const handleLocationChange3 = (value) => {
    setFormData((prevValue) => ({
      ...prevValue,
      billingAddressLine1: value,
    }));
  };

  const handleLocationSelect4 = async (value) => {
    try {
      setFormData((prevValue) => ({
        ...prevValue,
        billingAddressLine2: value,
      }));
    } catch (error) {
      console.error("Error selecting address", error);
    }
  };

  const handleLocationChange4 = (value) => {
    setFormData((prevValue) => ({
      ...prevValue,
      billingAddressLine2: value,
    }));
  };

  const searchOptions = {
    componentRestrictions: { country: "AU" },
    // componentRestrictions: { country: formData.country }
  };

  return (
    <>
      {
        <div className="shipping_addreess">
          {processing && (
            <>
              <div className="order_processing_loader">
                <div className="content_box">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <h5>Please wait...</h5>
                  <h5>While we are processing your payment.</h5>
                </div>
              </div>
            </>
          )}
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} md={10}>
                <div className="">
                  <Box sx={{ width: "100%" }}>
                    <div className="gloab_card">
                      <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                          const stepProps = {};
                          const labelProps = {};
                          if (isStepOptional(index)) {
                            labelProps.optional = (
                              <Typography variant="caption">
                                Optional
                              </Typography>
                            );
                          }
                          if (isStepSkipped(index)) {
                            stepProps.completed = false;
                          }
                          return (
                            <Step key={label} {...stepProps}>
                              <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                          );
                        })}
                      </Stepper>
                    </div>

                    <React.Fragment>
                      <div className="ship_address gloab_card mt-5 cutoms-login-artist">
                        {activeStep == 0 ? (
                          <>
                            <h1 className="mb-md-5 mb-3">Shipping address</h1>
                            <Row>
                              {!auth("customer") && (
                                <Col md={12} className="mb-3">
                                  <Form>
                                    <Form.Group
                                      className="mb-3"
                                      controlId="exampleForm.ControlInput1"
                                    >
                                      <Form.Label>Email *</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="email"
                                        value={formData?.email}
                                        onChange={handleChange}
                                        onBlur={checkGuestEmailExists}
                                        maxLength={25}
                                      />
                                      <span className="errmsg">
                                        {error.email}
                                      </span>
                                    </Form.Group>
                                  </Form>
                                </Col>
                              )}
                              <Col md={6} className="mb-3">
                                <Form>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Label>First Name *</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder=""
                                      name="firstName"
                                      value={formData?.firstName}
                                      onChange={handleChange}
                                      maxLength={25}
                                    />
                                    <span className="errmsg">
                                      {error.firstName}
                                    </span>
                                  </Form.Group>
                                </Form>
                              </Col>

                              <Col md={6} className="mb-3">
                                <Form>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Label>Last Name *</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder=""
                                      name="lastName"
                                      value={formData?.lastName}
                                      onChange={handleChange}
                                      maxLength={25}
                                    />
                                    <span className="errmsg">
                                      {error.lastName}
                                    </span>
                                  </Form.Group>
                                </Form>
                              </Col>

                              <Col md={12} className="mb-3">
                                <div className="group error">
                                  <PlacesAutocomplete
                                    value={formData?.addressLine1}
                                    name="street"
                                    onChange={handleLocationChange}
                                    onSelect={handleLocationSelect}
                                  // searchOptions={searchOptions}
                                  >
                                    {({
                                      getInputProps,
                                      suggestions,
                                      getSuggestionItemProps,
                                      loading,
                                    }) => (
                                      <div className="location_input mb-0">
                                        <span className="top_text mb-0">
                                          Address Line 1 *{" "}
                                          <span className="dot_alert"></span>
                                        </span>
                                        <input
                                          className="mb-0"
                                          {...getInputProps({
                                            placeholder: "Start Typing",
                                          })}
                                        />
                                        <div className="autocomplete-dropdown-container">
                                          {loading ? (
                                            <div>Loading...</div>
                                          ) : null}
                                          {suggestions?.map((suggestion) => {
                                            const style = {
                                              backgroundColor: suggestion.active ? "whitesmoke"
                                                : "#fff",
                                              padding: "10px 10px",
                                              cursor: "pointer",
                                            };
                                            return (
                                              <div
                                                {...getSuggestionItemProps(
                                                  suggestion,
                                                  { style }
                                                )}
                                                key={suggestion.placeId}
                                              >
                                                {suggestion.description}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </PlacesAutocomplete>
                                  <span className="errmsg">
                                    {error.addressLine1}
                                  </span>
                                </div>
                                <p
                                  style={{ color: "#909090", fontSize: "14px" }}
                                >
                                  {" "}
                                  We do not deliver to P.O. Boxes. Please enter
                                  your regular address otherwise your order will
                                  be canceled.
                                </p>
                              </Col>

                              <Col md={12} className="mb-3">
                                <div className="group error">
                                  <PlacesAutocomplete
                                    value={formData?.addressLine2}
                                    name="street"
                                    onChange={handleLocationChange2}
                                    onSelect={handleLocationSelect2}
                                  // searchOptions={searchOptions}
                                  >
                                    {({
                                      getInputProps,
                                      suggestions,
                                      getSuggestionItemProps,
                                      loading,
                                    }) => (
                                      <div className="location_input mb-0">
                                        <span className="top_text mb-0">
                                          Address Line 2 *{" "}
                                          <span className="dot_alert"></span>
                                        </span>
                                        <input
                                          className="mb-0"
                                          {...getInputProps({
                                            placeholder: "Start Typing",
                                          })}
                                        />
                                        <div className="autocomplete-dropdown-container">
                                          {loading ? (
                                            <div>Loading...</div>
                                          ) : null}
                                          {suggestions?.map((suggestion) => {
                                            const style = {
                                              backgroundColor: suggestion.active
                                                ? "whitesmoke"
                                                : "#fff",
                                              padding: "10px 10px",
                                              cursor: "pointer",
                                            };
                                            return (
                                              <div
                                                {...getSuggestionItemProps(
                                                  suggestion,
                                                  { style }
                                                )}
                                                key={suggestion.placeId}
                                              >
                                                {suggestion.description}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </PlacesAutocomplete>
                                </div>
                                <p
                                  style={{ color: "#909090", fontSize: "14px" }}
                                >
                                  {" "}
                                  We do not deliver to P.O. Boxes. Please enter
                                  your regular address otherwise your order will
                                  be canceled.
                                </p>
                              </Col>

                              <Col md={12} className="mb-3">
                                <Form.Label>Choose Country</Form.Label>
                                <Autocomplete
                                  options={countryOptions}
                                  getOptionLabel={(option) =>
                                    option.label.props.children[1]
                                  }
                                  renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="outlined"
                                      error={Boolean(error.country)}
                                      helperText={error.country}
                                    />
                                  )}
                                  value={
                                    countryOptions.find(
                                      (option) =>
                                        option.value === formData.country
                                    ) || null
                                  }
                                  onChange={handleCountryChange}
                                />
                              </Col>

                              <Col md={12} className="mb-3">
                                <Form.Group>
                                  <Form.Label>Choose State*</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                  >
                                    <option value="">--SELECT--</option>
                                    {stateList?.map((item, i) => (
                                      <option value={item?.value}>
                                        {item.displayValue}
                                      </option>
                                    ))}
                                  </Form.Control>
                                  <span className="errmsg">{error.state}</span>
                                </Form.Group>
                              </Col>

                              <Col md={3} className="mb-3">
                                <Form>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>Postal Code*</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="postalCode"
                                      value={formData?.postalCode}
                                      onChange={handleChange}
                                      maxLength={8}
                                    />
                                    <span className="errmsg">
                                      {error.postalCode}
                                    </span>
                                  </Form.Group>
                                </Form>
                              </Col>

                              <Col md={9} className="mb-3">
                                <Form>
                                  <Form.Group
                                    className=""
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Label>City*</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="city"
                                      value={formData?.city}
                                      onChange={handleChange}
                                    />
                                    <span className="errmsg">{error.city}</span>
                                  </Form.Group>
                                </Form>
                              </Col>

                              <Col md={12} className="mb-3">
                                <Form>
                                  <Form.Group
                                    className=""
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Label>Phone Number*</Form.Label>
                                    <Form.Control
                                      type="tel"
                                      name="contactPhone"
                                      value={formData?.contactPhone}
                                      onChange={handleChange}
                                      placeholder="000 0000 0000"
                                      maxLength={14}
                                    />
                                    <span className="errmsg">
                                      {error.contactPhone}
                                    </span>
                                  </Form.Group>

                                  <p
                                    className="mt-3"
                                    style={{
                                      color: "#909090",
                                      fontSize: "14px",
                                    }}
                                  >
                                    Contact phone for DHL/UPS courier only
                                  </p>
                                </Form>
                              </Col>

                              <hr className="mb-0" />
                              <Col md={12} className="add_box mb-3">
                                <Form.Group>
                                  <Form.Check
                                    type="radio"
                                    aria-label="billing-same-as-shipping"
                                    label="Billing address same as shipping address"
                                    name="billingAddress"
                                    value="same"
                                    checked={billingAddressSame}
                                    onChange={handleRadioChange}
                                    id="billing-same-as-shipping"
                                  />
                                  <Form.Check
                                    type="radio"
                                    aria-label="use-different-billing-address"
                                    label="Use a different billing address"
                                    name="billingAddress"
                                    value="different"
                                    checked={!billingAddressSame}
                                    onChange={handleRadioChange}
                                    id="use-different-billing-address"
                                  />
                                </Form.Group>
                              </Col>

                              {!billingAddressSame && (
                                <>
                                  <Col md={6} className="mb-3">
                                    <Form>
                                      <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlInput1"
                                      >
                                        <Form.Label>First Name *</Form.Label>
                                        <Form.Control
                                          type="text"
                                          placeholder=""
                                          name="billingFirstName"
                                          value={formData?.billingFirstName}
                                          onChange={handleChange}
                                          maxLength={25}
                                        />
                                        <span className="errmsg">
                                          {error.billingFirstName}
                                        </span>
                                      </Form.Group>
                                    </Form>
                                  </Col>
                                  <Col md={6} className="mb-3">
                                    <Form>
                                      <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlInput1"
                                      >
                                        <Form.Label>Last Name *</Form.Label>
                                        <Form.Control
                                          type="text"
                                          placeholder=""
                                          name="billingLastName"
                                          value={formData?.billingLastName}
                                          onChange={handleChange}
                                          maxLength={25}
                                        />
                                        <span className="errmsg">
                                          {error.billingLastName}
                                        </span>
                                      </Form.Group>
                                    </Form>
                                  </Col>

                                  <Col md={12} className="mb-3">
                                    <div className="group error">
                                      <PlacesAutocomplete
                                        value={formData?.billingAddressLine1}
                                        name="street"
                                        onChange={handleLocationChange3}
                                        onSelect={handleLocationSelect3}
                                      // searchOptions={searchOptions}
                                      >
                                        {({
                                          getInputProps,
                                          suggestions,
                                          getSuggestionItemProps,
                                          loading,
                                        }) => (
                                          <div className="location_input mb-0">
                                            <span className="top_text mb-0">
                                              Billing Address Line 1 * *{" "}
                                              <span className="dot_alert"></span>
                                            </span>
                                            <input
                                              className="mb-0"
                                              {...getInputProps({
                                                placeholder: "Start Typing",
                                              })}
                                            />
                                            <div className="autocomplete-dropdown-container">
                                              {loading ? (
                                                <div>Loading...</div>
                                              ) : null}
                                              {suggestions?.map((suggestion) => {
                                                const style = {
                                                  backgroundColor: suggestion.active
                                                    ? "whitesmoke"
                                                    : "#fff",
                                                  padding: "10px 10px",
                                                  cursor: "pointer",
                                                };
                                                return (
                                                  <div
                                                    {...getSuggestionItemProps(
                                                      suggestion,
                                                      { style }
                                                    )}
                                                    key={suggestion.placeId}
                                                  >
                                                    {suggestion.description}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </PlacesAutocomplete>
                                    </div>
                                    <span className="errmsg">
                                      {error.billingAddressLine1}
                                    </span>
                                    <p
                                      style={{ color: "#909090", fontSize: "14px" }}
                                    >
                                      {" "}
                                      We do not deliver to P.O. Boxes. Please enter
                                      your regular address otherwise your order will
                                      be canceled.
                                    </p>
                                  </Col>

                                  <Col md={12} className="mb-3">
                                    <div className="group error">
                                      <PlacesAutocomplete
                                        value={formData?.billingAddressLine2}
                                        name="street"
                                        onChange={handleLocationChange4}
                                        onSelect={handleLocationSelect4}
                                      // searchOptions={searchOptions}
                                      >
                                        {({
                                          getInputProps,
                                          suggestions,
                                          getSuggestionItemProps,
                                          loading,
                                        }) => (
                                          <div className="location_input mb-0">
                                            <span className="top_text mb-0">
                                              Billing Address Line 2 * {" "}
                                              <span className="dot_alert"></span>
                                            </span>
                                            <input
                                              className="mb-0"
                                              {...getInputProps({
                                                placeholder: "Start Typing",
                                              })}
                                            />
                                            <div className="autocomplete-dropdown-container">
                                              {loading ? (
                                                <div>Loading...</div>
                                              ) : null}
                                              {suggestions?.map((suggestion) => {
                                                const style = {
                                                  backgroundColor: suggestion.active
                                                    ? "whitesmoke"
                                                    : "#fff",
                                                  padding: "10px 10px",
                                                  cursor: "pointer",
                                                };
                                                return (
                                                  <div
                                                    {...getSuggestionItemProps(
                                                      suggestion,
                                                      { style }
                                                    )}
                                                    key={suggestion.placeId}
                                                  >
                                                    {suggestion.description}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </PlacesAutocomplete>
                                    </div>
                                    <p
                                      style={{ color: "#909090", fontSize: "14px" }}
                                    >
                                      {" "}
                                      We do not deliver to P.O. Boxes. Please enter
                                      your regular address otherwise your order will
                                      be canceled.
                                    </p>
                                  </Col>


                                  {/* <Col md={12} className="mb-3">
                                    <Form>
                                      <Form.Group
                                        className=""
                                        controlId="exampleForm.ControlInput1"
                                      >
                                        <Form.Label>
                                          Billing Address Line 1 *
                                        </Form.Label>
                                        <Form.Control
                                          type="text"
                                          placeholder=""
                                          name="billingAddressLine1"
                                          value={formData?.billingAddressLine1}
                                          onChange={handleChange}
                                          maxLength={35}
                                        />
                                        <span className="errmsg">
                                          {error.billingAddressLine1}
                                        </span>
                                      </Form.Group>
                                      <p
                                        style={{
                                          color: "#909090",
                                          fontSize: "14px",
                                        }}
                                      >
                                        We do not deliver to P.O. Boxes. Please
                                        enter your regular address otherwise
                                        your order will be canceled.
                                      </p>
                                    </Form>
                                  </Col> */}
                                  {/* <Col md={12} className="mb-3">
                                    <Form>
                                      <Form.Group
                                        className=""
                                        controlId="exampleForm.ControlInput1"
                                      >
                                        <Form.Label>
                                          Billing Address Line 2 *
                                        </Form.Label>
                                        <Form.Control
                                          type="text"
                                          name="billingAddressLine2"
                                          value={formData?.billingAddressLine2}
                                          onChange={handleChange}
                                          maxLength={35}
                                        />
                                        <span className="errmsg">
                                          {error.billingAddressLine2}
                                        </span>
                                      </Form.Group>
                                      <p
                                        style={{
                                          color: "#909090",
                                          fontSize: "14px",
                                        }}
                                      >
                                        We do not deliver to P.O. Boxes. Please
                                        enter your regular address otherwise
                                        your order will be canceled.
                                      </p>
                                    </Form>
                                  </Col> */}


                                  <Col md={12} className="mb-3">
                                    <div className="choose_country">
                                      <Autocomplete
                                        options={countryOptions1}
                                        getOptionLabel={(option) =>
                                          option.label.props.children[1]
                                        }
                                        renderOption={(props, option) => (
                                          <Box component="li" {...props}>
                                            {option.label}
                                          </Box>
                                        )}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Choose Country*"
                                            variant="outlined"
                                            error={Boolean(
                                              error.billingCountry
                                            )}
                                            helperText={error.billingCountry}
                                          />
                                        )}
                                        value={
                                          countryOptions1.find(
                                            (option) =>
                                              option.value ===
                                              formData.billingCountry
                                          ) || null
                                        }
                                        onChange={handleCountryChange1}
                                      />
                                    </div>
                                  </Col>
                                  <Col md={12} className="mb-3">
                                    <Form.Group>
                                      <Form.Label>Choose State*</Form.Label>
                                      <Form.Control
                                        as="select"
                                        name="billingState"
                                        value={formData.billingState}
                                        onChange={handleChange}
                                      >
                                        <option value="">--SELECT--</option>
                                        {stateList1?.map((item, i) => (
                                          <option key={i} value={item?.value}>
                                            {item.displayValue}
                                          </option>
                                        ))}
                                      </Form.Control>
                                      <span className="errmsg">
                                        {error.billingState}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                  <Col md={3} className="mb-3">
                                    <Form>
                                      <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Postal Code*</Form.Label>
                                        <Form.Control
                                          type="text"
                                          name="billingPostalCode"
                                          value={formData?.billingPostalCode}
                                          onChange={handleChange}
                                          maxLength={8}
                                        />
                                        <span className="errmsg">
                                          {error.billingPostalCode}
                                        </span>
                                      </Form.Group>
                                    </Form>
                                  </Col>
                                  <Col md={9} className="mb-3">
                                    <Form>
                                      <Form.Group
                                        className=""
                                        controlId="exampleForm.ControlInput1"
                                      >
                                        <Form.Label>City*</Form.Label>
                                        <Form.Control
                                          type="text"
                                          name="billingCity"
                                          value={formData?.billingCity}
                                          onChange={handleChange}
                                        />
                                        <span className="errmsg">
                                          {error.billingCity}
                                        </span>
                                      </Form.Group>
                                    </Form>
                                  </Col>
                                  <Col md={12} className="mb-3">
                                    <Form>
                                      <Form.Group
                                        className=""
                                        controlId="exampleForm.ControlInput1"
                                      >
                                        <Form.Label>Phone Number*</Form.Label>
                                        <Form.Control
                                          type="tel"
                                          name="billingContactPhone"
                                          value={formData?.billingContactPhone}
                                          onChange={handleChange}
                                          placeholder="000 0000 0000"
                                          maxLength={14}
                                        />
                                        <span className="errmsg">
                                          {error.billingContactPhone}
                                        </span>
                                      </Form.Group>

                                      <p
                                        style={{
                                          color: "#909090",
                                          fontSize: "14px",
                                        }}
                                      >
                                        Contact phone for DHL/UPS courier only
                                      </p>
                                    </Form>
                                  </Col>
                                </>
                              )}
                            </Row>
                          </>
                        ) : activeStep == 1 ? (
                          <>
                            <>
                              <div className="payemt_screen gloab_card mb-3 ">
                                <div className="shipping_details">
                                  <h2>Shipping Address</h2>
                                  <p className="mt-4">
                                    <b>
                                      {formData?.firstName +
                                        " " +
                                        formData?.lastName}
                                    </b>{" "}
                                  </p>
                                  <p>{formData?.contactPhone}</p>
                                  <p>{formData?.email}</p>
                                  <p>{formData?.state}</p>
                                  <p>{formData?.city}</p>
                                  <p>{formData?.postalCode}</p>
                                  <p>
                                    {formData?.addressLine1},{" "}
                                    {formData?.addressLine2}
                                  </p>
                                </div>
                              </div>

                              <div className="payemt_screen gloab_card mb-3 ">
                                <div className="order_summ shipping_details">
                                  <div className="d-lg-flex justify-content-between align-items-center">
                                    <h2 className="mb-3">Order Summary</h2>
                                    <div className="coupan_apply">
                                      <Form>
                                        <Form.Group
                                          className="d-flex"
                                          controlId="exampleForm.ControlInput1"
                                        >
                                          <div className="coupan_box">
                                            <Form.Control
                                              type="text"
                                              placeholder="Add Coupon"
                                              value={code}
                                              onChange={(e) =>
                                                setCode(e.target.value)
                                              }
                                            />
                                            {couponRes && (
                                              <button
                                                type="button"
                                                className="global_light_btn text-danger"
                                                onClick={() => {
                                                  setCouponRes(null);
                                                  setCode("");
                                                }}
                                              >
                                                {" "}
                                                <i className="fa fa-times"></i>{" "}
                                              </button>
                                            )}
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => applyCoupon()}
                                          >
                                            Apply
                                          </button>


                                        </Form.Group>

                                        <span
                                          className={`d-block text-md-end mt-3 mb-3 fw-bold ${couponRes?.status
                                            ? "text-success"
                                            : "text-danger"
                                            }`}
                                        >
                                          {couponRes?.message}{" "}

                                        </span>
                                      </Form>
                                    </div>
                                  </div>

                                  <ul className="p-0">
                                    <li>
                                      <span>Item</span>
                                      <p className="m-0">
                                        <b>
                                          {orderDetails?.cartItem?.length}{" "}
                                          {orderDetails?.cartItem?.length > 1
                                            ? "items"
                                            : "item"}
                                        </b>{" "}
                                      </p>
                                    </li>

                                    <li>
                                      <span>Subtotal</span>
                                      <p className="m-0">
                                        <b>${orderDetails?.subTotal}</b>{" "}
                                      </p>
                                    </li>

                                    <li>
                                      <span>Shipping</span>
                                      <p className="m-0">
                                        {shippingChargeRes?.price ? (
                                          <b>+ ${shippingChargeRes?.price} </b>
                                        ) : (
                                          <div class="snippet">
                                            <div class="stage">
                                              <div class="dot-typing"></div>{" "}
                                            </div>
                                          </div>
                                        )}
                                      </p>
                                    </li>
                                    <li>
                                      <span>
                                        Coupon{" "}
                                        {couponRes?.status && (
                                          <b>({couponRes?.coupon})</b>
                                        )}
                                      </span>
                                      <p className="m-0">
                                        <b>
                                          {couponRes?.discount
                                            ? `- $${couponRes?.discount}`
                                            : 0}
                                        </b>
                                      </p>
                                    </li>
                                    <li>
                                      <span>
                                        <strong>Total</strong>
                                      </span>
                                      <p className="m-0">
                                        <b>${totalPrice?.toFixed(2)}</b>
                                      </p>
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="payemt_screen gloab_card mb-3 ">
                                <div className="order_summ shipping_details">
                                  <h2>Choose Payment Method</h2>
                                  <div>
                                    <form
                                      className="choose_method"
                                      onSubmit={handleSubmit}
                                    >
                                      {/* <div>
                                      <label
                                        htmlFor="paypal"
                                        className={
                                          selectedMethod === "Paypal"
                                            ? "active"
                                            : ""
                                        }
                                      >
                                        <input
                                          type="radio"
                                          id="paypal"
                                          name="paymentMethod"
                                          value="Paypal"
                                          checked={selectedMethod === "Paypal"}
                                          onChange={handleChange1}
                                        />
                                        Paypal
                                        <img
                                          style={{ width: "50px" }}
                                          src={paypalimg}
                                          alt="img"
                                        />
                                      </label>
                                    </div> */}
                                      <div>
                                        <label
                                          htmlFor="Stripe"
                                          className={
                                            selectedMethod === "Stripe"
                                              ? "active"
                                              : ""
                                          }
                                        >
                                          <input
                                            type="radio"
                                            id="Stripe"
                                            name="paymentMethod"
                                            value="Stripe"
                                            checked={
                                              selectedMethod === "Stripe"
                                            }
                                            onChange={handleChange1}
                                          />
                                          Stripe
                                          <img
                                            style={{
                                              width: "60%",
                                              height: "50px",
                                              objectFit: "contain",
                                            }}
                                            src={stripeimg}
                                            alt="img"
                                          />
                                        </label>
                                      </div>
                                    </form>
                                    {/* {openPaymentForm === "Stripe" && ( */}
                                    <Col md={12} className="mb-3 mt-4">
                                      <CardElement className="card-stripe-element" />
                                      {stripErr && (
                                        <div className="stripe-error-msg mt-2">
                                          {stripErr}
                                        </div>
                                      )}
                                      <div className="mt-4">
                                        <span>
                                          Secure payments are handled by Stripe.
                                          We never even see your card details.
                                        </span>
                                      </div>
                                    </Col>
                                    {/* )} */}
                                  </div>
                                </div>
                              </div>
                            </>
                          </>
                        ) : (
                          "User Step Three"
                        )}
                        <div className="text-center">
                          {activeStep > 0 && (
                            <Button
                              type="button"
                              className="global_btn me-2"
                              onClick={handleBack}
                            >
                              Back
                            </Button>
                          )}
                          {processing ? (
                            <Button className="global_btn" disabled>
                              Processing
                            </Button>
                          ) : (
                            <>
                              {activeStep === steps.length - 1 ? (
                                shippingChargeRes ? (
                                  <Button
                                    className="global_btn"
                                    onClick={
                                      activeStep === 0
                                        ? handleNext
                                        : handleSubmit
                                    }
                                  >
                                    Pay Now
                                  </Button>
                                ) : (
                                  <Button className="global_btn" disableRipple>
                                    Pay Now
                                  </Button>
                                )
                              ) : (
                                <Button
                                  className="global_btn"
                                  onClick={
                                    activeStep === 0 ? handleNext : handleSubmit
                                  }
                                >
                                  Continue To payment
                                </Button>
                              )}
                            </>
                          )}
                          <p
                            className="mt-4 text-start"
                            style={{ fontSize: "12px" }}
                          >
                            The Controller of your personal data is GWD Concept
                            Sp. z o. o., operating under the business name
                            AIARTIFACT. Your personal data will be processed for
                            the purpose of realisation of your order, and –
                            whether you decided to join AIARTIFACT Membership
                            Club – for the purpose of providing this service. To
                            see full information on the processing of your
                            personal data, including information on your right.
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  </Box>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      }
    </>
  );
};

export default ShippingAddress;
