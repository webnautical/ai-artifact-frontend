import React, { useEffect, useState } from "react";
import { Alert, Paper, Stack } from "@mui/material";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Tabs, Tab, Row, Col } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import TableData from "./TableData";
import { auth, timeAgo } from "../../../helper/Utility";
import { APICALL } from "../../../helper/api/api";
import { TABLE_ROW_PER_PAGE } from "../../../helper/Constant";
import BTNLoader from "../../../components/BTNLoader";
import { useDataContext } from "../../../helper/context/ContextProvider";
import HistoryDetails from "./HistoryDetails";

const Withdrawal = () => {
    const { userInfoByID, getUserByIDFun, userDetailsLoading } = useDataContext();

    const logedRole = auth('admin')?.user_role
    const [show, setShow] = useState(false);
    const [activeTab, setActiveTab] = useState(logedRole === "admin" ? "artist_request" : 'withdrawal');
    const [modal, setModal] = useState({
        'adminConfirm': false,
        'afterSuccess': false,
        'detailsPage': false,
    })

    const [withdrawalAmount, setWithdrawalAmount] = useState('')
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState(null)
    const handleClose = () => {
        setShow(false);
        setError("")
        setWithdrawalAmount("")
    }
    const handleShow = () => setShow(true);

    const [tabsData, setTabsData] = useState({ status: "pending", role: "artist" })
    const handleTabSelect = (key) => {
        let data;
        switch (key) {
            case "artist_request":
                data = { status: "pending", role: "artist" };
                break;
            case "artist_transaction":
                data = { status: "approved", role: "artist" };
                break;
            case "affiliate_request":
                data = { status: "pending", role: "affiliate" };
                break;
            case "affiliate_transaction":
                data = { status: "approved", role: "affiliate" };
                break;
            default:
                setActiveTab(key);
                return;
        }
        setTabsData(data);
        setActiveTab(key);
        setRowData(null)
    };
    const [listLoading, setListLoading] = useState(false);
    const [loading, setLoading] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [pageNo, setPageNo] = useState(1);
    const [stripeVerifyStatus, setStripeVerifyStatus] = useState(null)
    useEffect(() => {
        if (logedRole !== "admin") {
            getUserByIDFun(auth('admin')?.id)
        }
    }, [])

    useEffect(() => {
        if (activeTab !== "withdrawal") {
            getListFun(pageNo, rowsPerPage);
        }
    }, [pageNo, rowsPerPage, activeTab]);

    useEffect(() => {
        if (userInfoByID?.stripeAccountId) {
            checkConnectStripeStatus()
        }
    }, [userInfoByID])

    const getListFun = async (pageNo, rowsPerPage) => {
        setListLoading(true);
        try {
            const params = { page: pageNo, limit: rowsPerPage, "userId": auth('admin')?.id, "status": activeTab };
            const adminParams = { page: pageNo, limit: rowsPerPage, ...tabsData };
            const res = await APICALL(`admin/getWithdrawal`, "post", logedRole === "admin" ? adminParams : params);
            console.log("getWithdrawal", res)
            if (res?.status) {
                setData(res.data);
                setTotalPages(res.totalCount);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setListLoading(false);
        }
    };

    const acceptWithdrawFun = async () => {
        setLoading(true);
        try {
            const params = { userId: rowData?.user_id?._id, amount: rowData?.amount, "withdrawalId": rowData?._id };
            const res = await APICALL(`admin/acceptWithdraw`, "post", params);
            if (res?.status) {
                setLoading(false)
                setRowData(null)
                setModal({ ...modal, afterSuccess: true })
                getListFun(pageNo, rowsPerPage);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        const minAmount = 100;
        const maxAmount = userInfoByID?.withdrawableBalance;
        if (!value.trim()) {
            setError('Withdrawal amount is required.');
            setWithdrawalAmount('');
            return;
        }
        if (isNaN(value)) {
            setError('Please enter a valid number.');
        } else if (value < minAmount) {
            setError(`The minimum amount you can withdraw is $${minAmount}.`);
        } else if (value > maxAmount) {
            setError(`The maximum amount you can withdraw is $${maxAmount}.`);
        } else {
            setError('');
        }
        setWithdrawalAmount(value);
    }
    const requestWithdrawal = async () => {
        if (!withdrawalAmount.trim()) {
            setError('Withdrawal amount is required.');
            return;
        }
        setLoading(true);
        try {
            const params = { amount: withdrawalAmount };
            const res = await APICALL(`artist/requestWithdrawal`, "post", params);
            if (res?.status) {
                setLoading(false)
                setRowData(null)
                setModal({ ...modal, afterSuccess: true })
                getUserByIDFun(auth('admin')?.id)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const checkConnectStripeStatus = async () => {
        try {
            const params = { accountId: userInfoByID?.stripeAccountId };
            const res = await APICALL(`artist/checkStripeAccountStatus`, "post", params);
            setStripeVerifyStatus(res)
        } catch (error) {
            console.error(error);
        }
    };
    const connectWithStripe = async () => {
        setLoading(true);
        try {
            const params = { artistEmail: auth('admin')?.email, country: "IE", role: logedRole };
            const res = await APICALL(`artist/stripeVarificationLink`, "post", params);
            window.location.href = res.url;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    console.log("userInfoByID", userInfoByID)
    console.log("stripeVerifyStatus", stripeVerifyStatus)

    return (
        <>
            <Paper className="table_samepattern">

                <div style={{ display: "flex", justifyContent: "space-between", padding: "16px", flexDirection: "column", }}>
                    <h1 className="title-admins-table">Earnings & Withdrawals</h1>
                    Manage your property earnings and withdrawals conveniently in one
                    place. Keep track of your income and easily initiate withdrawals to
                    your preferred payment method. 😊
                </div>

                <div className="witdraw_amount">
                    <Tabs activeKey={activeTab} onSelect={handleTabSelect} id="controlled-tab-example" className="mb-3">
                        {
                            logedRole !== "admin" &&
                            <Tab eventKey="withdrawal" title="Withdraw Funds">
                                <div>
                                    <div className="my_wallet">
                                        <h5 className="mb-3" style={{ color: "purple", fontWeight: "700" }}>  My Wallet</h5>
                                        <Row>
                                            <Col md={5}>
                                                <div className="main_wallet_box">
                                                    <div className="total_income">
                                                        <h6>${userInfoByID?.walletBalance}</h6>
                                                        <p>Total Income</p>
                                                    </div>
                                                    <div className="availbale_withdrw">
                                                        <h6>${userInfoByID?.withdrawableBalance}</h6>
                                                        <p>Available to withdraw</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={7}>
                                                <div className="acces_btn_artist d-flex justify-content-end">
                                                    {
                                                        stripeVerifyStatus?.status === "enabled" ?
                                                            <button className="line-close-btn me-md-3 me-0"> Connected with Stripe</button>
                                                            :
                                                            loading ?
                                                                <BTNLoader className={"line-close-btn me-md-3 me-0"} /> :
                                                                <button className="line-close-btn me-md-3 me-0" onClick={connectWithStripe}> Stripe Connect</button>
                                                    }
                                                    <button className="line-close-btn " variant="primary" onClick={handleShow}>Withdraw</button>
                                                </div>
                                            </Col>
                                        </Row>
                                        <p className="mt-3">
                                            Please note that withdrawals are only allowed for amounts of $100 or more. Ensure that your balance meets this minimum requirement before requesting a withdrawal.
                                        </p>
                                    </div>
                                </div>
                            </Tab>
                        }

                        {
                            logedRole !== "admin" &&
                            <Tab eventKey="pending" title="Payout Management">
                                <TableData {...{ totalPages, data, listLoading, setRowsPerPage, setPageNo, rowsPerPage, activeTab }} />
                            </Tab>
                        }
                        {
                            logedRole !== "admin" &&
                            <Tab eventKey="approved" title="Transaction History">
                                <TableData {...{ totalPages, data, listLoading, setRowsPerPage, setPageNo, rowsPerPage, activeTab }} />
                            </Tab>
                        }

                        {
                            logedRole === "admin" &&
                            <Tab eventKey="artist_request" title="Artist Withdrawal">
                                <TableData {...{ totalPages, data, listLoading, setRowsPerPage, setPageNo, rowsPerPage, activeTab, tabsData, setModal, modal, setRowData }} />
                            </Tab>
                        }
                        {
                            logedRole === "admin" &&
                            <Tab eventKey="affiliate_request" title="Affiliate Withdrawal">
                                <TableData {...{ totalPages, data, listLoading, setRowsPerPage, setPageNo, rowsPerPage, activeTab, tabsData, setModal, modal, setRowData }} />
                            </Tab>
                        }
                        {
                            logedRole === "admin" &&
                            <Tab eventKey="artist_transaction" title="Artist Transaction History">
                                {rowData?.type === "view" ? <HistoryDetails data={rowData} /> :
                                    <TableData {...{ totalPages, data, listLoading, setRowsPerPage, setPageNo, rowsPerPage, activeTab, tabsData, setModal, modal, setRowData }} />
                                }
                            </Tab>
                        }
                        {
                            logedRole === "admin" &&
                            <Tab eventKey="affiliate_transaction" title="Affiliate Transaction History">
                                {rowData?.type === "view" ? <HistoryDetails data={rowData} />
                                    :
                                    <TableData {...{ totalPages, data, listLoading, setRowsPerPage, setPageNo, rowsPerPage, activeTab, tabsData, setModal, modal, setRowData }} />
                                }

                            </Tab>
                        }
                    </Tabs>
                </div>

                <Modal className="modal-all" show={show} onHide={handleClose} centered>

                    <Modal.Header closeButton>
                        <Modal.Title>{modal?.afterSuccess ? "Withdrawal Request Sent ✅" : stripeVerifyStatus?.status !== "enabled" ? "Alert" : "Enter Amount"} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        {
                            modal?.afterSuccess ?
                                <div className="cutoms-login-artist">
                                    <span>Your withdrawal request has been submitted. Please allow up to 72 hours for processing. You'll be notified upon approval and fund transfer.</span>
                                </div>
                                :
                                stripeVerifyStatus?.status !== "enabled" ?
                                    <Stack sx={{ width: '100%' }} className="mb-3">
                                        <Alert variant="filled" severity="error">
                                            {` After you connect your Stripe account, you can withdraw funds.`}
                                        </Alert>
                                    </Stack>
                                    :
                                    <div className="cutoms-login-artist">
                                        <Form>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Withdrawal Amount (${userInfoByID?.withdrawableBalance})</Form.Label>
                                                <span className="d-block mb-2">Enter the amount you want to withdraw from your earnings.</span>
                                                <Form.Control type="text" placeholder="E.g., 1000" value={withdrawalAmount} onChange={handleChange} maxLength={6} />
                                            </Form.Group>
                                            {error && (
                                                <span className="mt-1 text-danger"> {error}</span>
                                            )}
                                        </Form>
                                    </div>
                        }
                    </Modal.Body>
                    {
                        modal?.afterSuccess ?
                            <Modal.Footer>
                                <Button className="global_btn" variant="primary" onClick={handleClose}>Continue</Button>
                            </Modal.Footer>
                            :
                            stripeVerifyStatus?.status !== "enabled" ?
                                <Modal.Footer>
                                    <Button className="global_btn" variant="primary" onClick={handleClose}>Ok</Button>
                                </Modal.Footer>
                                :
                                <Modal.Footer>
                                    {userInfoByID?.withdrawableBalance < 100 ? (
                                        <>
                                            <Stack sx={{ width: '100%' }} spacing={3}>
                                                <Alert variant="filled" severity="error">
                                                    {` You need to have $100 or more in your wallet to make a withdrawal.`}
                                                </Alert>
                                            </Stack>
                                            <Button className="global_btn" variant="primary" style={{ cursor: 'not-allowed' }}>Send Request</Button>
                                        </>
                                    )
                                        :
                                        loading ?
                                            <BTNLoader className={"global_btn"} /> :
                                            <Button className="global_btn" variant="primary" onClick={requestWithdrawal}>Send Request</Button>
                                    }
                                </Modal.Footer>
                    }
                </Modal>

                <Modal className="modal-all" show={modal?.adminConfirm} onHide={() => setModal({ ...modal, adminConfirm: false })} centered>

                    {
                        modal?.afterSuccess ?
                            <div>
                                <h5>Amount transfer succesfully !!</h5>
                                <Button className="global_btn" variant="primary" onClick={() => { setModal({ ...modal, adminConfirm: false }) }}>Ok</Button>
                            </div>
                            :
                            <>
                                <Modal.Header closeButton>
                                    <h4>Confirm Withdrawal Transfer !!</h4>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="cutoms-login-artist">
                                        <h5>Are you sure ? You want to withdrawal Amount.</h5>
                                        <h6 className="text-capitalize"><strong>{rowData?.role} Name : {rowData?.user_id?.first_name + " " + rowData?.user_id?.last_name}</strong></h6>
                                        <h6><strong><span className="text-capitalize">{rowData?.role}</span> Email : {rowData?.user_id?.email}</strong></h6>
                                        <h6><strong>Stripe Account ID : {rowData?.user_id?.stripeAccountId}</strong></h6>
                                        <h6><strong>Request Date : {timeAgo(rowData?.createdAt)}</strong></h6>
                                        <h6><strong>Amount : ${rowData?.amount}</strong></h6>
                                    </div>
                                </Modal.Body>
                                <div className="text-end">
                                    <Button className="global_btn mx-2" variant="primary" onClick={() => setModal({ ...modal, adminConfirm: false })}>Cancel</Button>
                                    {
                                        rowData?.user_id?.stripeAccountId ?
                                            loading ?
                                                <BTNLoader className={"global_btn"} /> :
                                                <Button className="global_btn" variant="primary" onClick={() => acceptWithdrawFun()}>Transfer Now</Button>
                                            :
                                            <Button className="global_btn" variant="primary" style={{ cursor: "not-allowed" }}>Transfer Now</Button>
                                    }
                                </div>
                            </>
                    }
                </Modal>

            </Paper>
        </>
    );
};

export default Withdrawal;
