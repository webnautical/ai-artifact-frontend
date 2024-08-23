import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { APICALL } from "../../helper/api/api";
import HTMLContent from "../../components/HTMLContent";
import { PanToolAltSharp } from "@mui/icons-material";
import { imgBaseURL, timeAgo } from "../../helper/Utility";
import FrontLoader from "../../components/FrontLoader";
import { useNavigate } from "react-router";
import { Skeleton } from "@mui/material";

const Blog = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [listLoading, setListLoading] = useState(false)
  useEffect(() => {
    getListFun()
  }, [])
  const getListFun = async () => {
    setListLoading(true)
    try {
      const res = await APICALL('admin/allBlogs', 'post', {})
      setListLoading(false)
      if (res?.status) {
        setData(res?.data)
      }
    } catch (error) {
      setListLoading(false)
    }
  }
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };
  const viewBlogDetails = (item) => {
    navigate('/blog-details', { state: { data: item } })
  }
  return (
    <>
      {
        listLoading ? <FrontLoader />
          :
          <div className="blog_page">

            <section className="view_full_blog">
              <Container>
                <h1 class="left_global_heading mb-4 text-center">
                  <Spinner animation="grow" size="sm" /> Newest Articles
                </h1>
                <p>
                  Don't hold back - we're here to answer all your questions!
                  <b />
                  Browse the FAQ or talk to our friendly Chatbot.
                </p>
               
              </Container>
            </section>

            <section className="bpx_blog">
              <Container>
                <Row className="g-5">
                  {
                    data?.map((item, i) => (
                      <Col md={6}>
                        <div className="view_full_blog_cnt">
                          <span>{timeAgo(item?.createdAt)}</span>
                          <h2 className="mb-2">{item?.title}</h2>
                          <div>
                            {loading && <Skeleton variant="rectangular" style={{width: '100%'}} height={285} />}
                            <img className="w-100" src={imgBaseURL() + item?.image} alt="" index={i} onLoad={handleImageLoad} />
                          </div>
                          <span className="mt-2 d-block">By Admin</span>
                          <HTMLContent data={item?.content.slice(0, 120)} />
                          <button className="read_btn" onClick={() => viewBlogDetails(item)}>
                            <svg className="me-3" width="32" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" >
                              <PanToolAltSharp d="M22.074 5.42481H0.844C0.62033 5.42481 0.405807 5.51359 0.247555 5.67166C0.0893032 5.82972 0.000265011 6.04414 0 6.26781L0 10.2058C0 10.4297 0.0889212 10.6443 0.247202 10.8026C0.405483 10.9609 0.620157 11.0498 0.844 11.0498H22.074V14.2888C22.0742 14.6225 22.1734 14.9486 22.3589 15.226C22.5444 15.5034 22.8079 15.7195 23.1162 15.8472C23.4245 15.9749 23.7637 16.0083 24.091 15.9432C24.4183 15.8782 24.7189 15.7176 24.955 15.4818L31.006 9.43081C31.1627 9.27415 31.287 9.08817 31.3718 8.88347C31.4566 8.67877 31.5002 8.45937 31.5002 8.23781C31.5002 8.01624 31.4566 7.79685 31.3718 7.59215C31.287 7.38745 31.1627 7.20147 31.006 7.04481L24.955 0.993809C24.7189 0.757979 24.4183 0.597403 24.091 0.53237C23.7637 0.467337 23.4245 0.500763 23.1162 0.628425C22.8079 0.756088 22.5444 0.972259 22.3589 1.24963C22.1734 1.527 22.0742 1.85313 22.074 2.18681V5.42481Z"
                                fill="#008080"
                              />
                            </svg>
                            Read Article
                          </button>
                        </div>
                      </Col>
                    ))
                  }

                </Row>
              </Container>
            </section>

          </div>
      }
    </>
  );
};

export default Blog;
