import React, { useEffect, useState } from "react";
import { Col, Row, Form, Container, Modal, Button } from "react-bootstrap";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import tiericon from "../../assets/images/4 - Diamond.png";
import noreview from '../../assets/images/no-review.gif'
import Artworks from "../../components/Artworks";
import Newsletter from "../../components/Newsletter";
import CanvasComponent from "../../components/CanvasComponent ";
import TexturePicker from "../../components/TexturePicker";
import ImageCarousel from "../../components/ImageCarousel";
import QuantitySelector from "../../components/QuantitySelector ";
import GlossEffect from "../../components/GlossEffect";
import SelectableButtons from "../../components/SelectableButtons";
import revimg from "../../assets/images/feedback.gif";
import { APICALL } from "../../helper/api/api";
import { useLocation, useNavigate, useParams } from "react-router";
import FrontLoader from "../../components/FrontLoader";
import { auth, decryptId, encryptId, getTierImg, imgBaseURL, timeAgo, toastifyError, toastifySuccess } from "../../helper/Utility";
import BTNLoader from "../../components/BTNLoader";
import { SOMETHING_ERR } from "../../helper/Constant";
import { useFrontDataContext } from "../../helper/context/FrontContextProvider";
import { Link } from "react-router-dom";
const ProductDetail = () => {
  const { getGeneralSettingFun, generalSetting, addToCartFun, contextLoader, cartList, getGelatoPriceArrayFun, gelatoPriceArr } = useFrontDataContext();

  const { id } = useParams()
  const searchParams = new URLSearchParams(window.location.search);
  const affiliateParam = searchParams.get('affiliate');
  // const affiliateID = affiliateParam ? decryptId(affiliateParam) : ""

  const [productDetails, setProductDetails] = useState(null)
  const [reviewList, setReviewList] = useState([])
  const [reviewModal, setReviewModal] = useState(false)
  const [artDetails, setArtDetails] = useState({
    price: 0,
    product_price: 0,
    uid: null,
    comission: 0,
    qnt: 1,
  })

  const [loader, setLoader] = useState({
    'getProduct': false,
    'reviewList': false,
    'submitReview': false,
  })

  const [frameTexture, setFrameTexture] = useState(null);
  const [imgSize, setImgSize] = useState({
    height: 238,
    width: 171,
    transform: 1,
    brightness: 1,
  });

  const handleTextureSelect = (texture) => {
    const newSelectedOptions = { ...selectedOptions, ['frame']: texture?.frame, ['frameType']: texture.color, ['assembly']: 'Ready-to-hang' };
    setSelectedOptions(newSelectedOptions)
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
    const newSelectedOptions = { ...selectedOptions, ['size']: item?.name };
    setSelectedOptions(newSelectedOptions)
    setImgSize({
      height: item.height,
      width: item.width,
      transform: item.transform,
      brightness: item.brightness
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

  const [brightness, setBrightness] = useState(1)
  const handleBrightnessChange = (option) => {
    const newSelectedOptions = { ...selectedOptions, ['quality']: option?.type };
    setSelectedOptions(newSelectedOptions)
    setBrightness(option?.value)
  };

  const handleSelect = (button, button2) => {
    const newSelectedOptions = { ...selectedOptions, ['assembly']: button2 };
    setSelectedOptions(newSelectedOptions)
  };

  const [form, setForm] = useState(false);

  useEffect(() => {
    getGelatoPriceArrayFun()
    getGeneralSettingFun()
    getProductDetailsFun()
    getProductReviewFun()
  }, [id])

  const getProductDetailsFun = async () => {
    setLoader(prevLoader => ({ ...prevLoader, getProduct: true }));
    try {
      const res = await APICALL('user/getProduct', 'post', { product_id: id })
      if (res?.status) {
        setProductDetails(res?.data)
        setSelectedImage(imgBaseURL() + res?.data?.image)
        setReviewVal({ ...reviewVal, 'artist_id': res?.data?.artist_id?._id })
      } else {
        setProductDetails(null)
      }
    } catch (error) {
      console.log(error)
      setProductDetails(null)
    } finally {
      setLoader(prevLoader => ({ ...prevLoader, getProduct: false }));
    }
  }

  const getProductReviewFun = async () => {
    setLoader(prevLoader => ({ ...prevLoader, reviewList: true }));
    try {
      const res = await APICALL('user/getProductReviews', 'post', { product_id: id })

      if (res?.status) {
        setReviewList(res?.data)
      } else {
        setReviewList([])
      }
    } catch (error) {
      console.log(error)
      setReviewList([])
    } finally {
      setLoader(prevLoader => ({ ...prevLoader, reviewList: false }));
    }
  }
  const [selectedImages, setSelectedImages] = useState([]);

  const [reviewVal, setReviewVal] = useState({
    "product_id": id,
    "artist_id": productDetails?.artist_id?._id,
    "star": 3,
    "is_lottery": false,
    "comment": ""
  })

  console.log("selectedImages", selectedImages)

  const submitReview = async () => {
    setLoader(prevLoader => ({ ...prevLoader, submitReview: true }));
    const formData = new FormData();
    for (const key in reviewVal) {
      formData.append(key, reviewVal[key]);
    }

    // if (selectedImages?.length > 0) {
    //   selectedImages.forEach((image, index) => {
    //     formData.append(`images[${index}]`, image);
    //   });
    // }

    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("images", selectedImages[i]);
    }

    try {
      const res = await APICALL('user/addReview', 'post', formData)
      if (res?.status) {
        setForm(false)
        toastifySuccess(res?.message)
      } else {
        toastifyError(SOMETHING_ERR)
      }
    } catch (error) {
      toastifyError("Something wen't wrong !!")
    } finally {
      setLoader(prevLoader => ({ ...prevLoader, submitReview: false }));
    }
  }


  const [sizeMap, setSizeMap] = useState({
    '13x18 cm / 5x7"': '130x180-mm-5x7-inch',
    '30x40 cm / 12x16"': '300x400-mm-12x16-inch',
    '50x70 cm / 20x28"': '500x700-mm-20x28-inch'
  })

  const plexiSizeMap = {
    '13x18 cm / 5x7"': '130x180-mm-5r',
    '30x40 cm / 12x16"': '300x400-mm-12x16-inch',
    '50x70 cm / 20x28"': '500x700-mm-20x28-inch'
  };

  const qualityMap = {
    'Museum-Quality Matte': '250-gsm-100lb-uncoated-offwhite-archival',
    'Premium Matte': '200-gsm-80lb-uncoated',
    'Premium Semi-Glossy': '200-gsm-80lb-coated-silk'
  };

  const frameMap = {
    'Black': 'black',
    'White': 'white',
    'Wood': 'natural-wood'
  };

  const assemblyMap = {
    'Ready-to-hang': 'mounted',
    'Not assembled': ''
  };

  const baseUid = {
    'No Frame': 'flat_{size}_{quality}_4-0_ver',
    'With Frame': 'framed_poster_{assembly}_{size}_{frame}_wood_w12xt22-mm_plexiglass_{plexiSize}_{quality}_4-0_ver'
  };

  const [selectedOptions, setSelectedOptions] = useState({
    frame: "No Frame",
    quality: "Museum-Quality Matte",
    size: '13x18 cm / 5x7"',
    affiliateId: affiliateParam ? affiliateParam : ""
  });

  const [uid, setUid] = useState('Please select all required options');

  const generateUid = (frame, quality, size, frameType, assembly) => {
    const template = baseUid[frame];
    return template
      .replace('{size}', sizeMap[size])
      .replace('{plexiSize}', plexiSizeMap[size])
      .replace('{quality}', qualityMap[quality])
      .replace('{frame}', frameMap[frameType] || '')
      .replace('{assembly}', assemblyMap[assembly] || '')
      .replace('__', '_')
      .replace(/^_|_$/g, '');
  };

  useEffect(() => {
    if (selectedOptions.quality && selectedOptions.size && selectedOptions.frame) {
      if (selectedOptions.frame === 'No Frame') {
        const newUid = generateUid(
          selectedOptions.frame,
          selectedOptions.quality,
          selectedOptions.size
        );
        setUid(newUid || 'No matching UID found');
        getPriceFun(newUid)

      } else if (selectedOptions.frameType && selectedOptions.assembly) {
        const newUid = generateUid(
          selectedOptions.frame,
          selectedOptions.quality,
          selectedOptions.size,
          selectedOptions.frameType,
          selectedOptions.assembly
        );
        setUid(newUid || 'No matching UID found');
        getPriceFun(newUid)
      } else {
        setUid('Please select all required options 1');
      }
    } else {
      setUid('Please select all required options 2');
    }
  }, [selectedOptions]);

  const sizes = Object.keys(sizeMap);
  const qualities = Object.keys(qualityMap);
  const frames = ['No Frame', 'With Frame'];
  const frameTypes = Object.keys(frameMap);
  const assemblies = Object.keys(assemblyMap);
  const uids = [];

  for (const size of sizes) {
    for (const quality of qualities) {
      for (const frame of frames) {
        if (frame === 'No Frame') {
          const uid = generateUid(frame, quality, size);
          uids.push(uid);
        } else {
          for (const frameType of frameTypes) {
            for (const assembly of assemblies) {
              const uid = generateUid(frame, quality, size, frameType, assembly);
              uids.push(uid);
            }
          }
        }
      }
    }
  }

  const getPriceFun = (uid) => {
    const res = gelatoPriceArr?.find((item) => item.productUid == uid);
    if (res) {
      const price = (parseInt(res?.price)) * artDetails?.qnt
      setArtDetails({ ...artDetails, 'product_price': price, 'uid': res?.test_id || res?.productUid, price: parseInt(res?.price) })
    }
  };


  useEffect(() => {
    if (uid || gelatoPriceArr) {
      getPriceFun(uid)
    }
  }, [uid, artDetails?.qnt, gelatoPriceArr])


  const qntChange = (qnt, product_id) => {
    setArtDetails({ ...artDetails, qnt: qnt })
  };


  const handleContinue = () => {
    if (!auth('customer')) {
      const url = `/product-details/${id}?affiliate=${affiliateParam}`
      sessionStorage.setItem('p-url', url)
      navigate('/login/customer')
    } else {
      addToCartFun(id, artDetails?.qnt, uid, selectedOptions, 'addToCart');
    }
  }
  const navigate = useNavigate()

  const itemTotal = cartList.reduce((acc, item) => {
    return acc + (item?.row_uid?.price * item?.quantity || 0);
  }, 0);
  const totalPrice = parseInt(itemTotal)
  const handleBuy = () => {
    if (auth('customer')) {
      addToCartFun(id, artDetails?.qnt, uid, selectedOptions, 'addToCart');
      const data = {
        cartItem: cartList,
        subTotal: parseInt(itemTotal),
        totalPrice: totalPrice,
      }
      navigate(`/shipping-details`, { state: { data } })
    } else {
      const url = `/product-details/${id}?affiliate=${affiliateParam}`
      sessionStorage.setItem('p-url', url)
      navigate('/login/customer')
    }
  }

  const handleCopyArt = () => {
    const myid = encryptId(auth('admin')?.id)
    const currentURL = window.location.href + "?affiliate=" + encodeURIComponent(myid);
    if (!affiliateParam) {
      navigator.clipboard.writeText(currentURL).then(
        () => {
          toastifySuccess('Copied!');
        },
        (err) => {
          toastifyError('Failed to copy!');
        }
      );
    } else {
      navigator.clipboard.writeText(window.location.href).then(
        () => {
          toastifySuccess('Copied!');
        },
        (err) => {
          toastifyError('Failed to copy!');
        }
      );
    }
  }

  const habdleRedirect = () => {
    const data = { category: { name: productDetails?.category?.name, _id: productDetails?.category?._id } };
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

  const revphoto = "https://via.placeholder.com/70"; // Your image URL or path

  console.log("reviewList", reviewList)

  return (
    <>
      <div className="product-details">
        {
          loader?.getProduct ? <FrontLoader />
            :
            <Container>

              <Row>
                <Col md={12}>
                  <div className="breadcrumbs mb-3">
                    <ul className="m-0 p-0">
                      <li>
                        <Link to={'/'}>Home <i className="fa-solid fa-chevron-right"></i></Link>
                      </li>
                      <li>
                        <button onClick={() => habdleRedirect()} className="global_light_btn" style={{ color: '#8b96a5' }}>{productDetails?.category?.name} <i className="fa-solid fa-chevron-right"></i></button>
                      </li>
                      <li>
                        <Link to={`/collection/${productDetails?.artist_id?._id}`}> {productDetails?.artist_id?.first_name + ' ' + productDetails?.artist_id?.last_name} </Link>
                      </li>
                      <li>
                        <Link to={`/product-list`}><i className="fa-solid fa-chevron-right"></i> {productDetails?.directoryId?.name}</Link>
                      </li>
                      <li>
                        <Link><i className="fa-solid fa-chevron-right"></i> {productDetails?.title}</Link>
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
                        //   onNext={handleNext}
                        //   onPrev={handlePrev}
                        />
                      </div>

                      <div className="product_wishlist">
                        <i className="fa-regular fa-heart"></i>
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
                      <button onClick={handlePrev} disabled={currentIndex === 0}>
                        <i class="fa-solid fa-angle-left"></i>
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={currentIndex === images.length - 1}
                      >
                        <i class="fa-solid fa-angle-right"></i>
                      </button>
                    </div>
                  </div>
                </Col>

                <Col lg={5}>
                  <div className="product_desxription">
                    <div className="d-flex justify-content-between align-items-center">
                      <h1>{productDetails?.title}</h1>
                      {
                        auth('admin')?.user_role === "affiliate" &&
                        <button className="copy_icon" type="button" onClick={handleCopyArt}> <i className="fa fa-clone"></i> Copy</button>
                      }
                    </div>
                    <div className="product_rating">
                      <ul>
                        <li>
                          {" "}
                          <Stack spacing={1}>
                            <Rating
                              name="half-rating-read"
                              defaultValue={productDetails?.averageRating}
                              precision={0.5}
                              readOnly
                            />
                          </Stack>
                        </li>
                        <span>({reviewList?.length})</span>
                      </ul>
                    </div>

                    <Link to={`/collection/${productDetails?.artist_id?._id}`}>
                      <div className="artist_name mt-2 mb-4">
                        <span>
                          {getTierImg(productDetails?.artist_id?.currentRank)?.icon}
                        </span>
                        <p className="m-0">{productDetails?.artist_id?.first_name + ' ' + productDetails?.artist_id?.last_name}</p>
                      </div>
                    </Link>
                    <div className="mb-4">
                      <p className="typehed mb-1">Product type</p>
                      <div className="add_frame">
                        <GlossEffect onBrightnessChange={handleBrightnessChange} />
                      </div>
                    </div>

                    <div>
                      <p className="typehed mb-1">Add frame</p>
                      <div className="add_frame">
                        <TexturePicker onTextureSelect={handleTextureSelect} />
                      </div>
                    </div>

                    <p className="typehed mb-2 mt-4">Choose Size</p>
                    <div className="add_frame">
                      <div className="add_frame">
                        {btnArr.map((item, i) => (
                          <button
                            key={i}
                            type="button"
                            className={
                              imgSize.transform == item.transform ? "active" : ""
                            }
                            onClick={() => handleSizeSelect(item)}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedOptions.frame === 'With Frame' && (
                      <>
                        <p className="typehed mb-0 mt-3">Assembly</p>
                        <div className="add_frame">
                          <SelectableButtons onSelect={handleSelect} />
                        </div>
                      </>
                    )}

                    <div className="price_and_buy_box mt-3">
                      <p>USD(incl. of all taxes)</p>
                      <h2>${artDetails?.product_price}</h2>

                      <div
                        className="main_purchase d-flex align-items-center"
                        style={{ gap: "20px" }}
                      >
                        <QuantitySelector onQuantityChange={qntChange} product_id={id} />

                        <div className="op_btn_product">
                          <button class="global_btn" type="button" onClick={() => handleBuy()}>Buy Now</button>
                          {
                            contextLoader.addToCart[id] ?
                              <BTNLoader className='global_btnglobal_white' /> :
                              <button class="global_btnglobal_white" onClick={() => handleContinue()}>Add to Cart</button>
                          }
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
                          Artist<span className="d-block"> {productDetails?.artist_id?.first_name + ' ' + productDetails?.artist_id?.last_name} </span>
                        </li>
                        <li>
                          Collection
                          <span className="d-block">{productDetails?.directoryId?.name}</span>
                        </li>
                        <li>
                          Category<span className="d-block">{productDetails?.category?.name}</span>
                        </li>
                        <li>
                          Sub Category
                          <span className="d-block">{productDetails?.subcategory?.name}</span>
                        </li>

                        <li>
                          Description
                          <span className="d-block">{productDetails?.description}</span>
                        </li>


                      </ul>
                    </div>
                  </Col>
                  <Col md={6} className="mb-md-0 mb-3">
                    <div className="product_globel gloab_card product_add_box">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        {" "}
                        <h3 className="mb-0">Review</h3>
                        {
                          (auth('customer') && productDetails?.allowReview) &&
                          <button className="normal_btn" onClick={() => setForm(!form)} >
                            {form ? ("Cancel") : (<> <i class="fa-solid fa-pen me-1"></i> Add Review</>)}
                          </button>
                        }
                      </div>

                      {form ? (
                        <div className="add_your_reviews">
                          <h4 className="mb-0">Add Your Reviews</h4>

                          <img className="" src={revimg} alt="review-img" />

                          <div>
                            {" "}
                            <Rating
                              name="size-large"
                              defaultValue={3}
                              size="large"
                              onChange={(e) => setReviewVal({ ...reviewVal, 'star': e.target.value })}
                            />
                          </div>

                          <div className="mb-3 col-sm-12">
                            <label className="form-label d-block text-start">
                              <b>Upload Image</b>
                            </label>
                            <div className="outuploadimg">
                              <div className="uploadimg-vdieoouter">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleImageChange}
                                />
                                <i className="fa fa-camera"></i>
                              </div>
                              {selectedImages.map((image, index) => (
                                <div className="lis-timg-upload" key={index}>
                                  <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Uploaded image ${index}`}
                                  />
                                  <i
                                    className="fa fa-trash"
                                    onClick={() => handleDeleteImage(index)}
                                  ></i>
                                </div>
                              ))}
                            </div>
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
                                  onChange={(e) => setReviewVal({ ...reviewVal, 'comment': e.target.value })}
                                  maxLength={150}
                                />
                              </Form.Group>
                              <Form.Check
                                type="checkbox"
                                label="Participate in lottery"
                                onChange={(e) => setReviewVal({ ...reviewVal, 'is_lottery': e.target.checked })}
                              />
                            </Form>
                            {
                              loader?.submitReview ? <BTNLoader className={'global_btn w-100'} /> :
                                <button class="global_btn w-100" onClick={() => submitReview()}>Submit</button>
                            }
                          </div>
                        </div>
                      ) : (
                        <div className="main_rev">

                          {
                            reviewList?.length > 0 ?
                              reviewList?.slice(0, 3)?.map((item, i) => (
                                <div className="review_box mb-3">
                                  <div className="main_top_rating">
                                    <div className="review_person_etaiuls d-flex">
                                      <div className="review_person_img">
                                        <h5 className="first_letter"
                                        // style={{ backgroundColor: getRandomColor()}}
                                        >{item?.user_id?.first_name.charAt(0)}</h5>
                                      </div>
                                      <div>
                                        <h5 className="text-capitalize">{item?.user_id?.first_name + ' ' + item?.user_id?.last_name}</h5>
                                        <p>{timeAgo(item?.createdAt)}</p>
                                      </div>
                                    </div>

                                    <div className="rating_count">
                                      <i class="fa-solid fa-star"></i>{" "}
                                      <span>
                                        <b>{item?.star}</b>
                                      </span>
                                    </div>
                                  </div>
                                  <p> {item?.comment}</p>
                                  <div className="d-inline-block upload_rev_image mt-3">

                                    {
                                      item?.images?.length > 0 &&
                                      item?.images?.map((img, i) => (
                                        <img
                                          src={imgBaseURL() + img}
                                          alt="review_image"
                                          style={{ width: "70px", height: "70px", objectFit: "contain", }}
                                          onClick={() => handleShow(imgBaseURL() + img)}
                                        />
                                      ))
                                    }
                                  </div>
                                </div>

                              ))
                              :
                              <>

                                <div className="text-center">
                                  <img className="w-100" src={noreview} alt="" />
                                  <h6>There are no reviews for this product yet.</h6>
                                </div>
                              </>
                          }
                          {
                            reviewList?.length > 3 &&
                            <div className="text-end">
                              <button className="global_light_btn" onClick={() => setReviewModal(!reviewModal)}>Read all</button>
                            </div>
                          }
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>

                <Artworks title={"Related Art"} type={'related_art'} category_id={productDetails?.category?._id} />

                <Newsletter />
              </div>
            </Container>
        }
      </div>

      <Modal show={reviewModal} size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered className="modal-all" onHide={() => setReviewModal(!reviewModal)}>
        <Modal.Header closeButton>
          <Modal.Title>All reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {
              reviewList?.map((item, i) => (
                <div className="review_box mb-3">
                  <div className="main_top_rating">
                    <div className="review_person_etaiuls d-flex">
                      <div className="review_person_img">
                        <h5 className="first_letter">{item?.user_id?.first_name.charAt(0)}</h5>
                      </div>
                      <div>
                        <h5 className="text-capitalize">{item?.user_id?.first_name + ' ' + item?.user_id?.last_name}</h5>
                        <p>{timeAgo(item?.createdAt)}</p>
                      </div>
                    </div>

                    <div className="rating_count">
                      <i class="fa-solid fa-star"></i>{" "}
                      <span>
                        <b>{item?.star}</b>
                      </span>
                    </div>
                  </div>
                  <p> “{item?.comment}</p>
                  <div className="d-inline-block upload_rev_image mt-3">

                    {
                      item?.images?.length > 0 &&
                      item?.images?.map((img, i) => (
                        <img
                          src={imgBaseURL() + img}
                          alt="review_image"
                          style={{ width: "70px", height: "70px", objectFit: "contain", }}
                          onClick={() => handleShow(imgBaseURL() + img)}
                        />
                      ))
                    }
                  </div>
                </div>

              ))
            }
          </div>
        </Modal.Body>
      </Modal>

      <Modal className="modal-all" show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={currentImage} alt="Full-size review" style={{ width: "100%" }} />{" "}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} > Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductDetail;