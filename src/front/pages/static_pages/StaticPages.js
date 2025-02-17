import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import CopyrightComplaints from "../CopyrightComplaints";
import TermsofUse from "../TermsofUse ";
import Shipping from "../Shipping";
import { APICALL } from "../../../helper/api/api";
import FrontLoader from "../../../components/FrontLoader";
import ContactUs from "../ContactUs";
import AboutUs from "./pages/AboutUs";
import WhatsAiartifact from "./pages/WhatsAiartifact";
import AiartifactClub from "./pages/AiartifactClub";
import MountingInstructions from "./pages/MountingInstructions";
import PlainTextPage from "./pages/PlainTextPage";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import DefaultPage from "./pages/DefaultPage";
import ContactForm from "../../../components/ContactForm";

const StaticPages = () => {
  const page = useLocation()?.pathname.replace(/^\//, "");
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);
  useEffect(() => {
    getPageContentFun();
  }, [page]);

  useEffect(() => {
    if (pageData) {
      document.title = pageData.metaTitle || "AI-ARTIFACT";
      updateMetaTags();
    }
  }, [pageData]);
  const getPageContentFun = async () => {
    setLoading(true);
    try {
      const res = await APICALL("user/getPageByRoute", "post", { route: page });
      if (res?.status) {
        setPageData(res?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSideBarFunc()
  }, [])

  const updateMetaTags = () => {
    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) {
      metaTitle.setAttribute("content", pageData.metaTitle || "AI-ARTIFACT");
    } else {
      const newMeta = document.createElement("meta");
      newMeta.property = "og:title";
      newMeta.content = pageData.metaTitle || "AI-ARTIFACT";
      document.head.appendChild(newMeta);
    }

    const metaDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        pageData.metaDesc || "Description"
      );
    } else {
      const newMeta = document.createElement("meta");
      newMeta.property = "og:description";
      newMeta.content = pageData.metaDesc || "Description";
      document.head.appendChild(newMeta);
    }
  };

  const [openIndexes, setOpenIndexes] = useState([]);
  const [sidebar, setSidebar] = useState([])
  const getSideBarFunc = async () => {
    try {
      const res = await APICALL("admin/getNestedPages", "post", {})
      if (res?.status) {
        setSidebar(res?.data)
      } else {
        setSidebar([])
      }
    } catch (error) {
      console.log(error)
      setSidebar([])
    }
  }
  const toggleSubmenu = (index) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <>
      <Container>
        <Row>
          <Col md={3}>
            <div className="sibebar_page">
              <ul>
                {sidebar?.map((item, i) => (
                  <>
                    {
                      item?.subItems?.length ?
                        <li>
                          <div className="d-flex justify-content-between">
                            <Link to={`/${item?.route}`} className={`${page === item?.route ? "active" : ""}`}>{item?.name}</Link>
                            <button className=" p-0" onClick={() => toggleSubmenu(i)}>
                              <i className={`fa-solid ${openIndexes.includes(i) ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                            </button>
                          </div>

                          {openIndexes.includes(i) && (
                            <ul className="submenu">
                              {item?.subItems?.map((submenu, i) => (
                                <li><Link to={`/${submenu?.route}`} className={`${page === submenu?.route ? "active" : ""}`}>{submenu?.name}</Link></li>
                              ))}
                            </ul>
                          )}
                        </li>
                        :
                        <li><Link to={`/${item?.route}`} className={`${page === item?.route ? "active" : ""}`}>{item?.name}</Link></li>
                    }
                  </>
                ))}
              </ul>
            </div>
          </Col>
          <Col md={9}>
            <>
              {loading ? (
                <FrontLoader />
              ) : page === "copyright-complaints" ? (
                <CopyrightComplaints pageData={pageData} />
              ) : page === "terms-of-use" ? (
                <PlainTextPage pageData={pageData} />
              ) : page === "privacy-policy" ? (
                <PlainTextPage pageData={pageData} />
              ) : page === "shipping" ? (
                <Shipping pageData={pageData} />
              ) : page === "about-us" ? (
                <AboutUs pageData={pageData} />
              ) : page === "what-is-aiartifact" ? (
                <WhatsAiartifact pageData={pageData} />
              ) : page === "aiartifact-club" ? (
                <AiartifactClub pageData={pageData} />
              ) : page === "mounting-instructions" ? (
                <MountingInstructions pageData={pageData} />
              ) : page === "contact-us" ? (
                <ContactUs pageData={pageData} />
              ) : page === "content-guidelines" ? (
                <Shipping pageData={pageData} />
              ) : (
                <>
                  <DefaultPage pageData={pageData} />
                </>
              )}
            </>
          </Col>
          <Col md={12}>
              <ContactForm />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default StaticPages;