import React, { useState, useEffect, } from "react";
import { Button } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../atoms/button_back";
import * as CustomersApiUtil from '../../../utils/api/customer-api-utils';
import * as Helpers from "../../../utils/helpers/scripts";
import PageTitle from "../../organism/header";
import SwitchOutlet from "../../atoms/switch_outlet";
import { useHistory } from "react-router-dom";



function DeleteCustomer(props) {
    const history = useHistory();
    const [customerData, setCustomerData] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { customer_id = {} } = match !== undefined && match.params;


    let mounted = true;


    useEffect(() => {
        if (customer_id !== undefined) {
            fetchSingleCustomerData(customer_id);
        }
        else {
            return popPage();
        }

        return () => {
            mounted = false;
        }

    }, []);


    const fetchSingleCustomerData = async (customerId) => {
        if (!customerId) {
            return popPage();
        }
        document.getElementById('app-loader-container').style.display = "block";
        const singleCustomerDataResponse = await CustomersApiUtil.getSingleCustomer(customerId);

        if (singleCustomerDataResponse.hasError) {
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, singleCustomerDataResponse.errorMessage);
            return delayPopPage();
        }
        const customerData = singleCustomerDataResponse.customer[0];
        const mappedCustomerResponse = {
            balance: customerData.balance,
            email: customerData.email,
            name: customerData.name,
            phone: customerData.phone,
            gender: customerData.gender || "",
            id: customerData.id,
        };
        setCustomerData(mappedCustomerResponse);
        document.getElementById('app-loader-container').style.display = "none";
    };



    const onFormSubmit = async (event) => {
        event.preventDefault();
        let formValidationsPassedCheck = true;

        if (!customerData) {
            formValidationsPassedCheck = false;
        }

        if (formValidationsPassedCheck) {

            if (buttonDisabled === false) {
                setButtonDisabled(true);
            }

            document.getElementById('app-loader-container').style.display = "block";
            const customerDeleteResponse = await CustomersApiUtil.deleteCustomer(customer_id);
            console.log('customerDeleteResponse:', customerDeleteResponse);

            if (customerDeleteResponse.hasError) {
                console.log('Cant delete Customer -> ', customerDeleteResponse.errorMessage);
                setButtonDisabled(false);
                document.getElementById('app-loader-container').style.display = "none";
                showAlertUi(true, customerDeleteResponse.errorMessage);
            }
            else {
                if (mounted) {     //imp if unmounted
                    document.getElementById('app-loader-container').style.display = "none";
                    setTimeout(() => {
                        history.push({
                            pathname: '/customers',
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
        history.goBack();
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
                <ButtonBack text="Back to Customers" link="/customers" />
            </div>

            <PageTitle title="Delete Customers" />
            <div className="page__body">
                <section className="page__content">
                    <form className="form" onSubmit={onFormSubmit}>
                        <fieldset className="form__fieldset">
                            <div className="form__row">
                                <div className="item-delete-content">
                                    Do you really want to delete '{
                                        customerData && customerData.name}'?
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

export default DeleteCustomer;
