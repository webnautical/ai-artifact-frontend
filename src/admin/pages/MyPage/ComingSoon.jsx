import React from "react";
import { Paper } from "@mui/material";

const ComingSoon = () => {
    return (
        <>
            {
                <Paper className="table_samepattern">
                    <div className="row">
                        <div className="col-12 px-5 py-5">
                            <h1>Coming Soon</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis ratione placeat, quas magni pariatur rerum repellendus laboriosam sint eius quia vel expedita dicta dolores quos voluptatem, minus, repudiandae hic laborum veniam iure quaerat nulla. Repellendus nobis, nemo, cupiditate illo beatae nostrum officiis dolorem tenetur assumenda dolores earum quibusdam saepe blanditiis.</p>

                            <img src="https://aiartifact.itworkshop.in/13732337_SL_030420_28660_02.jpg" style={{width: '50%'}} alt="" />
                        </div>
                    </div>
                </Paper>
            }

        </>
    );
};

export default ComingSoon;
