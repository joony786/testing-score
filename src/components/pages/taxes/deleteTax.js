import React, { useState, useEffect, } from "react";
import { Button } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../atoms/button_back";
import * as TaxApiUtil from '../../../utils/api/tax-api-utils';
import * as Helpers from "../../../utils/helpers/scripts";
import PageTitle from "../../organism/header";
import SwitchOutlet from "../../atoms/switch_outlet";
import { useHistory } from "react-router-dom";



function DeleteTax(props) {
    const history = useHistory();
    const [selectedTaxData, setSelectedTaxData] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { tax_id = {} } = match !== undefined && match.params;

    let mounted = true;
    useEffect(() => {
        window.scrollTo(0, 0);
        if (tax_id !== undefined) { getTax(tax_id); }
        else {
            return popPage();
        }

        return () => {
            mounted = false;
        }

    }, []);
    const getTax = async (taxId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const gettaxResponse = await TaxApiUtil.getTax(taxId);
        if (gettaxResponse.hasError) {
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, gettaxResponse.errorMessage);
            return delayPopPage();
        }
        else {
            if (mounted) {     //imp if unmounted
                const taxData = gettaxResponse.data;  //vvimp
                setSelectedTaxData(taxData);
                document.getElementById('app-loader-container').style.display = "none";
            }
        }
    }



    const onFormSubmit = async (event) => {
        event.preventDefault();
        let formValidationsPassedCheck = true;

        if (!selectedTaxData) {
            formValidationsPassedCheck = false;
        }

        if (formValidationsPassedCheck) {

            if (buttonDisabled === false) {
                setButtonDisabled(true);
            }

            document.getElementById('app-loader-container').style.display = "block";
            const taxDeleteResponse = await TaxApiUtil.deleteTax(tax_id);
            if (taxDeleteResponse.hasError) {
                setButtonDisabled(false);
                document.getElementById('app-loader-container').style.display = "none";
                showAlertUi(true, taxDeleteResponse.errorMessage);
            }
            else {
                if (mounted) {     //imp if unmounted
                    document.getElementById('app-loader-container').style.display = "none";
                    setTimeout(() => {
                        history.push({
                            pathname: '/taxes',
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
            pathname: '/taxes',
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
                <ButtonBack text="Back to Taxes" link="/taxes" />
            </div>

            <PageTitle title="Delete Taxes" />
            <div className="page__body">
                <section className="page__content">
                    <form className="form" onSubmit={onFormSubmit}>
                        <fieldset className="form__fieldset">
                            <div className="form__row">
                                <div className="item-delete-content">
                                    Do you really want to delete '{
                                        selectedTaxData && selectedTaxData.name}'?
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

export default DeleteTax;
