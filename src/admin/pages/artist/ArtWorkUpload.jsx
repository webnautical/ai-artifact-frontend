import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useDataContext } from "../../../helper/context/ContextProvider";
import BTNLoader from "../../../components/BTNLoader";
import { APICALL } from "../../../helper/api/api";
import axios from "axios";
import { apiBaseURL, auth, imgBaseURL } from "../../../helper/Utility";
import swal from "sweetalert";
import { SOMETHING_ERR } from "../../../helper/Constant";
import { useLocation, useNavigate } from "react-router";
import artworkthumb from '../../../assets/images/placeholder.jpg'
import { Alert, Stack } from "@mui/material";

const ArtWorkUpload = () => {
  const {
    categoryList,
    getCategoryFun,
    getSubCategoryFun,
    subCategoryList,
    // getCollectionFun,
    getDirectoryFun,
    directoryList,
    getUserByIDFun,
    userInfoByID
  } = useDataContext();
  const [loading, setLoading] = useState({ list: false, submit: false });
  const [directoryToggle, setDirectoryToggle] = useState(false);
  const locationData = useLocation();
  const artData = locationData?.state ? locationData?.state?.data : null;
  console.log("artData",artData)
  const navigate = useNavigate();
  useEffect(() => {
    getCategoryFun();
    // getCollectionFun();
    if(artData?.update_by !== "admin"){
      getDirectoryFun()
    }
  }, []);
  const initialFormData = {
    productId: "",
    image: "",
    title: "",
    description: "",
    category: "",
    subcategory: "",
    directoryId: "",
    directoryName: "",
  };
  const [imgPreview, setImgPreview] = useState({ image: "" });
  const [formData, setFormData] = useState(initialFormData);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState({
    image: [],
    title: "",
    description: "",
    category: "",
    subcategory: "",
    directoryId: "",
    directoryName: "",
  });
// console.log("artData",artData)
  useEffect(() => {
    if (artData?.title) {
      setFormData({
        ...formData,
        id: artData?.artist_id?._id,
        productId: artData?._id,
        image: artData?.image,
        title: artData?.title,
        description: artData?.description,
        category: artData?.category?._id,
        subcategory: artData?.subcategory?._id,
        directoryId: artData?.directoryId,
        directoryName: artData?.directoryName,
      });
      setImgPreview({ ...imgPreview, image: imgBaseURL() + artData?.thumbnail });
      getSubCategoryFun(artData?.category?._id);
      if(artData?.update_by === "admin"){
        getDirectoryFun(artData?.artist_id?._id)
      }
    } else {
      setFormData({
        ...formData,
        productId: "",
        image: "",
        title: "",
        description: "",
        category: "",
        subcategory: "",
        directoryId: "",
        directoryName: "",
      });
      setImgPreview({ ...imgPreview, image: "" });
    }
  }, [artData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeMB = 30;
    const errorMessages = [];

    if (file.size > maxSizeMB * 1024 * 1024) {
      errorMessages.push("Image size must be less than 30MB!");
    }

    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      errorMessages.push("Image must be in JPG, JPEG, or PNG format!");
    }

    if (errorMessages.length > 0) {
      setError((prevData) => ({ ...prevData, image: errorMessages }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = async () => {
        const width = img.width;
        const height = img.height;
        const aspectRatio = width / height;

        if (Math.min(width, height) < 2900) {
          setError((prevData) => ({
            ...prevData,
            image: ["The shortest side must be at least 2900px!"],
          }));
          return;
        }
        const expectedRatio = 5 / 7;
        if (Math.abs(aspectRatio - expectedRatio) > 0.01) {
          setError((prevData) => ({
            ...prevData,
            image: ["Image aspect ratio must be 5:7!"],
          }));
          return;
        }

        const params = new FormData();
        params.append("image", file);
        try {
          const res = await axios.post(
            `${apiBaseURL()}/artist/addImage`,
            params,
            {
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percentCompleted);
              },
            }
          );
          setError((prevData) => ({ ...prevData, image: [] }));
          setFormData((prevData) => ({ ...prevData, image: file }));
          setImgPreview({ ...imgPreview, image: e.target.result });
          setUploadProgress(0);

        } catch (error) {
          setUploadProgress(0);
          const serverErrorMessages = [];
          if (error?.response?.data?.data.watermark) {
            serverErrorMessages.push("Image contains a watermark.");
          }
          if (error?.response?.data?.data.logo) {
            serverErrorMessages.push("Image contains a logo.");
          }
          if (error?.response?.data?.data.borders) {
            serverErrorMessages.push("Image has borders.");
          }
          if (error?.response?.data?.data.text_too_close_to_edge) {
            serverErrorMessages.push(
              "Text is too close to the edge of the image."
            );
          }
          setError((prevData) => ({ ...prevData, image: serverErrorMessages }));
        }
      };

      img.onerror = () => {
        setError((prevData) => ({
          ...prevData,
          image: ["Invalid image file!"],
        }));
      };
    };

    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    if (e.target.name === "category") {
      getSubCategoryFun(e.target.value);
      setFormData((prevData) => ({
        ...prevData,
        ["category"]: e.target.value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const addDirectory = () => {
    setDirectoryToggle(!directoryToggle);
    if (directoryToggle) {
      setFormData((prevData) => ({
        ...prevData,
        ["directoryName"]: "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        ["directoryId"]: "",
      }));
    }
  };

  const [addUpdateApiCallCount, setAddUpdateApiCallCount] = useState(0);
  const validateFun = () => {
    setAddUpdateApiCallCount(addUpdateApiCallCount + 1);
    const { image, title, category, subcategory } = formData;

    if (image.length == 0) {
      setError((prevValues) => {
        return { ...prevValues, image: ["Required *"] };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ["image"]: true };
      });
    }

    if (title.trim() == "") {
      setError((prevValues) => {
        return { ...prevValues, ["title"]: "Required *" };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ["title"]: true };
      });
    }

    if (category.trim() == "") {
      setError((prevValues) => {
        return { ...prevValues, ["category"]: "Required *" };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ["category"]: true };
      });
    }

    if (subcategory.trim() == "") {
      setError((prevValues) => {
        return { ...prevValues, ["subcategory"]: "Required *" };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ["subcategory"]: true };
      });
    }
  };

  const { title, category, subcategory, image } = error;
  useEffect(() => {
    if (
      (image === true,
        title === true,
        category === true,
        subcategory === true
      )
    ) {
      handleSubmit();
    }
  }, [
    addUpdateApiCallCount,
    title,
    category,
    subcategory,
    image,
  ]);

  const handleSubmit = async () => {
    setLoading({ ...loading, submit: true });
    try {
      const params = new FormData();
      formData?.productId && params.append("productId", formData.productId);
      params.append("image", formData.image);
      params.append("id", formData.id);
      params.append("update_by", artData?.update_by ?? "");
      params.append("title", formData.title);
      params.append("description", formData.description);
      params.append("category", formData.category);
      params.append("subcategory", formData.subcategory);
      params.append("directoryId", formData.directoryId);
      params.append("directoryName", formData.directoryName);
      const apiEnd = formData?.productId ? "updateProduct" : "addProduct";
      const msg = formData?.productId ? "Updated" : "Uploaded";

      const res = await APICALL(`/artist/${apiEnd}`, "post", params);

      if (res?.status) {
        swal({
          title: `Your Art ${msg} Successfully !!`,
          icon: "success",
          button: { text: "OK", className: "swal_btn_ok" },
        });
        setFormData(initialFormData);
        setUploadProgress(0);
        setImgPreview({ ...imgPreview, image: "" });
        setLoading({ ...loading, submit: false });
        const params = {
          name: res?.data?.directoryId?.name,
          _id: res?.data?.directoryId?._id
        }
        getUserByIDFun(auth('admin')?.id)
        if(artData?.update_by === "admin"){
          navigate(`/${auth('admin')?.user_role}/products`);
        }else{
          navigate(`/${auth('admin')?.user_role}/artworks/pending`);
        }
      } else {
        swal({
          title: SOMETHING_ERR,
          icon: "error",
          button: { text: "OK", className: "swal_btn_ok" },
        });
        setLoading({ ...loading, submit: false });
      }
    } catch (error) {
      swal({
        title: error?.response?.data?.message,
        icon: "error",
        button: { text: "OK", className: "swal_btn_ok" },
      });
      setLoading({ ...loading, submit: false });
    }
  };

  useEffect(() => {
    getUserByIDFun(auth('admin')?.id)
  }, [])


  return (
    <>
      <Paper className="table_samepattern">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          <h1 className="title-admins-table">Upload Art Work</h1>
        </div>
        {
          userInfoByID?.totalArtworks >= userInfoByID?.highestRank?.maxUploads &&
          <div className="px-3">
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert variant="filled" severity="error">
                {`You have  reached your upload limit for the ${userInfoByID?.highestRank?.name}. You’ve already uploaded the maximum of ${userInfoByID?.highestRank?.maxUploads} artworks allowed for this tier.`}
              </Alert>
            </Stack>
          </div>
        }

        <Row className="p-4 justify-content-center align-items-center ">
          <Col md={4}>
            <div className="thumbartwork text-center mb-4">
              {imgPreview.image ? (
                <img
                  src={imgPreview.image}
                  style={{ height: "208px", width: "240px" }}
                  alt="alt"
                />
              ) :

                <img src={artworkthumb} alt="" />
              }
            </div>
            <div class="file-uploader">
              <label for="logoID" class="global_file_upload_deisgn">
                <i class="fa-solid fa-arrow-up-from-bracket"></i>  Upload Artwork Here
                <input
                  type="file"
                  id="logoID"
                  name="image"
                  value={formData.name}
                  onChange={handleImageChange}
                />
              </label>
            </div>
            {error?.image?.length > 0 && (
              <ul className="error">
                {error?.image?.map((errMsg, index) => (
                  <li key={index}>{errMsg}</li>
                ))}
              </ul>
            )}
            {uploadProgress > 0 && (
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {uploadProgress}%
                </div>
              </div>
            )}


          </Col>

          <Col md={6}>
            <div className="images_type_req">
              <ul className="mt-3">
                <li><i class="fa-solid fa-circle-dot"></i> Only high print quality uploads are published</li>
                <li>
                  <i class="fa-solid fa-circle-dot"></i> Minimum 300 DPI in RGB mode. JPG size up to 30MB (this must be
                  scanned automatically).
                </li>
                <li>
                  <i class="fa-solid fa-circle-dot"></i> The shortest side at least 2900px (this must be scanned
                  automatically).
                </li>
                <li>
                  <i class="fa-solid fa-circle-dot"></i> 5:7 ratio for the best product fit (ex. 2900px x 4060px) (this
                  must be scanned automatically).
                </li>
                <li><i class="fa-solid fa-circle-dot"></i> No logos, no watermarks, no borders</li>
                <li>
                  <i class="fa-solid fa-circle-dot"></i> Text/content shall be from the edge at least 200px for the
                  file with min. size 4060px x 2900px
                </li>
                <li>
                  <i class="fa-solid fa-circle-dot"></i> The whole content of the design must be included in one
                  uploaded file
                </li>
              </ul>
            </div>
          </Col>
        </Row>

        <Row className="p-4 cutoms-login-artist">
          <Col md={8}>
            <Form.Group className="mb-3" controlId="formmainTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              <span className="errmsg">{error.title}</span>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Label>Category</Form.Label>
            <Form.Select
              aria-label="Default select example"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="1">Select Category</option>
              {categoryList?.map((item, i) => (
                <option value={item._id}>{item?.name}</option>
              ))}
            </Form.Select>
            <span className="errmsg">{error.category}</span>
          </Col>

          <Col md={4}>
            <Form.Label>Sub Category</Form.Label>
            <Form.Select
              aria-label="Default select example"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
            >
              <option value="1">Select Sub Category</option>
              {subCategoryList?.map((item, i) => (
                <option value={item._id}>{item?.name}</option>
              ))}
            </Form.Select>
            <span className="errmsg">{error.subcategory}</span>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3" controlId="formmainTitle">
              <Form.Label>Collection</Form.Label>
              <div className="togg_btn">
                {directoryToggle ? (
                  <Form.Control
                    type="text"
                    name="directoryName"
                    value={formData.directoryName}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Select
                    aria-label="Default select example"
                    name="directoryId"
                    value={formData.directoryId}
                    onChange={handleChange}
                  >
                    <option value="1">Select Directory</option>
                    {directoryList?.map((item, i) => (
                      <option value={item._id}>{item?.name}</option>
                    ))}
                  </Form.Select>
                )}
                <button className="togg_fucn" onClick={() => addDirectory()}>
                  {directoryToggle ? (
                    <>Cancel</>
                  ) : (
                    <>Add New</>
                  )}
                </button>
              </div>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group
              className="mb-2 mt-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={1000}
              />
            </Form.Group>
            {/* <span className="errmsg">{error.description}</span> */}
            <div className="text-count mt-1 text-end">
              <p>{formData.description.length}/1000 characters</p>
            </div>
          </Col>
          {
            userInfoByID?.totalArtworks >= userInfoByID?.highestRank?.maxUploads ?
              <Col md={12} className="text-end">
                <Button className="artist-btn" variant="primary" style={{cursor: "not-allowed"}}>
                  {formData?.productId ? "Update Product" : "Upload"}{" "}
                </Button>
              </Col>
              :
              <Col md={12} className="text-end">
                {loading.submit ? (
                  <BTNLoader className={"artist-btn"} />
                ) : (
                  <Button  className="artist-btn"  variant="primary" onClick={() => validateFun()}>
                    {formData?.productId ? "Update Product" : "Upload"}{" "}
                  </Button>
                )}
              </Col>
          }

        </Row>
      </Paper>
    </>
  );
};

export default ArtWorkUpload;
