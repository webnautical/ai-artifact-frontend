import React, { useEffect, useState } from "react";
import { Accordion, Col, Container, Nav, Row, Tab } from "react-bootstrap";
import ContactForm from "../../components/ContactForm";
import { APICALL } from "../../helper/api/api";

const Faq = () => {
  const [activeKey, setActiveKey] = useState("0");
  const [faqList, setFaqList] = useState([]);

  useEffect(() => {
    getFaqFun();
  }, []);

  const getFaqFun = async () => {
    try {
      const res = await APICALL("admin/allFaqs", "post", { popular_question: false });
      if (res?.status) {
        setFaqList(res?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="faq-page">
        <Container>
          <h1 className="static-title text-center">Frequently Asked Questions</h1>
          <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
            <Row>
              <Col xl={7} md="7" className="mx-auto mb-md-4 mb-3">
                <Nav variant="pills" className="tab-faq">
                  {faqList.map((category, index) => (
                    <Nav.Item key={index}>
                      <Nav.Link eventKey={index.toString()} className="text-capitalize">{category.category_name}</Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Col>
            </Row>
            <Row>
              <Col md={9} className="mx-auto">
                <div className="according-outer">
                  {faqList.map((category, index) => (
                    <Tab.Content key={index}>
                      <Tab.Pane eventKey={index.toString()}>
                        <h2 className="text-capitalize">{category.category_name}</h2>
                        <div className="according-inner">
                          <Accordion defaultActiveKey={["0"]} flush>
                            {
                              category.faqs?.length > 0 ?
                                category.faqs.map((faq, faqIndex) => (
                                  <Accordion.Item eventKey={faqIndex.toString()} key={faqIndex}>
                                    <Accordion.Header>{faq.question}</Accordion.Header>
                                    <Accordion.Body>{faq.answer}</Accordion.Body>
                                  </Accordion.Item>
                                ))
                                :
                                <>
                                  <div className="no-faqs">
                                    <h6>No FAQs available for this category at the moment.</h6>
                                    <p>Check back later or contact our support team for more information.</p>
                                  </div>
                                </>
                            }
                          </Accordion>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  ))}
                </div>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </section>
      <ContactForm />
    </>
  );
};

export default Faq;
