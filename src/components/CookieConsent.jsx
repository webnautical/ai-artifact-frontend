import React, { useState, useEffect } from "react";

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAccepted, setIsAccepted] = useState(
        localStorage.getItem("cookieConsent") === "true"
    );

    useEffect(() => {
        if (!localStorage.getItem("cookieConsent")) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        setIsAccepted(true);
        setIsVisible(false);
        localStorage.setItem("cookieConsent", "true");
        enableAnalyticsCookies();
    };

    const handleDecline = () => {
        setIsAccepted(false);
        setIsVisible(false);
        localStorage.setItem("cookieConsent", "false");
        disableAnalyticsCookies();
    };

    const enableAnalyticsCookies = () => {
        console.log("Non-essential cookies activated.");
        // Insert your analytics or tracking script activation logic here
    };

    const disableAnalyticsCookies = () => {
        console.log("Non-essential cookies deactivated.");
        // Optionally remove cookies or scripts here
    };

    return (
        isVisible && (
            <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4">
                <p>
                    We use cookies to enhance your browsing experience, analyze site
                    traffic, and personalize content. By clicking "Accept," you agree to
                    the use of non-essential cookies. Declining will disable these
                    cookies. Strictly necessary cookies will still be active.
                </p>
                <div className="mt-2">
                    <button
                        onClick={handleAccept}
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Accept
                    </button>
                    <button
                        onClick={handleDecline}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Decline
                    </button>
                </div>
            </div>
        )
    );
};

export default CookieConsent;
