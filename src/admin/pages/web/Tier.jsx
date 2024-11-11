import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Paper from "@mui/material/Paper";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import AdminLoader from './../../components/AdminLoader';
import { SERVER_ERR, SOMETHING_ERR } from "../../../helper/Constant";
import { APICALL } from "../../../helper/api/api";
import { filterByKey, imgBaseURL } from "../../../helper/Utility";
import swal from "sweetalert";
import BTNLoader from "../../../components/BTNLoader";
import { useDataContext } from "../../../helper/context/ContextProvider";
import notier from '../../../assets/images/notier.png'

const Tier = () => {
    const [loading, setLoading] = useState({
        'list': false,
        'submit': false
    })
    const [loadingItems, setLoadingItems] = useState({});
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        getListFun()
    }, [])
    const getListFun = async () => {
        setLoading({ ...loading, 'list': true })
        try {
            const res = await APICALL('rank/getTiers', 'post', {})
            setLoading({ ...loading, 'list': false })
            if (res?.status) { setDataList(res?.data) }
        } catch (error) {
            setLoading({ ...loading, 'list': false })
        }
    }

    const [updatedData, setUpdatedData] = useState([]);

    useEffect(() =>{
        setUpdatedData(dataList)
    },[dataList])

    const handleInputChange = (e, i, field) => {
        const newList = [...updatedData];
        newList[i] = { ...newList[i], [field]: e.target.value };
        setUpdatedData(newList);
    };

    const handleSave = async (item, i) => {
        const newLoadingState = { ...loadingItems, [i]: true };
        setLoadingItems(newLoadingState);
        try {
            const res = await APICALL(`/rank/createTier`, 'post', updatedData[i]);
            if (res?.status) {
                getListFun()
                swal({ title: "Updated Successfully !!", icon: "success", button: { text: "OK", className: "swal_btn_ok" } });
            } else {
                swal({ title: "Something Went Wrong !!", icon: "error", button: { text: "OK", className: "swal_btn_ok" } });
            }
        } catch (error) {
            console.log(error)
            swal({ title: error?.response?.data?.message, icon: "error", button: { text: "OK", className: "swal_btn_ok" } });
        }finally{
            setLoadingItems({ ...loadingItems, [i]: false });
        }
    };

    return (
        <>
            <div className="row g-3 mb-3">
                {loading?.list ? (
                    <AdminLoader />
                ) : (
                    updatedData?.map((item, i) => (
                        <div className="col-md-4" key={i}>
                            <Paper className="table_samepattern cutoms-login-artist">
                                <div className="tier-box p-3">
                                    <div className="text-center">
                                    <img src={item.icon ? imgBaseURL() + item.icon : notier} alt="" style={{ height: '60px', width: '50px' }} />
                                        <h6>{item?.name}</h6>
                                    </div>
                                    <hr />
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <label htmlFor="">Demotion Auto Points</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item?.autoPoints}
                                                onChange={(e) => handleInputChange(e, i, 'autoPoints')}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="">Achievement Auto Points</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item?.achievementPoints}
                                                onChange={(e) => handleInputChange(e, i, 'achievementPoints')}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="">Commission</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item?.commission}
                                                onChange={(e) => handleInputChange(e, i, 'commission')}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="">Max Uploads</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item?.maxUploads}
                                                onChange={(e) => handleInputChange(e, i, 'maxUploads')}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="">Threshold</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item?.threshold}
                                                onChange={(e) => handleInputChange(e, i, 'threshold')}
                                            />
                                        </div>
                                        <div className="col-12 text-end">
                                            {
                                               loadingItems[i] ? 
                                                <BTNLoader className="artist-btn btn btn-primary"/>:
                                                <button  className="artist-btn btn btn-primary"   onClick={() => handleSave(item, i)}>Save Change</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default Tier;
