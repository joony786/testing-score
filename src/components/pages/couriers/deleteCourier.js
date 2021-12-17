import React, { useState, useEffect, } from "react";
import { Button } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../atoms/button_back";
import * as CouriersApiUtil from '../../../utils/api/couriers-api-utils';
import * as Helpers from "../../../utils/helpers/scripts";
import PageTitle from "../../organism/header";
import SwitchOutlet from "../../atoms/switch_outlet";
import { useHistory } from "react-router-dom";



function DeleteCategory(props) {
    const history = useHistory();
    const [selectedCourierData, setSelectedCourierData] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { courier_id = {} } = match !== undefined && match.params;


    let mounted = true;


    useEffect(() => {
        window.scrollTo(0, 0);
        if (courier_id !== undefined) { getCourier(courier_id); }
        else {
            return popPage();
        }

        return () => {
            mounted = false;
        }

    }, []);



    const getCourier = async (courierId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getCourierResponse = await CouriersApiUtil.getCourier(courierId);
        console.log('getCourierResponse:', getCourierResponse);
        if (getCourierResponse.hasError) {
            console.log('Courier Cant Fetched -> ', getCourierResponse.errorMessage);
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, getCourierResponse.errorMessage);  //imp
            return delayPopPage();
        }
        else {
            if (mounted) {     //imp if unmounted
                const courierData = getCourierResponse.courier[0];  //vvimp
                setSelectedCourierData(courierData);
                document.getElementById('app-loader-container').style.display = "none";
            }

        }
    }



    const onFormSubmit = async (event) => {
        event.preventDefault();
        let formValidationsPassedCheck = true;

        if (!selectedCourierData) {
            formValidationsPassedCheck = false;
        }

        if (formValidationsPassedCheck) {

            if (buttonDisabled === false) {
                setButtonDisabled(true);
            }

            document.getElementById('app-loader-container').style.display = "block";
            const courierDeleteResponse = await CouriersApiUtil.deleteCourier(courier_id);
            console.log('courierDeleteResponse:', courierDeleteResponse);

            if (courierDeleteResponse.hasError) {
                console.log('Cant delete courier -> ', courierDeleteResponse.errorMessage);
                setButtonDisabled(false);
                document.getElementById('app-loader-container').style.display = "none";
                showAlertUi(true, courierDeleteResponse.errorMessage);  //imp
            }
            else {
                if (mounted) {     //imp if unmounted
                    document.getElementById('app-loader-container').style.display = "none";
                    setTimeout(() => {
                        history.push({
                            pathname: '/couriers',
                        });
                    }, 500);
                }
            }
        }

    };


    const showAlertUi = (show, errorText) => {
        Helpers.showAppAlertUiContent(show, errorText);
    }


    const handleCancel = (event) => {
        event.preventDefault();
        history.push({
            pathname: '/couriers',
        });
    };

    const popPage = () => {
        history.goBack();
    };

    const delayPopPage = () => {
        setTimeout(() => {
            history.goBack();
        }, 2000);
    };



    return (
        <div className="page">
            <div className="page__top">
                <SwitchOutlet />
                <ButtonBack text="Back to Couriers" link="/couriers" />
            </div>

            <PageTitle title="Delete Couriers" />
            <div className="page__body">
                <section className="page__content">
                    <form className="form" onSubmit={onFormSubmit}>
                        <fieldset className="form__fieldset">
                            <div className="form__row">
                                <div className="item-delete-content">
                                    Do you really want to delete '{
                                        selectedCourierData && selectedCourierData.courier_name}'?
                                </div>
                            </div>
                            <div className="form__row footer-delete-btns">
                                <Button
                                    className="delete-confirm-button"
                                    size="small"
                                    isPrimary={true}
                                    text="Confirm"
                                    disabled={buttonDisabled}
                                />
                                <Button
                                    size="small"
                                    isPrimary={false}
                                    text="Cancel"
                                    onClick={handleCancel}
                                />
                            </div>
                        </fieldset>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default DeleteCategory;
