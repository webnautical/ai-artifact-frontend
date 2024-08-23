import React from 'react'

const TextMessage = ({type, msg}) => {
    return (
        <>
            <div class={`alert ${type? "alert-success" : "alert-danger"} alert-dismissible fade show py-3`} role="alert">
                <strong>{type ? "Success" : "Alert"}</strong> {msg}
            </div>
        </>
    )
}

export default TextMessage