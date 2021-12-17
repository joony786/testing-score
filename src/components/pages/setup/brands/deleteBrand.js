import React, { useState, useEffect, } from "react";
import { Button } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../../atoms/button_back";
import * as SetupApiUtil from '../../../../utils/api/setup-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import PageTitle from "../../../organism/header";
import SwitchOutlet from "../../../atoms/switch_outlet";
import { useHistory } from "react-router-dom";



function DeleteBrand(props) {
    const history = useHistory();
    const [selectedBrandName, setSelectedBrandName] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { brand_id = {} } = match !== undefined && match.params;


    let mounted = true;


    useEffect(() => {
        window.scrollTo(0, 0);
        if (brand_id !== undefined) { getBrandData(brand_id); }
        else {
            return popPage();
        }

        return () => {
            mounted = false;
        }

    }, []);


    const getBrandData = async (brandId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getBrandResponse = await SetupApiUtil.getBrandById(brandId);
        console.log('getRoleResponse:', getBrandResponse);
        if (getBrandResponse.hasError) {
            console.log('getCategory Cant Fetched -> ', getBrandResponse.errorMessage);
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, getBrandResponse.errorMessage);  //imp
            return delayPopPage();
        }
        else {
            if (mounted) {     //imp if unmounted
                let brandName = getBrandResponse?.brands[0]?.brand_name //vvimp
                setSelectedBrandName(brandName);
                document.getElementById('app-loader-container').style.display = "none";
            }

        }
    }


    const onFormSubmit = async (event) => {
        event.preventDefault();  //imp to use here
        let formValidationsPassedCheck = true;

        if (!selectedBrandName) {
            formValidationsPassedCheck = false;
        }

        if (formValidationsPassedCheck) {

            if (buttonDisabled === false) {
                setButtonDisabled(true);
            }

            document.getElementById('app-loader-container').style.display = "block";
            const brandDeleteResponse = await SetupApiUtil.deleteBrand(brand_id);
            console.log('brandDeleteResponse:', brandDeleteResponse);

            if (brandDeleteResponse.hasError) {
                console.log('Cant delete a User Role -> ', brandDeleteResponse.errorMessage);
                setButtonDisabled(false);
                document.getElementById('app-loader-container').style.display = "none";
                showAlertUi(true, brandDeleteResponse.errorMessage);  //imp
            }
            else {
                if (mounted) {     //imp if unmounted
                    document.getElementById('app-loader-container').style.display = "none";
                    setTimeout(() => {
                        history.push({
                            pathname: '/setup/brands',
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
            pathname: '/setup/brands',
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
                <ButtonBack text="Back to Brands" link="/setup/brands" />
            </div>

            <PageTitle title="Delete Brand" />
            <div className="page__body">
                <section className="page__content">
                    <form className="form" onSubmit={onFormSubmit}>
                        <fieldset className="form__fieldset">
                            <div className="form__row">
                                <div className="item-delete-content">
                                    Do you really want to delete '{
                                        selectedBrandName && selectedBrandName}'?
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

export default DeleteBrand;
