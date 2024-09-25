import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { APICALL } from "../../../helper/api/api";
import { getTierImg } from "../../../helper/Utility";
import FrontLoader from "../../../components/FrontLoader";
import Alphabet from "../../../components/Alphabet";

const Artists = () => {
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState('');
  const letterRefs = useRef({});
  useEffect(() => {
    getListFun();
  }, []);

  const getListFun = async () => {
    setLoading(true);
    try {
      const res = await APICALL("admin/allUsers", "post", { role: "artist" });
      setLoading(false);
      if (res?.status) {
        setList(res?.Users);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);

    if (letterRefs.current[letter]) {
      const box = letterRefs.current[letter];
      const boxRect = box.getBoundingClientRect();
      const offset = window.scrollY + boxRect.top - (window.innerHeight * 0.1);
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="artist_page">
      <Container>
        <div className="text-md-center">
          <h1 className="mb-md-5 mb-4">All Artists</h1>
        </div>
        <Row>
          <Col md={12}>
            <div className="aplha_list">
            <Alphabet handleLetterClick={handleLetterClick} selectedLetter={selectedLetter}/>
            </div>

            <div className="wrapin mt-md-5 mt-3">
              <div className="columns">
                {loading ? (
                  <FrontLoader />
                ) : list.length === 0 ? (
                  <p>There are no artist to display.</p>
                ) : (
                  alphabet?.map((letter) => {
                    const artistsByLetter = list.filter((artist) => artist?.userName.charAt(0).toUpperCase() === letter);
                    if (artistsByLetter?.length === 0) return null;

                    return (
                      <div className={`box ${selectedLetter === letter ? 'active' : ''}`} key={letter} ref={el => letterRefs.current[letter] = el}>
                        <h2>{letter}</h2>
                        <ul>
                          {artistsByLetter?.map((artist) => (
                            <li key={artist.id}>
                              <Link to={`/collection/${artist?._id}`}>
                                {artist?.userName}
                                <span className="image_tier">
                                  {getTierImg(artist?.currentRank)?.icon}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Artists;
