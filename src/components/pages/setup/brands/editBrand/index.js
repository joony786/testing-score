import React, { useState, useEffect, useReducer } from "react";
import BrandForm from '../common/brand-form';
import * as SetupApiUtil from '../../../../../utils/api/setup-api-utils';
import * as Helpers from "../../../../../utils/helpers/scripts";
import { useHistory } from "react-router-dom";

function EditBrand(props) {
    const { match = {} } = props;
    const { brand_id = {} } = match !== undefined && match.params;
    const [brandData, setBrandData] = useState([])
    const history = useHistory();
    let mounted = true;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (brand_id !== undefined) {
            fetchBrandData(brand_id);
        }
        else {
            return popPage();
        }

        return () => {
            mounted = false;
        }

    }, []);

    const fetchBrandData = async (brandId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getBrandResponse = await SetupApiUtil.getBrandById(brandId);
        if (getBrandResponse.hasError) {
            console.log('Cant fetch Outlets Data -> ', getBrandResponse.errorMessage);
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, getBrandResponse.errorMessage);
        }
        else {
            setBrandData(getBrandResponse.brands);
            document.getElementById('app-loader-container').style.display = "none";

        }
    }
    const showAlertUi = (show, errorText) => {
        Helpers.showAppAlertUiContent(show, errorText);
    }

    const popPage = () => {
        history.goBack();
    };
    return (
        <BrandForm
            heading="Edit Brand"
            buttonText="Update"
            brandId={brand_id}
            initialData={brandData}
        />
    );
}

export default EditBrand;
