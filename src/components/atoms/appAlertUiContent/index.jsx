import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Snackbar } from "@teamfabric/copilot-ui";


function RenderAppAlertUi (props) {

    const {
    text = "Something Went Wrong", 
    width = "300px",
    height = "50px",
    backgroundColor = "rgb(213, 0, 0)",
    textColor = "#fff",
    kind = "alert",
    dismissable = true,
    withIcon = true,
    showAlert = false,
    } = props;

    const [show, setShow] = useState(showAlert);



    useEffect(() => {

    }, [showAlert]);  //imp to pass showAlert to re render


    const handleCloseAlert = (e) => {
        //props.handleCloseAlert();  //imp prev ver 
        //setShow(false);  //imp prev
        document.getElementById('app-alert-ui-container').style.display = "none";  //vimp imp new one

    }



    return (
        <div className="app-alert-container" id="app-alert-ui-container">
        <Snackbar
            className="alert-content"
            dismissable={dismissable}
            height="60px"
            kind="alert"
            label={text}
            kind={kind}
            onDismiss={handleCloseAlert}
            show={show}
            width={width}
            height={height}
            textColor={textColor}
            backgroundColor={backgroundColor}
            //withIcon={withIcon}
            size={"small"}
        />
        </div>
    );
}


export default RenderAppAlertUi;
RenderAppAlertUi.propTypes = {
    text: PropTypes.string,
    //width: PropTypes.string,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    kind: PropTypes.string,
    dismissable: PropTypes.bool,
    withIcon: PropTypes.bool,
    height: PropTypes.string,
    showAlert: PropTypes.bool,
};


