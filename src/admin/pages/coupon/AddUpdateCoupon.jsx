import React, { useEffect, useState } from "react";
import {
    Row,
    Button,
    CardBody,
    Col,
    Form,
} from "react-bootstrap";
import BTNLoader from "../../../components/BTNLoader";
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";
import { APICALL } from "../../../helper/api/api";
import swal from "sweetalert";
import { formatDateForInput } from "../../../helper/Utility";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const currentDate = getCurrentDate();
const AddUpdateCoupon = ({ setAddUpdPage, getListFun, editData, setEditData }) => {
    const [submitLoading, setSubmitLoading] = useState(false)
    const [formData, setFormData] = useState({
        code: "",
        discountValue: "",
        discountType: "",
        totalUsageLimit: "50",
        userUsageLimit: "2",
        minPurchaseAmount: "",
        startDate: "",
        endDate: "",
        customerRestrictions: []
    });

    useEffect(() => {
        if (editData?._id) {
            setFormData({
                ...formData,
                id: editData?._id,
                code: editData?.code,
                discountValue: editData?.discountValue,
                discountType: editData?.discountType,
                totalUsageLimit: editData.totalUsageLimit,
                userUsageLimit: editData.userUsageLimit,
                minPurchaseAmount: editData?.minPurchaseAmount,
                startDate: formatDateForInput(editData?.startDate),
                endDate: formatDateForInput(editData?.endDate),
                customerRestrictions: editData?.customerRestrictions
            })
        } else {
            setFormData({
                ...formData,
                code: "",
                discountValue: "",
                discountType: "",
                totalUsageLimit: "50",
                userUsageLimit: "2",
                minPurchaseAmount: "",
                startDate: currentDate,
                endDate: "",
                customerRestrictions: []
            })
        }
    }, [editData])
    const [customerList, setCustomerList] = useState([])

    useEffect(() => {
        customerFun()
    }, [])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleCategoryChange = (event) => {
        const { target: { value } } = event;
        setFormData({ ...formData, 'customerRestrictions': typeof value === 'string' ? value.split(',') : value })
    };

    const customerFun = async () => {
        try {
            const res = await APICALL("admin/allUsers", "post", { role: "customer" });
            if (res?.status) { setCustomerList(res?.Users); }
        } catch (error) {
            console.log(error);
        }
    };

    const [error, setError] = useState({
        code: "",
        discountValue: "",
        discountType: "",
        totalUsageLimit: "",
        userUsageLimit: "",
        minPurchaseAmount: "",
        startDate: "",
        endDate: "",
    });
    const generateCoupon = () => {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const currentMonth = new Date().getMonth();
        const month = monthNames[currentMonth];
        const randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000);
        const generatedCode = `${month}${randomFourDigitNumber}`;
        setFormData({ ...formData, 'code': generatedCode })
    }
    const [addUpdateApiCallCount, setAddUpdateApiCallCount] = useState(0);

    const handleValidate = () => {
        setAddUpdateApiCallCount(addUpdateApiCallCount + 1);
        const { code, discountValue, discountType, totalUsageLimit, userUsageLimit, minPurchaseAmount, startDate, endDate } = formData;

        if (code == "") {
            setError((prevValues) => {
                return { ...prevValues, ["code"]: "Required *" };
            });
        } else {
            setError((prevValues) => {
                return { ...prevValues, ["code"]: true };
            });
        }

        if (discountType == "") {
            setError((prevValues) => {
                return { ...prevValues, ["discountType"]: "Required *" };
            });
        } else {
            setError((prevValues) => {
                return { ...prevValues, ["discountType"]: true };
            });
        }

        if (formData?.discountType !== 'free_shipping') {
            if (discountValue == "") {
                setError((prevValues) => {
                    return { ...prevValues, ["discountValue"]: "Required *" };
                });
            } else {
                setError((prevValues) => {
                    return { ...prevValues, ["discountValue"]: true };
                });
            }
        } else {
            setError((prevValues) => {
                return { ...prevValues, ["discountValue"]: true };
            });
        }

        if (totalUsageLimit == "") {
            setError((prevValues) => {
                return { ...prevValues, ["totalUsageLimit"]: "Required *" };
            });
        } else {
            setError((prevValues) => {
                return { ...prevValues, ["totalUsageLimit"]: true };
            });
        }

        if (userUsageLimit == "") {
            setError((prevValues) => {
                return { ...prevValues, ["userUsageLimit"]: "Required *" };
            });
        } else {
            setError((prevValues) => {
                return { ...prevValues, ["userUsageLimit"]: true };
            });
        }
        if (minPurchaseAmount == "") {
            setError((prevValues) => {
                return { ...prevValues, ["minPurchaseAmount"]: "Required *" };
            });
        } else {
            setError((prevValues) => {
                return { ...prevValues, ["minPurchaseAmount"]: true };
            });
        }
        if (startDate == "") {
            setError((prevValues) => {
                return { ...prevValues, ["startDate"]: "Required *" };
            });
        } else {
            setError((prevValues) => {
                return { ...prevValues, ["startDate"]: true };
            });
        }
        if (endDate == "") {
            setError((prevValues) => {
                return { ...prevValues, ["endDate"]: "Required *" };
            });
        } else {
            setError((prevValues) => {
                return { ...prevValues, ["endDate"]: true };
            });
        }
    }

    const { code, discountValue, discountType, totalUsageLimit, userUsageLimit, minPurchaseAmount, startDate, endDate } = error;
    useEffect(() => {
        if ((
            code === true &&
            discountType === true &&
            totalUsageLimit === true &&
            userUsageLimit === true &&
            minPurchaseAmount === true &&
            startDate === true &&
            endDate === true
        )) {
            handleSubmit()
        }
    }, [code, discountType, addUpdateApiCallCount, totalUsageLimit, userUsageLimit, minPurchaseAmount, startDate, endDate]);

    const handleSubmit = async () => {
        setSubmitLoading(true)
        try {
            const api = formData?.id ? "updateCoupon" : "createCoupon"
            const res = await APICALL(`admin/${api}`, 'post', formData)
            if (res?.status) {
                swal({
                    title: res?.message,
                    icon: "success",
                    button: { text: "OK", className: "swal_btn_ok" },
                });
                setAddUpdPage(false)
                getListFun()
            } else {
                swal({
                    title: "Something Went Wrong !!",
                    icon: "error",
                    button: { text: "OK", className: "swal_btn_ok" },
                });
            }
        } catch (error) {
            swal({
                title: "Something Went Wrong !!",
                icon: "error",
                button: { text: "OK", className: "swal_btn_ok" },
            });
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleCancel = () => {
        setAddUpdPage(false)
        setEditData(null)
    }

    return (
        <>
            <CardBody>
                <div className="cutoms-login-artist px-3">
                    <Row className="mb-md-3 g-3">
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Coupon</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                />
                                <div className="text-end">
                                    <button onClick={() => generateCoupon()} className='global_light_btn '>Generate Coupon</button>
                                </div>
                                <span className="errmsg">{error.code}</span>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Discount Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={handleChange}
                                >
                                    <option value="">--SELECT--</option>
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed</option>
                                    <option value="free_shipping">Free Shipping</option>
                                </Form.Control>
                                <span className="errmsg">{error.discountType}</span>


                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Discount Value</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleChange}
                                />
                                <span className="errmsg">{error.discountValue}</span>

                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Total Coupon</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="totalUsageLimit"
                                    value={formData.totalUsageLimit}
                                    onChange={handleChange}
                                />
                                <span className="errmsg">{error.totalUsageLimit}</span>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>User Usage Limit</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="userUsageLimit"
                                    value={formData.userUsageLimit}
                                    onChange={handleChange}
                                />
                                <span className="errmsg">{error.userUsageLimit}</span>

                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Min Purchase Amount</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="minPurchaseAmount"
                                    value={formData.minPurchaseAmount}
                                    onChange={handleChange}
                                />
                                <span className="errmsg">{error.minPurchaseAmount}</span>

                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    min={currentDate}
                                />
                                <span className="errmsg">{error.startDate}</span>

                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    min={formData.startDate || currentDate}
                                />
                                <span className="errmsg">{error.endDate}</span>

                            </Form.Group>
                        </Col>

                        <Col md={3}>
                        <Form.Label className="mb-2">Choose Customer Restrictions</Form.Label>
                            <FormControl sx={{ width: '100%' }} className="multi_choose pilot_map_select multi_select_drop ">
                                <InputLabel id="demo-multiple-checkbox-label">Choose Customer Restrictions</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={formData?.customerRestrictions || []}
                                    onChange={handleCategoryChange}
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.map(id => customerList.find(cat => cat?._id === id)?.first_name).join(', ')}
                                    MenuProps={MenuProps}
                                    className="check_select"
                                    inputProps={{
                                        'aria-label': 'Select categories',
                                    }}
                                    placeholder="Select categories"
                                >
                                    {customerList?.map((name) => (
                                        <MenuItem key={name._id} value={name._id}>
                                            <Checkbox checked={formData?.customerRestrictions?.indexOf(name._id) > -1} />
                                            <ListItemText className="text-capitalize" primary={name.first_name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Col>
                        <Col md={12} className="text-end">
                            <Button className="line-close-btn me-2" type="button" onClick={() => handleCancel()} >Cancel</Button>

                            {submitLoading ? (
                                <BTNLoader className={"artist-btn"} />
                            ) : (
                                <Button className="artist-btn" type="button" onClick={() => handleValidate()} >{formData?.id ? "Update" : "Save"}</Button>
                            )}
                        </Col>
                    </Row>
                </div>
            </CardBody>
        </>
    )
}

export default AddUpdateCoupon