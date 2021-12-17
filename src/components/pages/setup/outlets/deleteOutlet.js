import React, { useState, useEffect, } from "react";
import { Button } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../../atoms/button_back";
import * as SetupApiUtil from '../../../../utils/api/setup-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import PageTitle from "../../../organism/header";
import SwitchOutlet from "../../../atoms/switch_outlet";
import { useHistory } from "react-router-dom";



function DeleteRole(props) {
    const history = useHistory();
    const [selectedOutletName, setSelectedOutletName] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { outlet_id = {} } = match !== undefined && match.params;


    let mounted = true;


    useEffect(() => {
        window.scrollTo(0, 0);
        if (outlet_id !== undefined) { getOutletData(outlet_id); }
        else {
            return popPage();
        }

        return () => {
            mounted = false;
        }

    }, []);


    const getOutletData = async (outletId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getOutletResponse = await SetupApiUtil.getOutletById(outletId);
        console.log('getOutletResponse:', getOutletResponse);
        if (getOutletResponse.hasError) {
            console.log('getCategory Cant Fetched -> ', getOutletResponse.errorMessage);
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, getOutletResponse.errorMessage);  //imp
            return delayPopPage();
        }
        else {
            if (mounted) {     //imp if unmounted
                let outletName = getOutletResponse?.store.name //vvimp
                setSelectedOutletName(outletName);
                document.getElementById('app-loader-container').style.display = "none";
            }

        }
    }


    const onFormSubmit = async (event) => {
        event.preventDefault();  //imp to use here
        let formValidationsPassedCheck = true;

        if (!selectedOutletName) {
            formValidationsPassedCheck = false;
        }

        if (formValidationsPassedCheck) {

            if (buttonDisabled === false) {
                setButtonDisabled(true);
            }

            document.getElementById('app-loader-container').style.display = "block";
            const outletDeleteResponse = await SetupApiUtil.deleteOutlet(outlet_id);
            console.log('outletDeleteResponse:', outletDeleteResponse);

            if (outletDeleteResponse.hasError) {
                console.log('Cant delete a User Role -> ', outletDeleteResponse.errorMessage);
                setButtonDisabled(false);
                document.getElementById('app-loader-container').style.display = "none";
                showAlertUi(true, outletDeleteResponse.errorMessage);  //imp
            }
            else {
                if (mounted) {     //imp if unmounted
                    document.getElementById('app-loader-container').style.display = "none";
                    setTimeout(() => {
                        history.push({
                            pathname: '/setup/outlets',
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
            pathname: '/setup/outlets',
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
                <ButtonBack text="Back to Outlets" link="/setup/outlets" />
            </div>

            <PageTitle title="Delete Outlets" />
            <div className="page__body">
                <section className="page__content">
                    <form className="form" onSubmit={onFormSubmit}>
                        <fieldset className="form__fieldset">
                            <div className="form__row">
                                <div className="item-delete-content">
                                    Do you really want to delete '{
                                        selectedOutletName && selectedOutletName}'?
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

export default DeleteRole;
