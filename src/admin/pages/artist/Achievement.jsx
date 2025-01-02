import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import notier from "../../../assets/images/shuttle.png";
import { SOMETHING_ERR } from "../../../helper/Constant";
import { imgBaseURL, toastifyError } from "../../../helper/Utility";
import { APICALL } from "../../../helper/api/api";


const Achievement = () => {
  const [achievements, setAchievements] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showIncompleted, setShowIncompleted] = useState(true);

  const getAchievementsList = async () => {
    try {
      const res = await APICALL("/rank/getAchievements", "post", {});
      if (res?.status) {
        setAchievements(res?.data);
      } else {
        toastifyError(SOMETHING_ERR)
      }
    } catch (error) {
      toastifyError(SOMETHING_ERR)
    } finally {

    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    if (id === "completed-checkbox") {
      setShowCompleted(checked);
    } else if (id === "in-completed-checkbox") {
      setShowIncompleted(checked);
    }
  };

  useEffect(() => {
    getAchievementsList();
  }, []);

  const filteredAchievements = achievements.filter((item) => {
    if (item.achieved && showCompleted) return true;
    if (!item.achieved && showIncompleted) return true;
    return false;
  });
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <div className="d-md-flex" style={{ gap: "10px" }}>
          <h2 className="title-admins-table m-0">Achievements</h2>
        </div>
        <div>
          <div className="d-flex align-items-center">
            <Form.Group className="me-3 large-checkbox">
              <Form.Check
                type="checkbox"
                id="completed-checkbox"
                onChange={handleCheckboxChange}
                checked={showCompleted}
                label={<b className="ms-2"> Completed</b>}
              />
            </Form.Group>
            <Form.Group className="large-checkbox">
              <Form.Check
                type="checkbox"
                onChange={handleCheckboxChange}
                checked={showIncompleted}
                id="in-completed-checkbox"
                label={<b className="ms-2">Incomplete</b>}
              />
            </Form.Group>
          </div>
        </div>
      </div>

      <Row className="row row-cols-1 row-cols-sm-2 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 g-3 pt-1 ">
        {filteredAchievements.map((item, index) => (
          <Col key={index} md={3}>
            <div className={item?.achieved ? "completed achive_ment_box text-center" : "not_achive achive_ment_box text-center"}>
              <div className="tier_img text-center">
                {item.icon != "" ?
                  <img
                    style={{ width: "65px", height: "65px", objectFit: "contain" }}
                    src={imgBaseURL() + item?.icon}
                    alt="tier-img"
                  />
                  :
                  <img
                    style={{ width: "65px", height: "65px", objectFit: "contain" }}
                    src={notier}
                    alt="tier-img"
                  />
                }
              </div>

              <h2>{item?.tierId === "66b5c86d7402d256e68f8562" ? "A Fresh Start" : item?.tierName}</h2>

              <p>{item?.tierId === "66b5c86d7402d256e68f8562" ? "Create An Account" : 'Reach the ' + item?.tierName + ' tier'}</p>

              <h3>Reward</h3>

              <ul className="p-0 m-0">
                {item?.tierId !== "66b5c86d7402d256e68f8562" &&
                  <li>
                    <i className="fa-regular fa-circle-check me-2"></i>{item?.tierName} Badge
                  </li>
                }

                <li>
                  <i className="fa-regular fa-circle-check me-2"></i>{item?.maxUploads} uploads
                </li>

                <li>
                  <i className="fa-regular fa-circle-check me-2"></i>{item?.commission}% Commision
                </li>

                <li>
                  <i className="fa-regular fa-circle-check me-2"></i>+{item?.achievementPoints} Points
                </li>
              </ul>

              {item?.achieved ?
                <>
                  <div className="cmp_box">
                    <div className="cmp_badge">
                      <i className="fa-solid fa-trophy"></i> Completed
                    </div>
                  </div>

                  <p className="mt-3 mb-0 not_achve success_text">Completed : {item?.achievementDate ? formatDate(item.achievementDate) : ''}</p>
                </>
                :
                <p className="mt-3 mb-0 not_achve"><i className="fa-solid fa-lock me-2"></i>Not Yet achieved</p>}


            </div>
          </Col>
        ))}

      </Row>
    </>
  );
};

export default Achievement;
