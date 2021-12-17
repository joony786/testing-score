import React, { useState, useEffect, useReducer } from "react";
import { Input } from "@teamfabric/copilot-ui";
import { useHistory } from "react-router-dom";

// components
import {
  saveDataIntoLocalStorage,
  getDataFromLocalStorage,
} from "../../../../../utils/local-storage/local-store-utils";
import ButtonBack from "../../../../atoms/button_back";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import SwitchOutlet from "../../../../atoms/switch_outlet";
import * as SetupApiUtil from '../../../../../utils/api/setup-api-utils';
import * as Helpers from "../../../../../utils/helpers/scripts";
import Constants from "../../../../../utils/constants/constants";


let loginCacheData = null;


function BrandForm(props) {
  const {
    heading,
    buttonText,
    brandId,
    initialData = {
      name: '',
      key: '',
    },
    isAuth,
  } = props;
  const initialFormValues = {
    name: "",
    key: ""
  }
  const initialFormErrorsValues = {
    nameError: false,
    keyError: false,
  }
  const formReducer = (state, event) => {
    return { ...state, ...event };
  }
  const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
  }
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formData, setFormData] = useReducer(formReducer, initialFormValues);
  const [formErrorsData, setFormErrorsData] = useReducer(formErrorsReducer, initialFormErrorsValues);
  const { name, key } = formData;
  const { nameError, keyError } = formErrorsData;
  const history = useHistory();

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });

    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });

  }

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }
  const onFormSubmit = async (event) => {
    event.preventDefault();  //imp
    let formValidationsPassedCheck = true;
    if (!name) {
      formValidationsPassedCheck = false;
      Object.entries(formData).forEach(([key, val]) => {
        //console.log(key, val);
        if (!val) {
          let inputErrorKey = `${key}Error`;
          setFormErrorsData({
            [inputErrorKey]: true,
          });
        }
      });
    }

    if (formValidationsPassedCheck) {

      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }

      let addBrandPostData = {};
      addBrandPostData.name = name;
      addBrandPostData.key = key;

      document.getElementById('app-loader-container').style.display = "block";
      let addBrandResponse
      if (brandId) {
        const updateBrandPutData = {
          ...addBrandPostData,
        }
        addBrandResponse = await SetupApiUtil.editBrand(brandId, updateBrandPutData);
      } else {
        addBrandResponse = await SetupApiUtil.addBrand(addBrandPostData);
      }

      if (addBrandResponse.hasError) {
        console.log('Cant Add User Role -> ', addBrandResponse.errorMessage);
        setButtonDisabled(false);
        document.getElementById('app-loader-container').style.display = "none";
        showAlertUi(true, addBrandResponse.errorMessage);
      }
      else {
        document.getElementById('app-loader-container').style.display = "none";
        if(!isAuth && loginCacheData ) {
          loginCacheData.brand_id = addBrandResponse?.brand_id;
          loginCacheData.brand_name = addBrandPostData && addBrandPostData?.name;
          if(loginCacheData?.brand_onboarding) {
            delete loginCacheData['brand_onboarding'];
          }
          loginCacheData.outlet_onboarding = true;
          saveDataIntoLocalStorage(Constants.USER_DETAILS_KEY, loginCacheData);
          setTimeout(() => {
            history.push({
              pathname: '/unAuth/outlets/add',
            });
          }, 500);
        }
        else {
          setTimeout(() => {
            history.push({
              pathname: '/setup/brands',
              activeKey: 'brands'
            });
          }, 500);
        }

      }
    }

  };
  useEffect(() => {
    if (brandId && initialData) {
      setFormData({
        name: initialData?.brand_name,
        key: initialData?.key
      })
    }

    let readFromLocalStorage = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;
    loginCacheData = readFromLocalStorage;


  }, [brandId, initialData])
  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        {isAuth && <ButtonBack text="Back to Brands" link="/setup/brands" />}
        {!isAuth && <ButtonBack text="Back to Brands" link="/brands" />}
        
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">{heading}</h1>
          <CustomButtonWithIcon
            size="small"
            isPrimary={true}
            text={buttonText}
            disabled={buttonDisabled}
            onClick={onFormSubmit}
          />
        </section>

        <section className="page__content">
          <form className="form">
            <fieldset className="form__fieldset">
              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="primary required"
                    inputProps={{
                      onChange: handleFormChange,
                      name: "key",
                      value: key,
                    }}
                    label="*Key"
                    errorMessage="Field Is Required"
                    error={keyError}
                    label="Key"
                  />
                </div>

                <div className="form__input">
                  <Input
                    className="primary required"
                    inputProps={{
                      onChange: handleFormChange,
                      name: "name",
                      value: name,
                    }}
                    label="*Brand Name"
                    errorMessage="Field Is Required"
                    error={nameError}
                    label="Brand Name"
                  />
                </div>
              </div>
            </fieldset>
          </form>
        </section>
      </div>
    </div>
  );
}

export default BrandForm;
