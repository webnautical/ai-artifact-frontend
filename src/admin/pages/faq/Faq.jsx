import React, { useEffect, useRef, useState } from "react";
import {
  Row,
  Button,
  CardHeader,
  CardFooter,
  Card,
  CardBody,
  Col,
  Form,
} from "react-bootstrap";
import { APICALL } from "../../../helper/api/api";
import BTNLoader from "../../../components/BTNLoader";
import AdminLoader from "../../components/AdminLoader";
import swal from "sweetalert";
import { PlusCircleOutlined } from "@ant-design/icons";

const Faq = () => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [faqList, setFaqList] = useState([]);
  const bottomRef = useRef(null);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  useEffect(() => {
    getFaqFun();
  }, []);

  const getFaqFun = async () => {
    setLoading(true);
    try {
      const res = await APICALL("admin/allFaqs", "post", {
        popular_question: false,
      });
      if (res?.status) {
        setFaqList(res?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index, faqIndex) => {
    const { name, value } = e.target;
    const updatedFaqList = [...faqList];
    if (faqIndex !== undefined) {
      updatedFaqList[index].faqs[faqIndex][name] = value;
    } else {
      updatedFaqList[index][name] = value;
    }
    setFaqList(updatedFaqList);
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const res = await APICALL("admin/createFaqs", "post", {
        categorisedFaq: faqList,
      });
      if (res?.status) {
        getFaqFun();
        swal({
          title: "Faq Updated Successfully !!",
          icon: "success",
          button: { text: "OK", className: "swal_btn_ok" },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddCategory = () => {
    const newCategory = {
      category_name: "",
      faqs: [{ question: "", answer: "" }],
    };
    setFaqList([...faqList, newCategory]);
    setScrollToBottom(true);
  };

  const handleAddFaq = (index) => {
    const updatedFaqList = [...faqList];
    updatedFaqList[index].faqs.push({ question: "", answer: "" });
    setFaqList(updatedFaqList);
  };

  const handleRemoveFaq = (index, faqIndex) => {
    const updatedFaqList = [...faqList];
    updatedFaqList[index].faqs.splice(faqIndex, 1);
    setFaqList(updatedFaqList);
  };

  const handleRemoveCategory = (index) => {
    const updatedFaqList = [...faqList];
    updatedFaqList.splice(index, 1);
    setFaqList(updatedFaqList);
  };

  useEffect(() => {
    if (scrollToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setScrollToBottom(false);
    }
  }, [faqList, scrollToBottom]);

  return (
    <Card className="card-custom">
      {loading ? (
        <AdminLoader />
      ) : (
        <>
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h4>Faq</h4>
              <Button
                className="artist-btn"
                type="button"
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {faqList?.map((item, index) => (
              <div className="car-faq" key={index}>
                <Row className="mb-md-3 mb-2">
                  <Col md={12}>
                    <Form.Group
                      className="mb-2"
                      controlId={`formCategoryName-${index}`}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Form.Label>Category Name</Form.Label>
                        <button
                          type="button"
                           className="artist-btn"
                          onClick={() => handleRemoveCategory(index)}
                        >
                        <i className="fa fa-trash me-2"></i> Delete Category
                        </button>
                      </div>
                      <Form.Control
                        type="text"
                        name="category_name"
                        value={item.category_name}
                        onChange={(e) => handleChange(e, index)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12} className="text-end">
                    <Button
                      className="btn btn-sm text-white me-2"
                      style={{
                        fontSize: "14px",
                        background: "#008080",
                      }}
                      type="button"
                      onClick={() => handleAddFaq(index)}
                    >
                      <PlusCircleOutlined /> Add Faq
                    </Button>
                  </Col>
                </Row>
                {item?.faqs?.map((faq, faqIndex) => (
                  <div className="mb-3" key={`${index}-${faqIndex}`}>
                    <div className="faq-card-inner">
                      <Row>
                        <Col md={6} className="mb-md-0 mb-2">
                          <Form.Group
                            className="mb-3"
                            controlId={`formQuestion-${index}-${faqIndex}`}
                          >
                            <Form.Label>Question</Form.Label>
                            <Form.Control
                              type="text"
                              name="question"
                              value={faq.question}
                              onChange={(e) =>
                                handleChange(e, index, faqIndex)
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group
                            controlId={`formAnswer-${index}-${faqIndex}`}
                          >
                            <Form.Label>Answer</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="answer"
                              value={faq.answer}
                              onChange={(e) =>
                                handleChange(e, index, faqIndex)
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                    <div className="d-flex justify-content-end mt-2">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveFaq(index, faqIndex)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={bottomRef} />
          </CardBody>
          <CardFooter className="text-end">
            {submitLoading ? (
              <BTNLoader className={"artist-btn"} />
            ) : (
              <Button
                className="artist-btn"
                type="button"
                onClick={handleSubmit}
              >
                Update
              </Button>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default Faq;
