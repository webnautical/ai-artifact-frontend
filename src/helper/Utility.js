// import img1 from '../assets/img/1.png'
import dfIMG from '../assets/images/placeholder.webp'
import bronze from '../assets/images/1 - Bronze.png'
import silver from '../assets/images/2 - Silver.png'
import gold from '../assets/images/3 - Gold.png'
import diamond from '../assets/images/4 - Diamond.png'
import { toast } from 'react-toastify';
// import logoimg from '../assets/img/logosite.png'
import { utils, writeFileXLSX } from 'xlsx';
var CryptoJS = require("crypto-js");
// export const defaultUserIMG = img1
export const defaultIMG = dfIMG

export const libraries = ['places'];
// export const logo = logoimg

export const imgBaseURL = () => {
    // const hostname = window.location.hostname
    // if (hostname === "localhost" || hostname === "127.0.0.1") {
    //     return "http://127.0.0.1:8000/storage/";
    // } else {
    // }
    // return "https://phpstack-1369337-5047547.cloudwaysapps.com/"
    return "https://aiartifact.itworkshop.in/"
    // return "https://www.aiartifact.com/"
}
export const apiBaseURL = () => {
    // const hostname = window.location.hostname
    // if (hostname === "localhost" || hostname === "127.0.0.1") {
    //     return "http://127.0.0.1:8000/api";
    // } else {
    // }
    // return "https://phpstack-1369337-5047547.cloudwaysapps.com"
    return "https://aiartifact.itworkshop.in"
    // return "https://www.aiartifact.com"
}
export const apiVersion = () => {
    return "/v1/"
}

export const createSlug = (text) => {
    return text?.toLowerCase() // Convert to lowercase
        ?.trim() // Remove leading and trailing spaces
        ?.replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        ?.replace(/\s+/g, "-"); // Replace spaces with dashes
};


export const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(id, "MYID").toString();
    return encrypted;
};

export const decryptId = (encryptedId) => {
    const bytes = CryptoJS.AES.decrypt(encryptedId, "MYID");
    const originalId = bytes.toString(CryptoJS.enc.Utf8);
    return originalId;
};



export const filterByKey = (key, obj) => {

    if (auth('admin')?.isSubadmin === true) {
        if (!obj || typeof obj !== 'object') {
            return null;
        }
        return obj.hasOwnProperty(key) ? obj[key] : null;
    } else {
        const data = { edit: true, read: true, delete: true, create: true }
        return data
    }
};

export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatdedDate = (date) => {
    if (!(date instanceof Date)) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return '';
        }
        date = parsedDate;
    }

    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
}

export const encryptSessionStorageData = (name, data, key) => {
    var encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    sessionStorage.setItem(name, encryptData)
}

export const dycryptSessionStorageData = (encryptData, key) => {
    var bytes = CryptoJS.AES.decrypt(encryptData, key);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData
}

export const authUser = () => {
    if (sessionStorage.getItem('web-secret')) {
        return dycryptSessionStorageData(sessionStorage.getItem('web-secret'), "DoNotTryToAccess")
    } else {
        return null
    }
}

export const encryptLocalStorageData = (name, data, key) => {
    var encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    localStorage.setItem(name, encryptData)
}

export const dycryptLocalStorageData = (encryptData, key) => {
    var bytes = CryptoJS.AES.decrypt(encryptData, key);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData
}

export const getTokenType = (type) => {
    if (type === "customer") {
        return 'customer-secret'
    } else if (type === 'admin') {
        return 'admin-secret'
    } else if (type === 'remember_me') {
        return 'remember_me'
    }
}

export const auth = (type) => {
    if (localStorage.getItem(getTokenType(type))) {
        return dycryptSessionStorageData(localStorage.getItem(getTokenType(type)), "DoNotTryToAccess")
    } else {
        return null
    }
}

export const generateSlug = (str) => {
    return str.toLowerCase().replace(/[\s_]/g, '-').replace(/[^\w-]+/g, '');
};

export const toastifySuccess = (message) => {
    toast.success(`${message}`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};

export const toastifyError = (message) => {
    toast.error(`${message}`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};

export function filterListByValue(list, searchValues, exactMatchKeys = []) {
    if (!Object.values(searchValues).some(values => values.length > 0)) {
        return list;
    }
    return list.filter(item => {
        return Object.entries(searchValues).every(([key, values]) => {
            if (values.length === 0) {
                return true;
            }
            if (exactMatchKeys.includes(key)) {
                return values.some(searchValue => {
                    return item[key] == searchValue;
                });
            }
            return values.some(searchValue => {
                return item[key].toLowerCase().includes(searchValue.toLowerCase());
            });
        });
    });
}

export const getPercentageOff = (price, sale_price) => {
    const percentage = ((price - sale_price) / price) * 100;
    return percentage.toFixed(2);
}

export const checkItem = (item, textType) => {
    if (item) {
        return item
    } else {
        if (textType === 1) {
            return "Not updated"
        } else {
            return "---"
        }
    }
}

export const textSlice = (text, char) => {

    if (text?.length > char) {
        return text.slice(0, char) + "...";
    } else {
        return text
    }

}
export const textFormated = (text) => {
    const words = text.split('-');
    const formattedText = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return formattedText;
};

export const stringToArray = (str) => {
    if (!str) return [];
    const stringArray = str.split(',');
    const numberArray = stringArray.map((item) => {
        const parsed = parseInt(item.trim(), 10);
        return isNaN(parsed) ? null : parsed;
    });
    return numberArray.filter(item => item !== null);
};


export const getProductType = (type) => {
    return <>
        <span className="text-capitalize">
            {type === 1 ? (
                <>
                    <span className="bg-success text-white btn btn-sm">Simple</span>
                </>
            ) : type === 2 ? (
                <>
                    <span className="bg-warning text-white btn btn-sm">Variant</span>
                </>
            ) : type === 3 ? (
                <>
                    <span className="bg-warning text-white btn btn-sm">Bundle</span>
                </>
            ) : (
                <>
                    <span className="bg-info text-white btn btn-sm">Subscription</span>
                </>
            )}
        </span>
    </>
}

export const productslider = {
    autoplay: true,
    autoplayTimeout: 4000,
    smartSpeed: 800,
    margin: 30,
    dots: false,
    nav: true,
    autoplayHoverPause: true,
    responsiveClass: true,
    infinite: true,

    navText: [
        '<i class="fa fa-chevron-left"></i>',
        '<i class="fa fa-chevron-right"></i>',
    ], // Custom arrow icons
    responsive: {
        0: {
            items: 1.2,
            nav: false,
        },
        600: {
            items: 2.5,
            nav: false,
        },
        1000: {
            items: 3,
            margin: 10,
        },
        1250: {
            items: 4,
        },
    },
};

export const getReviewStar = (star) => {
    return <>
        {
            star === 5 ?
                <>
                    <i className="fa fa-star fa-star"></i>
                    <i className="fa fa-star fa-star"></i>
                    <i className="fa fa-star fa-star"></i>
                    <i className="fa fa-star fa-star"></i>
                    <i className="fa fa-star fa-star"></i>
                </>
                :
                star === 4 ?
                    <>
                        <i className="fa fa-star fa-star"></i>
                        <i className="fa fa-star fa-star"></i>
                        <i className="fa fa-star fa-star"></i>
                        <i className="fa fa-star fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                    </>
                    :
                    star === 3 ?
                        <>
                            <i className="fa fa-star fa-star"></i>
                            <i className="fa fa-star fa-star"></i>
                            <i className="fa fa-star fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                        </>
                        :
                        star === 2 ?
                            <>
                                <i className="fa fa-star fa-star"></i>
                                <i className="fa fa-star fa-star"></i>
                                <i className="fa-regular fa-star"></i>
                                <i className="fa-regular fa-star"></i>
                                <i className="fa-regular fa-star"></i>
                            </>
                            :
                            star === 1 ?
                                <>
                                    <i className="fa fa-star fa-star"></i>
                                    <i className="fa-regular fa-star"></i>
                                    <i className="fa-regular fa-star"></i>
                                    <i className="fa-regular fa-star"></i>
                                    <i className="fa-regular fa-star"></i>
                                </>
                                :
                                <></>
        }
    </>
}

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const handleDownloadExcel = (dataSource: any, sheetName: string, fileName: string) => {
    const ws = utils.json_to_sheet(dataSource);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, sheetName);
    writeFileXLSX(wb, `${fileName}.xlsx`);
    // writeFileXLSX(wb, `${fileName}.pdf`);
};

export const getStatusColor = (status) => {
    const lowerCaseStatus = status?.toLowerCase();
    switch (lowerCaseStatus) {
        case 'delivered':
            return { color: 'white', bg: 'green' };
        case 'shipped':
            return { color: 'white', bg: 'green' };
        case 'out for delivery':
            return { color: 'white', bg: 'green' };
        case 'out for pickup':
            return { color: 'white', bg: 'green' };
        case 'pending':
            return { color: 'white', bg: '#ddad67' };
        case 'cancellation requested':
            return { color: 'white', bg: '#ddad67' };
        case 'cancelled':
            return { color: 'white', bg: 'red' };
        case 'lost':
            return { color: 'white', bg: 'red' };
        default:
            return { color: 'black', bg: 'white' };
    }
};


const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];


function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) {
        // Adding leading zero to minutes
        minutes = `0${minutes}`;
    }
    if (prefomattedDate) {
        // Today at 10:20
        // Yesterday at 10:20
        return `${prefomattedDate} at ${hours}:${minutes}`;
    }
    if (hideYear) {
        // 10. January at 10:20
        return `${day} ${month} at ${hours}:${minutes}`;
    }
    // 10. January 2017. at 10:20
    return `${day} ${month} ${year} at ${hours}:${minutes}`;
}


// --- Main function
export function timeAgo(dateParam) {
    if (!dateParam) {
        return null;
    }
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();


    if (seconds < 5) {
        return 'just now';
    } else if (seconds < 60) {
        return `${seconds} seconds ago`;
    } else if (seconds < 90) {
        return 'about a minute ago';
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (isToday) {
        return getFormattedDate(date, 'Today'); // Today at 10:20
    } else if (isYesterday) {
        return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
    } else if (isThisYear) {
        return getFormattedDate(date, false, false); // 10. January at 10:20
    }

    return getFormattedDate(date); // 10. January 2017. at 10:20
}



export const tableImg = (img) => {
    return (
        <>
            {
                img &&
                <img src={imgBaseURL() + img} alt="" style={{ height: "45px", width: '45px', borderRadius: '100%' }} />
            }
        </>
    )
}

export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const sizeBtnArr = [
    {
        height: 238,
        width: 171,
        transform: 1,
        size: "( Small )",
        name: '13x18 cm / 5x7"',
    },
    {
        height: 238,
        width: 171,
        size: "M",
        transform: 1.1,
        name: '30x40 cm / 12x16"',
    },
    {
        height: 238,
        width: 171,
        transform: 1.2,
        size: "L",
        name: '50x70 cm / 20x28"',
    },
];

export const getTierImg = (tier) => {
    const tierType = tier
    if (tierType === "66b5c8e97402d256e68f856b") {
        return { icon: <img src={gold} alt="badge" />, text: "Gold" }
    } else if (tierType === "66b5c8d07402d256e68f8568") {
        return { icon: <img src={silver} alt="badge" />, text: "Silver" }
    } else if (tierType === "66b5c8bc7402d256e68f8565") {
        return { icon: <img src={bronze} alt="badge" />, text: "Bronze" }
    } else if (tierType === "66b5c90c7402d256e68f856e") {
        return { icon: <img src={diamond} alt="badge" />, text: "Diamond" }
    } else {
        return null
    }
}


export const UID_INFO = [
    {
        "uid": "flat_130x180-mm-5r_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "13x18 cm / 5x7\"",
        "frame": "No Frame",
        "price": 10.00
    },
    {
        "uid": "flat_300x400-mm-12x16-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "30x40 cm / 12x16\"",
        "frame": "No Frame",
        "price": 15.00
    },
    {
        "uid": "flat_500x700-mm-20x28-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "50x70 cm / 20x28\"",
        "frame": "No Frame",
        "price": 20.00
    },
    {
        "uid": "flat_130x180-mm-5r_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "13x18 cm / 5x7\"",
        "frame": "No Frame",
        "price": 10.00
    },
    {
        "uid": "flat_300x400-mm-12x16-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "30x40 cm / 12x16\"",
        "frame": "No Frame",
        "price": 15.00
    },
    {
        "uid": "flat_500x700-mm-20x28-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "50x70 cm / 20x28\"",
        "frame": "No Frame",
        "price": 20.00
    },
    {
        "uid": "framed_poster_mounted_130x180-mm-5x7-inch_black_wood_w12xt22-mm_plexiglass_130x180-mm-5r_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "13x18 cm / 5x7\"",
        "frame": "With Frame",
        "frameType": "Black",
        "assembly": "Ready-to-hang",
        "price": 30.00
    },
    {
        "uid": "framed_poster_130x180-mm-5x7-inch_black_wood_w12xt22-mm_plexiglass_130x180-mm-5r_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "13x18 cm / 5x7\"",
        "frame": "With Frame",
        "frameType": "Black",
        "assembly": "Not assembled",
        "price": 28.00
    },
    {
        "uid": "framed_poster_mounted_130x180-mm-5x7-inch_white_wood_w12xt22-mm_plexiglass_130x180-mm-5r_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "13x18 cm / 5x7\"",
        "frame": "With Frame",
        "frameType": "White",
        "assembly": "Ready-to-hang",
        "price": 30.00
    },
    {
        "uid": "framed_poster_130x180-mm-5x7-inch_white_wood_w12xt22-mm_plexiglass_130x180-mm-5r_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "13x18 cm / 5x7\"",
        "frame": "With Frame",
        "frameType": "White",
        "assembly": "Not assembled",
        "price": 28.00
    },
    {
        "uid": "framed_poster_mounted_130x180-mm-5x7-inch_natural-wood_wood_w12xt22-mm_plexiglass_130x180-mm-5r_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "13x18 cm / 5x7\"",
        "frame": "With Frame",
        "frameType": "Wood",
        "assembly": "Ready-to-hang",
        "price": 32.00
    },
    {
        "uid": "framed_poster_130x180-mm-5x7-inch_natural-wood_wood_w12xt22-mm_plexiglass_130x180-mm-5r_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "13x18 cm / 5x7\"",
        "frame": "With Frame",
        "frameType": "Wood",
        "assembly": "Not assembled",
        "price": 30.00
    },
    {
        "uid": "framed_poster_mounted_300x400-mm-12x16-inch_black_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "30x40 cm / 12x16\"",
        "frame": "With Frame",
        "frameType": "Black",
        "assembly": "Ready-to-hang",
        "price": 35.00
    },
    {
        "uid": "framed_poster_300x400-mm-12x16-inch_black_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "30x40 cm / 12x16\"",
        "frame": "With Frame",
        "frameType": "Black",
        "assembly": "Not assembled",
        "price": 33.00
    },
    {
        "uid": "framed_poster_mounted_300x400-mm-12x16-inch_white_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "30x40 cm / 12x16\"",
        "frame": "With Frame",
        "frameType": "White",
        "assembly": "Ready-to-hang",
        "price": 35.00
    },
    {
        "uid": "framed_poster_300x400-mm-12x16-inch_white_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "30x40 cm / 12x16\"",
        "frame": "With Frame",
        "frameType": "White",
        "assembly": "Not assembled",
        "price": 33.00
    },
    {
        "uid": "framed_poster_mounted_300x400-mm-12x16-inch_natural-wood_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "30x40 cm / 12x16\"",
        "frame": "With Frame",
        "frameType": "Wood",
        "assembly": "Ready-to-hang",
        "price": 37.00
    },
    {
        "uid": "framed_poster_300x400-mm-12x16-inch_natural-wood_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "30x40 cm / 12x16\"",
        "frame": "With Frame",
        "frameType": "Wood",
        "assembly": "Not assembled",
        "price": 35.00
    },
    {
        "uid": "framed_poster_mounted_500x700-mm-20x28-inch_black_wood_w12xt22-mm_plexiglass_500x700-mm-20x28-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "50x70 cm / 20x28\"",
        "frame": "With Frame",
        "frameType": "Black",
        "assembly": "Ready-to-hang",
        "price": 40.00
    },
    {
        "uid": "framed_poster_500x700-mm-20x28-inch_black_wood_w12xt22-mm_plexiglass_500x700-mm-20x28-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "50x70 cm / 20x28\"",
        "frame": "With Frame",
        "frameType": "Black",
        "assembly": "Not assembled",
        "price": 38.00
    },
    {
        "uid": "framed_poster_mounted_500x700-mm-20x28-inch_white_wood_w12xt22-mm_plexiglass_500x700-mm-20x28-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "50x70 cm / 20x28\"",
        "frame": "With Frame",
        "frameType": "White",
        "assembly": "Ready-to-hang",
        "price": 40.00
    },
    {
        "uid": "framed_poster_500x700-mm-20x28-inch_white_wood_w12xt22-mm_plexiglass_500x700-mm-20x28-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "50x70 cm / 20x28\"",
        "frame": "With Frame",
        "frameType": "White",
        "assembly": "Not assembled",
        "price": 38.00
    },
    {
        "uid": "framed_poster_mounted_500x700-mm-20x28-inch_natural-wood_wood_w12xt22-mm_plexiglass_500x700-mm-20x28-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "50x70 cm / 20x28\"",
        "frame": "With Frame",
        "frameType": "Wood",
        "assembly": "Ready-to-hang",
        "price": 42.00
    },
    {
        "uid": "framed_poster_500x700-mm-20x28-inch_natural-wood_wood_w12xt22-mm_plexiglass_500x700-mm-20x28-inch_200-gsm-80lb-uncoated_4-0_ver",
        "quality": "Matte",
        "size": "50x70 cm / 20x28\"",
        "frame": "With Frame",
        "frameType": "Wood",
        "assembly": "Not assembled",
        "price": 40.00
    },
    {
        "uid": "framed_poster_mounted_130x180-mm-5x7-inch_black_wood_w12xt22-mm_plexiglass_130x180-mm-5r_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "13x18 cm / 5x7\"",
        "frame": "With Frame",
        "frameType": "Black",
        "assembly": "Ready-to-hang",
        "price": 30.00
    },
    {
        "uid": "framed_poster_130x180-mm-5x7-inch_black_wood_w12xt22-mm_plexiglass_130x180-mm-5r_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "13x18 cm / 5x7\"",
        "frame": "With Frame",
        "frameType": "Black",
        "assembly": "Not assembled",
        "price": 28.00
    },
    {
        "uid": "framed_poster_mounted_130x180-mm-5x7-inch_white_wood_w12xt22-mm_plexiglass_130x180-mm-5r_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "13x18 cm / 5x7\"",
        "frame": "With Frame",
        "frameType": "White",
        "assembly": "Ready-to-hang",
        "price": 30.00
    },
    {
        "uid": "framed_poster_130x180-mm-5x7-inch_white_wood_w12xt22-mm_plexiglass_130x180-mm-5r_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "13x18 cm / 5x7\"",
        "frame": "With Frame",
        "frameType": "White",
        "assembly": "Not assembled",
        "price": 28.00
    },
    {
        "uid": "framed_poster_mounted_130x180-mm-5x7-inch_natural-wood_wood_w12xt22-mm_plexiglass_130x180-mm-5r_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "13x18 cm / 5x7\"",
        "frame": "With Frame",
        "frameType": "Wood",
        "assembly": "Ready-to-hang",
        "price": 32.00
    },
    {
        "uid": "framed_poster_130x180-mm-5x7-inch_natural-wood_wood_w12xt22-mm_plexiglass_130x180-mm-5r_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "13x18 cm / 5x7\"",
        "frame": "With Frame",
        "frameType": "Wood",
        "assembly": "Not assembled",
        "price": 30.00
    },
    {
        "uid": "framed_poster_mounted_300x400-mm-12x16-inch_black_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "30x40 cm / 12x16\"",
        "frame": "With Frame",
        "frameType": "Black",
        "assembly": "Ready-to-hang",
        "price": 35.00
    },
    {
        "uid": "framed_poster_300x400-mm-12x16-inch_black_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "30x40 cm / 12x16\"",
        "frame": "With Frame",
        "frameType": "Black",
        "assembly": "Not assembled",
        "price": 33.00
    },
    {
        "uid": "framed_poster_mounted_300x400-mm-12x16-inch_white_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "30x40 cm / 12x16\"",
        "frame": "With Frame",
        "frameType": "White",
        "assembly": "Ready-to-hang",
        "price": 35.00
    },
    {
        "uid": "framed_poster_300x400-mm-12x16-inch_white_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "30x40 cm / 12x16\"",
        "frame": "With Frame",
        "frameType": "White",
        "assembly": "Not assembled",
        "price": 33.00
    },
    {
        "uid": "framed_poster_mounted_300x400-mm-12x16-inch_natural-wood_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "30x40 cm / 12x16\"",
        "frame": "With Frame",
        "frameType": "Wood",
        "assembly": "Ready-to-hang",
        "price": 37.00
    },
    {
        "uid": "framed_poster_300x400-mm-12x16-inch_natural-wood_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "30x40 cm / 12x16\"",
        "frame": "With Frame",
        "frameType": "Wood",
        "assembly": "Not assembled",
        "price": 35.00
    },
    {
        "uid": "framed_poster_mounted_500x700-mm-20x28-inch_black_wood_w12xt22-mm_plexiglass_500x700-mm-20x28-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "50x70 cm / 20x28\"",
        "frame": "With Frame",
        "frameType": "Black",
        "assembly": "Ready-to-hang",
        "price": 40.00
    },
    {
        "uid": "framed_poster_500x700-mm-20x28-inch_black_wood_w12xt22-mm_plexiglass_500x700-mm-20x28-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "50x70 cm / 20x28\"",
        "frame": "With Frame",
        "frameType": "Black",
        "assembly": "Not assembled",
        "price": 38.00
    },
    {
        "uid": "framed_poster_mounted_500x700-mm-20x28-inch_white_wood_w12xt22-mm_plexiglass_500x700-mm-20x28-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "50x70 cm / 20x28\"",
        "frame": "With Frame",
        "frameType": "White",
        "assembly": "Ready-to-hang",
        "price": 40.00
    },
    {
        "uid": "framed_poster_500x700-mm-20x28-inch_white_wood_w12xt22-mm_plexiglass_500x700-mm-20x28-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "50x70 cm / 20x28\"",
        "frame": "With Frame",
        "frameType": "White",
        "assembly": "Not assembled",
        "price": 38.00
    },
    {
        "uid": "framed_poster_mounted_500x700-mm-20x28-inch_natural-wood_wood_w12xt22-mm_plexiglass_500x700-mm-20x28-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "50x70 cm / 20x28\"",
        "frame": "With Frame",
        "frameType": "Wood",
        "assembly": "Ready-to-hang",
        "price": 42.00
    },
    {
        "uid": "framed_poster_500x700-mm-20x28-inch_natural-wood_wood_w12xt22-mm_plexiglass_500x700-mm-20x28-inch_200-gsm-80lb-coated-silk_4-0_ver",
        "quality": "Glossy",
        "size": "50x70 cm / 20x28\"",
        "frame": "With Frame",
        "frameType": "Wood",
        "assembly": "Not assembled",
        "price": 40.00
    }
];
