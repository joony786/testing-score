import React, { useState, useEffect, useReducer } from "react";
import { Input } from "@teamfabric/copilot-ui";
import { useHistory } from "react-router-dom";

// components
import ButtonBack from "../../atoms/button_back";
import * as CouriersApiUtil from '../../../utils/api/couriers-api-utils';
import * as Helpers from "../../../utils/helpers/scripts";
import CustomButtonWithIcon from "../../atoms/button_with_icon";
import SwitchOutlet from "../../atoms/switch_outlet";
import PageTitle from "../../organism/header";



function EditCourier(props) {

    const initialFormValues = {
        courierName: "",
        courierCode: "",
    }
    const initialFormErrorsValues = {
        courierNameError: false,
        courierCodeError: false,
    }
    const formReducer = (state, event) => {
        return { ...state, ...event };
    }
    const formErrorsReducer = (state, event) => {
        return { ...state, ...event };
    }

    const [formData, setFormData] = useReducer(formReducer, initialFormValues);
    const [formErrorsData, setFormErrorsData] = useReducer(formErrorsReducer, initialFormErrorsValues);
    const { courierName, courierCode, } = formData;
    const { courierNameError, courierCodeError, } = formErrorsData;
    const history = useHistory();
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
                const courierData = getCourierResponse.courier[0];
                setFormData({
                    courierName: courierData.courier_name,
                    courierCode: courierData.courier_code,
                });
                document.getElementById('app-loader-container').style.display = "none";
            }

        }
    }


    const onFormSubmit = async (event) => {
        event.preventDefault();  //imp
        let formValidationsPassedCheck = true;

        if (!courierName || !courierCode) {
            formValidationsPassedCheck = false;
            if (!courierName) {
                setFormErrorsData({
                    courierNameError: true,
                });
            }
            if (!courierCode) {
                setFormErrorsData({
                    courierCodeError: true,
                });
            }
        }

        if (formValidationsPassedCheck) {

            if (buttonDisabled === false) {
                setButtonDisabled(true);
            }

            document.getElementById('app-loader-container').style.display = "block";
            const courierEditResponse = await CouriersApiUtil.editCourier(courier_id,
                courierName, courierCode);

            console.log('courierEditResponse:', courierEditResponse);
            if (courierEditResponse.hasError) {
                console.log('Cant Edit Courier -> ', courierEditResponse.errorMessage);
                setButtonDisabled(false);
                document.getElementById('app-loader-container').style.display = "none";
                showAlertUi(true, courierEditResponse.errorMessage);  //imp
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


    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({ [name]: value });

        let inputErrorKey = `${name}Error`;  //imp
        setFormErrorsData({
            [inputErrorKey]: false,
        });

    }

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
            <div className="page__back_btn"></div>

            <div className="page__top">
                <SwitchOutlet />
                <ButtonBack text="Back to Couriers" link="/couriers" />
            </div>

            <PageTitle title="Edit Courier" />

            <div className="page__body">
                <section className="page__header header-button-float">
                    <CustomButtonWithIcon
                        size="small"
                        isPrimary={true}
                        text="Edit"
                        disabled={buttonDisabled}
                        onClick={onFormSubmit}
                    />
                </section>

                <section className="page__content">
                    <form className="form">
                        <div className="form__row">
                            <div className="form__input">
                                <Input
                                    className="primary required"
                                    inputProps={{
                                        disabled: false,
                                        onChange: handleFormChange,
                                        name: "courierName",
                                        value: courierName,
                                    }}
                                    label="*Courier Name"
                                    errorMessage="Field Is Required"
                                    error={courierNameError}
                                />
                            </div>
                            <div className="form__input">
                                <Input
                                    className="primary required"
                                    inputProps={{
                                        disabled: false,
                                        onChange: handleFormChange,
                                        name: "courierCode",
                                        value: courierCode,
                                    }}
                                    label="*Courier Code"
                                    errorMessage="Field Is Required"
                                    error={courierCodeError}
                                />
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default EditCourier;
