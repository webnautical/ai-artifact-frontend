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

  return (
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
        <></>
      )}
    </>
  );
};

export default StaticPages;
