import React from 'react'

export const StatusBtn = ({btnName, status}) => {
    const getStyle = () =>{
        if(status){
            return "green"
        }else {
            return '#fbc02d'
        }
    }
    return (
        <>
            <button className="status_btn" style={{background : getStyle()}}>{btnName}</button>
        </>
    )
}
