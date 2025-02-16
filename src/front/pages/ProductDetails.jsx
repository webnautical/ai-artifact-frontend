import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Form, Container, Modal } from "react-bootstrap";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";


import { Offcanvas, Button } from "react-bootstrap";

// import tiericon from "../../assets/images/4 - Diamond.png";
import noreview from "../../assets/images/no-review.gif";
import Artworks from "../../components/Artworks";
import Newsletter from "../../components/Newsletter";
import CanvasComponent from "../../components/CanvasComponent ";
import TexturePicker from "../../components/TexturePicker";
import WishlistIcon from "../../components/WishlistIcon";
import ImageCarousel from "../../components/ImageCarousel";
import QuantitySelector from "../../components/QuantitySelector ";
import GlossEffect from "../../components/GlossEffect";

import SelectableButtons from "../../components/SelectableButtons";
// import revimg from "../../assets/images/feedback.gif";
import { APICALL } from "../../helper/api/api";
import { useNavigate, useParams } from "react-router";
import FrontLoader from "../../components/FrontLoader";
import {
  auth,
  createSlug,
  encryptId,
  getTierImg,
  imgBaseURL,
  timeAgo,
  toastifyError,
  toastifySuccess,
} from "../../helper/Utility";
import BTNLoader from "../../components/BTNLoader";
import { SOMETHING_ERR } from "../../helper/Constant";
import { useFrontDataContext } from "../../helper/context/FrontContextProvider";
import { Link } from "react-router-dom";
import noDataImg from "../../assets/images/animasi-emptystate.gif";
import HTMLContent from "../../components/HTMLContent";

const ProductDetail = () => {
  // Har video ke liye alag state aur ref
  const videoRefs = [useRef(null), useRef(null), useRef(null)];
  const [isPlaying, setIsPlaying] = useState([false, false, false]);

  const handlePlayPause = (index) => {
    const newPlayingState = [...isPlaying];

    if (newPlayingState[index]) {
      videoRefs[index].current.pause();
    } else {
      videoRefs[index].current.play();
    }

    newPlayingState[index] = !newPlayingState[index];
    setIsPlaying(newPlayingState);
  };
  const [offcanvasModel, setOffcanvasModel] = useState(false);

  const {
    getGeneralSettingFun,
    addToCartFun,
    contextLoader,
    cartList,
    addRemoveWishList,
  } = useFrontDataContext();

  const { id } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const affiliateParam = searchParams.get("affiliate");

  const [productDetails, setProductDetails] = useState(null);
  const [reviewList, setReviewList] = useState([]);
  const [reviewModal, setReviewModal] = useState(false);
  const [artDetails, setArtDetails] = useState({
    price: 0,
    product_price: 0,
    uid: null,
    comission: 0,
    qnt: 1,
  });

  const [loader, setLoader] = useState({
    getProduct: false,
    reviewList: false,
    submitReview: false,
  });

  const [frameTexture, setFrameTexture] = useState(null);
  const [imgSize, setImgSize] = useState({
    height: 238,
    width: 171,
    transform: 1,
    brightness: 1,
  });

  const handleTextureSelect = (texture) => {
    if (texture?.frame === "No Frame") {
      const newSelectedOptions = {
        ...selectedOptions,
        ["frame"]: texture?.frame,
        ["frameType"]: texture.color,
      };
      setSelectedOptions(newSelectedOptions);
    } else {
      const newSelectedOptions2 = {
        ...selectedOptions,
        ["frame"]: texture?.frame,
        ["frameType"]: texture.color,
        ["assembly"]: "Ready-to-hang",
      };
      setSelectedOptions(newSelectedOptions2);
    }
    setFrameTexture(texture.url);
  };

  const handleBackgroundSelect = (image) => {
    setBackgroundImage(image);
  };

  const btnArr = [
    {
      height: 238,
      width: 171,
      transform: 1,
      size: "( Small )",
      name: '13x18 cm / 5x7"',
    },
    {
      height: 238,
      width: 171,
      size: "M",
      transform: 1.1,
      name: '30x40 cm / 12x16"',
    },
    {
      height: 238,
      width: 171,
      transform: 1.2,
      size: "L",
      name: '50x70 cm / 20x28"',
    },
  ];

  const handleSizeSelect = (item) => {
    const newSelectedOptions = { ...selectedOptions, ["size"]: item?.name };
    setSelectedOptions(newSelectedOptions);
    setImgSize({
      height: item.height,
      width: item.width,
      transform: item.transform,
      brightness: item.brightness,
    });
  };

  const images = [
    "https://assets-static-prod.displate.com/next-assets/public/images/pdp/HeroSlider/cupboard/bcg/2560.avif?v=MDQuMDQuMjAyNA==",
    "https://assets-static-prod.displate.com/next-assets/public/images/pdp/HeroSlider/dresser-zoom/bcg/2560.avif?v=MjEuMDUuMjAyNA==",
    "https://assets-static-prod.displate.com/next-assets/public/images/pdp/HeroSlider/couch/bcg/2560.avif?v=MDcuMDMuMjAyNA==",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(images[0]);
  const [selectedImage, setSelectedImage] = useState(
    "https://static.displate.com/270x380/displate/2023-04-26/f0804105c7bba6f545a157e9b61ddcfc_5aaf78197b194f3cb84349524acd2d12.jpg"
  );

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setBackgroundImage(images[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setBackgroundImage(images[currentIndex - 1]);
    }
  };

  const [brightness, setBrightness] = useState(1);
  const handleBrightnessChange = (option) => {
    const newSelectedOptions = {
      ...selectedOptions,
      ["quality"]: option?.type,
    };
    setSelectedOptions(newSelectedOptions);
    setBrightness(option?.value);
  };

  const handleSelect = (button, button2) => {
    const newSelectedOptions = { ...selectedOptions, ["assembly"]: button2 };
    setSelectedOptions(newSelectedOptions);
  };

  const [form, setForm] = useState(false);

  useEffect(() => {
    getGeneralSettingFun();
    getProductDetailsFun();
    getProductReviewFun();
    getProductGuidefun()
  }, [id]);

  const getProductDetailsFun = async () => {
    setLoader((prevLoader) => ({ ...prevLoader, getProduct: true }));
    try {
      const res = await APICALL("user/getProduct", "post", { product_id: id });
      if (res?.status) {
        setProductDetails(res?.data);
        setSelectedImage(imgBaseURL() + res?.data?.image);
        setReviewVal({ ...reviewVal, artist_id: res?.data?.artist_id?._id });
      } else {
        setProductDetails(null);
      }
    } catch (error) {
      console.log(error);
      setProductDetails(null);
    } finally {
      setLoader((prevLoader) => ({ ...prevLoader, getProduct: false }));
    }
  };

  const getProductReviewFun = async () => {
    setLoader((prevLoader) => ({ ...prevLoader, reviewList: true }));
    try {
      const res = await APICALL("user/getProductReviews", "post", {
        product_id: id,
      });
      if (res?.status) {
        setReviewList(res?.data);
      } else {
        setReviewList([]);
      }
    } catch (error) {
      console.log(error);
      setReviewList([]);
    } finally {
      setLoader((prevLoader) => ({ ...prevLoader, reviewList: false }));
    }
  };
  const [selectedImages, setSelectedImages] = useState([]);

  const [reviewVal, setReviewVal] = useState({
    product_id: id,
    artist_id: productDetails?.artist_id?._id,
    star: 3,
    is_lottery: false,
    comment: "",
  });

  const submitReview = async () => {
    setLoader((prevLoader) => ({ ...prevLoader, submitReview: true }));
    const formData = new FormData();
    for (const key in reviewVal) {
      formData.append(key, reviewVal[key]);
    }

    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("images", selectedImages[i]);
    }

    try {
      const res = await APICALL("user/addReview", "post", formData);
      if (res?.status) {
        setForm(false);
        toastifySuccess(res?.message);
      } else {
        toastifyError(SOMETHING_ERR);
      }
    } catch (error) {
      toastifyError("Something wen't wrong !!");
    } finally {
      setLoader((prevLoader) => ({ ...prevLoader, submitReview: false }));
    }
  };

  const [selectedOptions, setSelectedOptions] = useState({
    frame: "No Frame",
    quality: "Matte",
    size: '13x18 cm / 5x7"',
    affiliateId: affiliateParam ? affiliateParam : "",
  });

  const qntChange = (qnt, product_id) => {
    setArtDetails({ ...artDetails, qnt: qnt });
  };

  const handleContinue = () => {
    addToCartFun(
      id,
      artDetails?.qnt,
      artDetails?.uid,
      selectedOptions,
      "addToCart"
    );
  };
  const navigate = useNavigate();

  const itemTotal = cartList.reduce((acc, item) => {
    return acc + (item?.row_uid?.price * item?.quantity || 0);
  }, 0);
  const totalPrice = parseInt(itemTotal);
  const handleBuy = () => {
    addToCartFun(
      id,
      artDetails?.qnt,
      artDetails?.uid,
      selectedOptions,
      "addToCart"
    );
    const data = {
      cartItem: cartList,
      subTotal: parseInt(itemTotal),
      totalPrice: totalPrice,
    };
    navigate(`/shipping-details`, { state: { data } });
  };

  const handleCopyArt = () => {
    const myid = encryptId(auth("admin")?.id);
    const currentURL =
      window.location.href + "?affiliate=" + encodeURIComponent(myid);
    if (!affiliateParam) {
      navigator.clipboard.writeText(currentURL).then(
        () => {
          toastifySuccess("Copied!");
        },
        (err) => {
          toastifyError("Failed to copy!");
        }
      );
    } else {
      navigator.clipboard.writeText(window.location.href).then(
        () => {
          toastifySuccess("Copied!");
        },
        (err) => {
          toastifyError("Failed to copy!");
        }
      );
    }
  };

  const habdleRedirect = () => {
    const data = {
      category: {
        name: productDetails?.category?.name,
        _id: productDetails?.category?._id,
      },
    };
    navigate(`/product-list`, { state: { data: data } });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleDeleteImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };
  const [show, setShow] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const handleShow = (imageSrc) => {
    setCurrentImage(imageSrc);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setCurrentImage("");
  };

  useEffect(() => {
    GET_UID_AND_GELETO_PRICE_BY_PRODUCT_TYPE();
  }, [selectedOptions]);

  const GET_UID_AND_GELETO_PRICE_BY_PRODUCT_TYPE = async () => {
    try {
      const res = await APICALL(
        "user/getGelatoUidByParams",
        "post",
        selectedOptions
      );
      if (res?.status) {
        const price = parseInt(res?.data?.price);
        setArtDetails({
          ...artDetails,
          product_price: price,
          uid: res?.data?.productUid,
          price: parseInt(res?.data?.price),
        });
      } else {
        window.location.reload();
      }
    } catch (error) {
      window.location.reload();
      console.log(error);
    }
  };
  const [productGuideActive, setProductGuideActive] = useState("")
  const [productGuideObj, setProductGuideObj] = useState(null)
  const getProductGuidefun = async () => {
    try {
      const res = await APICALL("/admin/getProductGuide", 'post', { role: "admin" })
      if (res?.status) { setProductGuideObj(res?.data) } else setProductGuideObj(null)
    } catch (error) {
      setProductGuideObj(null)
    }
  }


  console.log("productGuideObj", productGuideObj)
  console.log("productGuideActive", productGuideActive)

  return (
    <>
      <div className="product-details">
        {loader?.getProduct ? (
          <FrontLoader />
        ) : (
          <Container>
            {productDetails ? (
              <>
                <Row>
                  <Col md={12}>
                    <div className="breadcrumbs mb-3">
                      <ul className="m-0 p-0">
                        <li>
                          <Link to={"/"}>
                            Home <i className="fa-solid fa-chevron-right"></i>
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => habdleRedirect()}
                            className="global_light_btn"
                            style={{ color: "#8b96a5" }}
                          >
                            {productDetails?.category?.name}{" "}
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </li>
                        <li>
                          <Link
                            to={`/collection/${productDetails?.artist_id?.userName}`}
                          >
                            {" "}
                            {productDetails?.artist_id?.userName}{" "}
                            <i className="fa-solid fa-chevron-right"></i>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`/collection/${productDetails?.artist_id?.userName}/${createSlug(productDetails?.directoryId?.name)}`}
                          >
                            {" "}
                            {productDetails?.directoryId?.name}{" "}
                            <i className="fa-solid fa-chevron-right"></i>
                          </Link>
                        </li>

                        <li>
                          <Link> {productDetails?.title}</Link>
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col lg={7}>
                    <div className="">
                      <div className="main_product_slide">
                        <div className="carousel-container">
                          <ImageCarousel
                            images={images}
                            currentIndex={currentIndex}
                            onSelectBackground={handleBackgroundSelect}
                            productImg={productDetails?.thumbnail}
                          //   onNext={handleNext}
                          //   onPrev={handlePrev}
                          />
                        </div>

                        <div
                          className="product_wishlist"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            addRemoveWishList(
                              productDetails?._id,
                              getProductDetailsFun,
                              true
                            );
                          }}
                        >
                          <WishlistIcon item={productDetails} />
                        </div>
                        <div
                          className="wall"
                          style={{ backgroundImage: `url(${backgroundImage})` }}
                        >
                          <CanvasComponent
                            imageSrc={selectedImage}
                            frameTexture={frameTexture}
                            imgSize={imgSize}
                            brightness={brightness}
                          />
                        </div>
                      </div>
                      <div className="cs_prev_nextbtn mt-2">
                        <button
                          onClick={handlePrev}
                          disabled={currentIndex === 0}
                        >
                          <i className="fa-solid fa-angle-left"></i>
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={currentIndex === images.length - 1}
                        >
                          <i className="fa-solid fa-angle-right"></i>
                        </button>
                      </div>
                    </div>
                  </Col>

                  <Col lg={5}>
                    <div className="product_desxription">
                      <div className="d-flex justify-content-between align-items-center">
                        <h1>{productDetails?.title}</h1>
                        {auth("admin")?.user_role === "affiliate" && (
                          <button
                            className="copy_icon"
                            type="button"
                            onClick={handleCopyArt}
                          >
                            {" "}
                            <i className="fa fa-clone"></i> Copy
                          </button>
                        )}
                      </div>
                      <div className="product_rating d-flex align-items-center">
                        <Stack spacing={1}>
                          <Rating
                            name="half-rating-read"
                            defaultValue={productDetails?.averageRating}
                            precision={0.5}
                            readOnly
                          />
                        </Stack>
                        <span>({reviewList?.length})</span>
                      </div>

                      <Link to={`/collection/${productDetails?.artist_id?.userName}`}>
                        <div className="artist_name mt-2 mb-2">
                          {
                            getTierImg(productDetails?.artist_id?.currentRank)
                              ?.icon
                          }
                          <p className="m-0">
                            {productDetails?.artist_id?.userName}
                          </p>
                        </div>
                      </Link>
                      <div className="mb-4">
                        <p className="typehed mb-1">
                          Product type{" "}
                          <div class="icon-container">
                            <i class="fa-solid fa-circle-info"></i>
                            <span class="text" onClick={() => { setOffcanvasModel(true); setProductGuideActive("productType") }}>Learn More</span>
                          </div>
                        </p>
                        <div className="add_frame">
                          <GlossEffect onBrightnessChange={handleBrightnessChange} />
                        </div>
                      </div>

                      <div>
                        <p className="typehed mb-1">Add frame{" "}
                          <div class="icon-container">
                            <i class="fa-solid fa-circle-info"></i>
                            <span class="text" onClick={() => { setOffcanvasModel(true); setProductGuideActive("frame") }}>Learn More</span>
                          </div>
                        </p>
                        <div className="add_frame">
                          <TexturePicker
                            onTextureSelect={handleTextureSelect}
                          />
                        </div>
                      </div>

                      <p className="typehed mb-2 mt-4">Choose Size{" "}

                        <div class="icon-container">
                          <i class="fa-solid fa-circle-info"></i>
                          <span class="text" onClick={() => { setOffcanvasModel(true); setProductGuideActive("size") }}>Learn More</span>
                        </div>
                      </p>
                      <div className="add_frame">
                        <div className="add_frame">
                          {btnArr.map((item, i) => (
                            <button key={i} type="button"
                              className={
                                imgSize.transform == item.transform
                                  ? "active"
                                  : ""
                              }
                              onClick={() => handleSizeSelect(item)}
                            > {item.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {selectedOptions.frame === "With Frame" && (
                        <>
                          <p className="typehed mb-0 mt-3">Assembly</p>
                          <div className="add_frame">
                            <SelectableButtons onSelect={handleSelect} />
                          </div>
                        </>
                      )}

                      <div className="price_and_buy_box mt-4">
                        <p>USD(incl. of all taxes)</p>
                        <h2>
                          ${artDetails?.product_price}{" "}
                          <span style={{ fontSize: "18px" }}>per item</span>
                        </h2>

                        <div
                          className="main_purchase d-flex align-items-center mt-3"
                          style={{ gap: "20px" }}
                        >
                          <QuantitySelector
                            onQuantityChange={qntChange}
                            product_id={id}
                          />

                          <div className="op_btn_product">
                            <button
                              className="global_btn"
                              type="button"
                              onClick={() => handleBuy()}
                            >
                              Buy Now
                            </button>
                            {contextLoader.addToCart[id] ? (
                              <BTNLoader className="global_btnglobal_white" />
                            ) : (
                              <button
                                className="global_btnglobal_white"
                                onClick={() => handleContinue()}
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="product_add_details">
                  <Row>
                    <Col md={6} className="mb-md-0 mb-3">
                      <div className="product_globel gloab_card product_add_box">
                        <h3 className="mb-4">Description</h3>
                        <ul className="p-0">
                          <li>
                            <span className="d-block">
                              {productDetails?.description}
                            </span>
                          </li>
                        </ul>
                        <ul className="product_artist_details p-0">
                          <li>
                            Artist
                            <span className="d-block">
                              {" "}
                              {productDetails?.artist_id?.userName}{" "}
                            </span>
                          </li>
                          <li>
                            Collection
                            <span className="d-block">
                              {productDetails?.directoryId?.name}
                            </span>
                          </li>
                          <li>
                            Category
                            <span className="d-block">
                              {productDetails?.category?.name}
                            </span>
                          </li>
                          <li>
                            Sub Category
                            <span className="d-block">
                              {productDetails?.subcategory?.name}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </Col>
                    <Col md={6} className="mb-md-0 mb-3">
                      <div className="product_globel gloab_card product_add_box">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          {" "}
                          <h3 className="mb-0">Review</h3>
                          {auth("customer") && productDetails?.allowReview && (
                            <button
                              className="normal_btn"
                              onClick={() => setForm(!form)}
                            >
                              {form ? (
                                "Cancel"
                              ) : (
                                <>
                                  {" "}
                                  <i className="fa-solid fa-pen me-1"></i> Add
                                  Review
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {form ? (
                          <div className="add_your_reviews">
                            <p className="mb-3">Add Your Reviews</p>

                            {/* <img style={{ width:'150px'}} className="" src={revimg} alt="review-img" /> */}

                            <div>
                              {" "}
                              <Rating
                                name="size-large"
                                defaultValue={3}
                                size="large"
                                onChange={(e) =>
                                  setReviewVal({
                                    ...reviewVal,
                                    star: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="mb-3 col-sm-12">
                              <label className="form-label d-block text-start"></label>
                              <div className="outuploadimg justify-content-center">
                                <div className="uploadimg-vdieoouter">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                  />
                                  <i className="fa-regular fa-image"></i>
                                </div>
                                {selectedImages.map((image, index) => (
                                  <div className="lis-timg-upload" key={index}>
                                    <img
                                      src={URL.createObjectURL(image)}
                                      alt={`Uploaded ${index + 1}`}
                                    />
                                    <i
                                      className="fa fa-trash"
                                      onClick={() => handleDeleteImage(index)}
                                    ></i>
                                  </div>
                                ))}
                              </div>

                              <p className="mt-2">Upload Image</p>
                            </div>

                            <div className="cutoms-login-artist text-end">
                              <Form>
                                <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlTextarea1"
                                >
                                  <Form.Control
                                    as="textarea"
                                    placeholder="Add Some Text Here"
                                    rows={3}
                                    onChange={(e) =>
                                      setReviewVal({
                                        ...reviewVal,
                                        comment: e.target.value,
                                      })
                                    }
                                    maxLength={150}
                                  />
                                </Form.Group>
                                <Form.Check
                                  style={{ gap: "10px" }}
                                  className="d-flex text-start mb-3"
                                  type="checkbox"
                                  label=" Join the lottery for a chance to win an offer coupon."
                                  onChange={(e) =>
                                    setReviewVal({
                                      ...reviewVal,
                                      is_lottery: e.target.checked,
                                    })
                                  }
                                />
                              </Form>
                              {loader?.submitReview ? (
                                <BTNLoader className={"global_btn w-100"} />
                              ) : (
                                <button
                                  className="global_btn w-100"
                                  onClick={() => submitReview()}
                                >
                                  Submit
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="main_rev">
                            {reviewList?.length > 0 ? (
                              reviewList?.slice(0, 3)?.map((item, i) => (
                                <div className="review_box mb-3">
                                  <div className="main_top_rating">
                                    <div className="review_person_etaiuls d-flex">
                                      <div className="review_person_img">
                                        <div
                                          className="first_letter"
                                        // style={{ backgroundColor: getRandomColor()}}
                                        >
                                          {item?.user_id?.first_name.charAt(0)}
                                        </div>
                                      </div>
                                      <div>
                                        <h5 className="text-capitalize">
                                          {item?.user_id?.first_name +
                                            " " +
                                            item?.user_id?.last_name}
                                        </h5>
                                        <p>{timeAgo(item?.createdAt)}</p>
                                      </div>
                                    </div>

                                    <div className="rating_count">
                                      <i className="fa-solid fa-star"></i>{" "}
                                      <span>
                                        <b>{item?.star}</b>
                                      </span>
                                    </div>
                                  </div>
                                  <p> {item?.comment}</p>
                                  <div className="d-inline-block upload_rev_image mt-3">
                                    {item?.images?.length > 0 &&
                                      item?.images?.map((img, i) => (
                                        <img
                                          src={imgBaseURL() + img}
                                          alt="review_image"
                                          style={{
                                            width: "70px",
                                            height: "70px",
                                            objectFit: "contain",
                                            border: "1px solid #c4c4c4",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            handleShow(imgBaseURL() + img)
                                          }
                                        />
                                      ))}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <>
                                <div className="text-center">
                                  <img
                                    style={{ width: "340px" }}
                                    className=""
                                    src={noreview}
                                    alt=""
                                  />
                                  <h6>
                                    There are no reviews for this product yet.
                                  </h6>
                                </div>
                              </>
                            )}
                            {reviewList?.length > 3 && (
                              <div className="text-end">
                                <button
                                  className="global_light_btn"
                                  onClick={() => setReviewModal(!reviewModal)}
                                >
                                  Read all
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Artworks
                    title={"Related Art"}
                    type={"related_art"}
                    category_id={productDetails?.category?._id}
                  />

                  <Newsletter />
                </div>
              </>
            ) : (
              <>
                <div className="text-center mt-5">
                  <div>
                    <img
                      src={noDataImg}
                      alt="noDataImg"
                      style={{ width: "40%" }}
                    />
                  </div>
                  <h3>Invalid URL</h3>
                  <Link to={"/product-list"}>Go to the Home Page</Link>
                </div>
              </>
            )}
          </Container>
        )}
      </div>


      <Offcanvas show={offcanvasModel} onHide={() => setOffcanvasModel(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="product_finish">
            <i class="fa-solid fa-circle-info"></i>{" "}
            {
              productGuideActive === "productType" ?
                "Three different finishes and styles"
                :
                productGuideActive === "frame" ?
                  "Frames"
                  :
                  productGuideActive === "size" ?
                    "Sizes"
                    :
                    <></>
            }
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="product_finish_cnt">

            {productGuideActive === "size" &&
              productGuideObj?.size?.map((item, i) => (
                <div className="video_box" style={{ position: "relative", width: "500px", maxWidth: "100%" }}>
                  <p><strong>{item?.name}</strong></p>
                  <img src={imgBaseURL() + item?.image1} alt="" style={{ width: "100%" }} />
                </div>
              ))
            }

            {productGuideActive === "frame" &&
              productGuideObj?.frame?.map((item, i) => (
                <div className="video_box" style={{ position: "relative", width: "500px", maxWidth: "100%" }}>
                  {item?.image1 && (
                    item.image1.endsWith(".mp4") || item.image1.endsWith(".webm") || item.image1.endsWith(".ogg") ? (
                      <video
                        src={imgBaseURL() + item.image1}
                        controls
                        style={{ width: "100%" }}
                        alt="Video Preview"
                      />
                    ) : (
                      <img src={imgBaseURL() + item.image1} alt="Image Preview" style={{ width: "100%" }} />
                    )
                  )}

                  <HTMLContent data={item?.editorContent1} />
                </div>
              ))
            }

            {productGuideActive === "productType" &&
              productGuideObj?.productType?.map((item, i) => (
                <div className="video_box" style={{ position: "relative", width: "500px", maxWidth: "100%" }}>
                <p><strong>{item?.name}</strong></p>
                  {item?.image1 && (
                    item.image1.endsWith(".mp4") || item.image1.endsWith(".webm") || item.image1.endsWith(".ogg") ? (
                      <video
                        src={imgBaseURL() + item.image1}
                        controls
                        style={{ width: "100%" }}
                        alt="Video Preview"
                      />
                    ) : (
                      <img src={imgBaseURL() + item.image1} alt="Image Preview" style={{ width: "100%" }} />
                    )
                  )}
                  <HTMLContent data={item?.editorContent1} />
                </div>
              ))
            }

            {/* <div className="video_box" style={{ position: "relative", width: "500px", maxWidth: "100%" }}>
              <p><strong>Textra</strong></p>
              <video ref={videoRefs[0]} width="100%" poster="https://i.imgur.com/1ztO5uE.png">
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <button
                onClick={() => handlePlayPause(0)}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(0,0,0,0.7)",
                  border: "none",
                  padding: "15px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  color: "white",
                  fontSize: "20px",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <i className={isPlaying[0] ? "fas fa-pause" : "fas fa-play"}></i>
              </button>
            </div>
            <p><strong>Textured finish that pops</strong></p>
            <p>
              Using selective matt & gloss finish and 3D-enhanced print, Textra lets you feel the details and outlines as they seamlessly pop up on the metal surface.
              This tactile finish evolves with different light conditions, creating a whole new, dynamic and immersive art experience. Find your Textra
            </p> */}

          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal
        show={reviewModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modal-all"
        onHide={() => setReviewModal(!reviewModal)}
      >
        <Modal.Header closeButton>
          <Modal.Title>All reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {reviewList?.map((item, i) => (
              <div className="review_box mb-3">
                <div className="main_top_rating">
                  <div className="review_person_etaiuls d-flex">
                    <div className="review_person_img">
                      <div className="first_letter">
                        {item?.user_id?.first_name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-capitalize">
                        {item?.user_id?.first_name +
                          " " +
                          item?.user_id?.last_name}
                      </h5>
                      <p>{timeAgo(item?.createdAt)}</p>
                    </div>
                  </div>

                  <div className="rating_count">
                    <i className="fa-solid fa-star"></i>{" "}
                    <span>
                      <b>{item?.star}</b>
                    </span>
                  </div>
                </div>
                <p> “{item?.comment}</p>
                <div className="d-inline-block upload_rev_image mt-3">
                  {item?.images?.length > 0 &&
                    item?.images?.map((img, i) => (
                      <img
                        src={imgBaseURL() + img}
                        alt="review_image"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "contain",
                          border: "1px solid #c4c4c4",
                          cursor: "pointer",
                        }}
                        onClick={() => handleShow(imgBaseURL() + img)}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="modal-all p-0 image_preview"
        show={show}
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={currentImage}
            alt="Full-size review"
            style={{ width: "100%" }}
          />{" "}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductDetail;
