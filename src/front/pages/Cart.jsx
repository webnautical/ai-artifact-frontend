import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Offcanvas, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Newsletter from "../../components/Newsletter";
import paymentimg from '../../assets/images/payment-method.png'
// import p from '../../assets/images/payment-method.png'
import whiteframe from '../../assets/images/framesSprite.png';
 
import { useFrontDataContext } from "../../helper/context/FrontContextProvider";
import { auth, defaultIMG, imgBaseURL, sizeBtnArr, toastifySuccess } from "../../helper/Utility";
import FrontLoader from "../../components/FrontLoader";
import BTNLoader from "../../components/BTNLoader";
import QuantitySelector from "../../components/QuantitySelector ";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import emptycart from "../../assets/images/cart-empty.png";
import GlossEffect from "../../components/GlossEffect";
import TexturePicker from "../../components/TexturePicker";
import SelectableButtons from "../../components/SelectableButtons";
import { APICALL } from "../../helper/api/api";
const Cart = () => {
  const navigate = useNavigate()
  const { contextLoader, getCartListFun, cartList, addToCartFun, guestCart, getGestCartListFun, removeFromGuestCart } = useFrontDataContext();
 
  useEffect(() => {
    if (auth('customer')) {
      getCartListFun()
    } else {
        getGestCartListFun(guestCart)
    }
  }, [guestCart])
 
  const qntChange = (qnt, product_id, uid, initialQuantity) => {
    const qntt = initialQuantity === undefined ? 1 : -1
    addToCartFun(product_id, qntt, uid, 0, "qntChange");
  };
 
  const itemTotal = cartList.reduce((acc, item) => {
    return acc + (item?.row_uid?.price * item?.quantity || 0);
  }, 0);
  const totalPrice = parseInt(itemTotal)
 
  const handleContinue = () => {
    const data = {
      cartItem: cartList,
      subTotal: parseInt(itemTotal),
      totalPrice: totalPrice,
    }
    navigate(`/shipping-details`, { state: { data } })
  }
 
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const [editItemObj, setEditItemObj] = useState(null)
  const [brightness, setBrightness] = useState(1)
  const [frameTexture, setFrameTexture] = useState(null);
 
  const handleShow = (item) => {
    setShow(true);
    setEditItemObj(item)
  }
 
 
  const [artDetails, setArtDetails] = useState({
    price: 0,
    product_price: 0,
    uid: null,
    qnt: 1,
  })
 
  const [selectedOptions, setSelectedOptions] = useState({
    frame: "",
    quality: "",
    size: '',
    frameType: '',
    assembly: '',
    affiliateId: ""
  });
 
  const handleClose = () => {
    setEditItemObj(null)
    setShow(false);
    setArtDetails({
      ...artDetails, price: 0, product_price: 0, qnt: 1, uid: null
    })
  }
 
  const brightnessOptions = [
    { label: 'Matte', value: 1, url: '', 'Museum-Quality Matte': '250-gsm-100lb-uncoated-offwhite-archival', type: 'Museum-Quality Matte' },
    { label: 'Glossy', value: 1.25, url: '', 'Premium Semi-Glossy': '200-gsm-80lb-coated-silk', type: 'Premium Semi-Glossy' }
  ];
 
  const texturesOptions = [
    { name: 'black', url: 'https://wallpaperaccess.com/full/173805.jpg', color: 'Black' },
    { name: 'white', url: whiteframe, color: 'White' },
    { name: 'wood', url: 'https://tse4.mm.bing.net/th?id=OIP.jdVkhxiOxZLMSNu5hFgTTQHaE8&pid=Api&P=0&h=220', color: 'Wood' },
  ];
 
  useEffect(() => {
    if (editItemObj) {
      setSelectedOptions({
        ...selectedOptions, frame: editItemObj?.frame, frameType: editItemObj?.frameType, assembly: editItemObj?.assembly, quality: editItemObj?.quality, size: editItemObj?.size, affiliateId: editItemObj?.affiliateId
      })
      setArtDetails({
        ...artDetails, price: editItemObj?.row_uid?.price, qnt: editItemObj?.quantity, uid: editItemObj?.row_uid?.productUid
      })
      // getPriceFun(editItemObj?.row_uid?.productUid)
 
      const brightnessRes = brightnessOptions.find(option => option.type?.toLocaleLowerCase() == editItemObj?.quality?.toLocaleLowerCase());
      setBrightness(brightnessRes?.value)
 
      const textures = texturesOptions.find(option => option.name?.toLocaleLowerCase() === editItemObj?.frameType?.toLocaleLowerCase());
      setFrameTexture(textures?.url)
    }
  }, [editItemObj, show])
 
  const canvasQntChange = (qnt, product_id) => {
    setArtDetails({ ...artDetails, qnt: qnt })
  };

  const handleBrightnessChange = (option) => {
    const newSelectedOptions = { ...selectedOptions, ['quality']: option?.type };
    setSelectedOptions(newSelectedOptions)
    setBrightness(option?.value)
  };
 
  const handleSizeSelect = (item) => {
    const newSelectedOptions = { ...selectedOptions, ['size']: item?.name };
    setSelectedOptions(newSelectedOptions)
  };
 
  const handleTextureSelect = (texture) => {
    const newSelectedOptions = { ...selectedOptions, ['frame']: texture?.frame, ['frameType']: texture.color, ['assembly']: editItemObj?.assembly };
    setSelectedOptions(newSelectedOptions)
    setFrameTexture(texture.url);
  };
 
  const handleSelect = (button, button2) => {
    const newSelectedOptions = { ...selectedOptions, ['assembly']: button2 };
    setSelectedOptions(newSelectedOptions)
  };
 
  const editCartItem = async () => {
    setLoading(true)
    const params = {
      "product_id": editItemObj?.product_id?._id,
      "cartItemId": editItemObj?._id,
      "quantity": artDetails?.qnt,
      "puid": artDetails?.uid,
      ...selectedOptions
    }
    try {
      const res = await APICALL('/user/updateCartItem', 'post', params)
      if (res?.status) {
        getCartListFun()
        handleClose()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const canvasRef = useRef(null);
  useEffect(() => {
    if (selectedOptions) {
      const canvas = canvasRef.current;
      if (!canvas) return;
 
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
 
      const img = new Image();
      // ctx.filter = `brightness(${brightness})`;
      img.src = imgBaseURL() + editItemObj?.product_id?.image;
 
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = `brightness(${brightness})`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
 
        if (frameTexture) {
          const frameImg = new Image();
          frameImg.src = frameTexture;
 
          frameImg.onload = () => {
            const pattern = ctx.createPattern(frameImg, 'repeat');
            ctx.lineWidth = 30;
            ctx.strokeStyle = pattern;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
          };
        }
        return () => {
          img.onload = null;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
      };
    }
  }, [frameTexture, brightness, editItemObj, show, selectedOptions]);

  useEffect(() => {
    GET_UID_AND_GELETO_PRICE_BY_PRODUCT_TYPE()
  }, [selectedOptions])

  const GET_UID_AND_GELETO_PRICE_BY_PRODUCT_TYPE = async () => {
    try {
      const res = await APICALL('user/getGelatoUidByParams', 'post', selectedOptions)
      if(res?.status){
        const price = (parseInt(res?.data?.price)) * artDetails?.qnt
        setArtDetails({ ...artDetails, 'product_price': price, 'uid': res?.data?.productUid , price: parseInt(res?.data?.price) })
      }
    } catch (error) {
      console.log(error)
    }
  }
 
  return (
    <>
      <div className="cart_page">
        <Container>
          <h1 className="mb-md-5 mb-4">Your Cart</h1>
          {
            contextLoader?.cartList ? <FrontLoader /> :
              <Row>
                <Col lg={9} className="mb-lg-0 mb-3">
                  <div className="cart_list_box">
                    {
                      cartList?.length > 0 ?
                        cartList?.map((item, i) => (
                          <div className="cart_list">
                            <div className="product_image">
                              <Link to={`/product-details/${item?.product_id?._id}`}>
                                <img src={imgBaseURL() + item?.product_id?.thumbnail} alt="product-image" />
                              </Link>
                            </div>
 
                            <div className="about_details_product">
                              <Link to={`/product-details/${item?.product_id?._id}`}>
                                <h2>{item?.product_id?.title}</h2>
                              </Link>
 
                              <div className="about_frame d-flex justify-content-between align-items-center">
                                <div>
                                  <ul>
                                    <li>
                                      <span>Size :</span> {item?.size}
                                    </li>
                                    <li>
                                      <span>Finish :</span> {item?.quality}
                                    </li>
                                    {
                                      item?.frameType &&
                                      <li>
                                        <span>Color : </span> {item?.frameType}
                                      </li>
                                    }
                                    {
                                      item?.assembly &&
                                      <li>
                                        <span>Assembly : </span> {item?.assembly}
                                      </li>
                                    }
                                  </ul>
 
                                  <div className="add-remove-btn mt-2">
                                    {
                                      contextLoader.addToCart[item?.product_id?._id] ?
                                        <BTNLoader className='remove_btn' /> :
                                        <>
                                          {
                                            auth("customer")?.id ?
                                              <button className='remove_btn' onClick={() => { addToCartFun(item?.product_id?._id, 0, item?.row_uid?.test_id || item?.row_uid?.productUid) }}>Remove</button>
                                              :
                                              <button className='remove_btn' onClick={() => { removeFromGuestCart(item?.product_id?._id,) }}>Remove</button>
                                          }
                                        </>
                                    }
 
                                    <button className='remove_btn' onClick={() => { handleShow(item) }}>Edit</button>
 
                                    {/* <p>Item Price: <strong>${parseInt(item?.row_uid?.price) * item?.quantity}</strong></p> */}
                                  </div>
                                </div>
                                <div className="price_quantity text-end">
                                  <h3 className="mb-md-3">${parseInt(item?.row_uid?.price)} x {item?.quantity}</h3>
                                  <QuantitySelector initialQuantity={item?.quantity} onQuantityChange={qntChange} product_id={item?.product_id?._id} uid={item?.row_uid?.test_id || item?.row_uid?.productUid} />
                                </div>
                              </div>
 
 
                            </div>
                          </div>
                        ))
                        :
                        <>
                          <div className="cart_em_img text-center mt-mb-4">
                            <img src={emptycart} alt="" />
                            <h5 className="mt-2">Your Cart is empty.</h5>
                            <p>
                              Your cart is currently empty. Start adding items to
                              your cart!
                            </p>
                            <Link className="global_btn d-inline-block " to="/product-list">Shop</Link>
 
                          </div>
                        </>
                    }
                  </div>
                </Col>
 
                <Col lg={3}>
                  <div className="ship_to gloab_card mb-md-0 mb-3">
                    <ul className="p-0">
                      <h3>Checkout</h3>
                      <li>
                        <div>Est. Total:</div>
                        <div className="Prcie_final">${totalPrice}</div>
                      </li>
                    </ul>
                    {
                      cartList?.length > 0 ?
                        <button class="global_btn w-100" type="button" onClick={() => handleContinue()}>Checkout</button>
                        :
                        <button class="global_btn w-100" type="button" style={{ cursor: "not-allowed" }} disabled>Checkout</button>
                    }
 
                    <div className="payment_method W-100 mt-3">
                      <img className="w-100" src={paymentimg} alt="payment-method-icon" />
                    </div>
                  </div>
                </Col>
              </Row>
          }
        </Container>
 
        <Offcanvas className="cart_edit" placement="end" show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Edit item</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div>
              <div className="canvas-box">
                <canvas
                  className="canvas-container"
                  ref={canvasRef}
                  width={170}
                  height={240}
                ></canvas>
              </div>
              <div className="img-box">
                <p>${artDetails?.product_price} per item</p>
              </div>
 
              <div className="mt-3">
                <span>Quantity</span>
                <QuantitySelector onQuantityChange={canvasQntChange} product_id={editItemObj?.product_id?._id} initialQuantity={editItemObj?.quantity} />
              </div>
 
              <div className="mt-3">
                <span>Product type</span>
                <GlossEffect onBrightnessChange={handleBrightnessChange} light={brightness} />
              </div>
 
              <div className="mt-3">
                <span className="d-block">Choose Size</span>
                <div className="add_frame">
                  {sizeBtnArr.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      className={
                        selectedOptions.size == item.name ? "active" : ""
                      }
                      onClick={() => handleSizeSelect(item)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
 
              <div className="mt-3">
                <span>Add frame</span>
                <TexturePicker onTextureSelect={handleTextureSelect} url={frameTexture} />
              </div>
 
              {selectedOptions.frame === 'With Frame' && (
                <>
                  <p className="typehed mb-0 mt-3">Assembly</p>
                  <div className="add_frame">
                    <SelectableButtons onSelect={handleSelect} url={frameTexture} select={selectedOptions?.assembly} />
                  </div>
                </>
              )}
              {
                loading ? <BTNLoader className="global_btn  w-100 mt-3" /> :
                  <button type="button" className="global_btn  w-100 mt-3" onClick={() => editCartItem()}>Save</button>
              }
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
      <Newsletter />
    </>
  );
};
 
export default Cart;