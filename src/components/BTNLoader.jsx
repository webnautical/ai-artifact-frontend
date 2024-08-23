import React from 'react'

const BTNLoader = ({className}) => {
    return (
        <button className={className} type="button">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
        </button>
    )
}

export default BTNLoader