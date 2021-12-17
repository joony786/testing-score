import React from "react";
import BrandForm from '../common/brand-form';

function AddBrand(props) {
    const {isAuth = true} = props;

    return (
        <BrandForm heading="Add Brand" buttonText="Add" isAuth={isAuth} />
    );
}

export default AddBrand;
