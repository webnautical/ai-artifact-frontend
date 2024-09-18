import React from 'react'

const TableMSG = ({msg}) => {
    return (
        <div className="col-12 text-center px-2 mt-3">
            <div class="alert alert-success" role="alert">
                {msg}
            </div>
        </div>
    )
}

export default TableMSG