import React, { useState, useEffect } from "react";
import { Shimmer } from "@teamfabric/copilot-ui";
import { } from "react-router-dom";
import * as Helpers from "../../../utils/helpers/scripts";


// components

import {
    saveDataIntoLocalStorage,
    getDataFromLocalStorage,
    checkAuthTokenExpiration,
    checkBrandAuthFromLocalStorage,
    checkUserAuthFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";
import { useHistory } from 'react-router-dom';
import * as AuthApiUtil from '../../../utils/api/auth-api-utils';
import Constants from '../../../utils/constants/constants';



function PosAuthentication() {

    const history = useHistory();
    //const [storeInfo, setStoreInfo] = useState([]);
    //const [loading, setLoading] = useState(false);

    var mounted = true;


    useEffect(() => {

        let authExpirationTokenDate = null;
        let readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
        readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
        //console.log(readFromLocalStorage);

        let authenticateDashboard = false;
        
        if (readFromLocalStorage) {

            if (
                checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
            ) {
                authenticateDashboard = true;
                authExpirationTokenDate = readFromLocalStorage.expire_at;

            }
            else {
                authenticateDashboard = false;
                authExpirationTokenDate = readFromLocalStorage.expire_at;
            }
        }

        else {  //cache not exists
            //call auth api
            handleCoPilotAuthApi(Constants.CO_PILOT_LIFE_TIME_TOKEN); //imp
        }

        if (readFromLocalStorage && authExpirationTokenDate) {  //if expire token exists
            if (checkAuthTokenExpiration(authExpirationTokenDate)) {
                handleCoPilotAuthApi(Constants.CO_PILOT_LIFE_TIME_TOKEN);  //imp
            } else {

                if (authenticateDashboard) {
                    history.push({
                        pathname: '/dashboard',
                    });
                }
                else {
                    history.push({
                        pathname: '/brands',
                    });
                }

            }

        }


        return () => {
            mounted = false;
        }

    }, []);




    const handleCoPilotAuthApi = async (token) => {
        
        document.getElementById('app-loader-container').style.display = "block"; 
        const loginResponse = await AuthApiUtil.authCoPilotLogin(token);
        console.log("loginResponse", loginResponse);
        if (loginResponse.hasError) {
            const errorMessage = loginResponse.errorMessage;
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, errorMessage);  //imp
        } else {
            delete loginResponse['hasError'];  //imp
            let loggedInUserDetails = loginResponse;  //imp
            if (mounted) {   //imp if unmounted
                saveDataIntoLocalStorage(Constants.USER_DETAILS_KEY, loggedInUserDetails);
                document.getElementById('app-loader-container').style.display = "none";
                window.open("/pos/brands", "_self");
            }
        }

    };


    const showAlertUi = (show, errorText) => {
        Helpers.showAppAlertUiContent(show, errorText);
    }



    return (
        <div className="page">
            <Shimmer
                className="primary"
                count={2}
                perRow={3}
            />
        </div>
    );
}

export default PosAuthentication;
