import React, { useState, useEffect, useReducer } from "react";
import { Input } from "@teamfabric/copilot-ui";
import { useHistory } from "react-router-dom";

// components
import ButtonBack from "../../../atoms/button_back";
import * as TaxApiUtil from '../../../../utils/api/tax-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import SwitchOutlet from "../../../atoms/switch_outlet";



function AddTax() {

  const initialFormValues = {
    taxName: "",
    taxPercentage: "",
  }
  const initialFormErrorsValues = {
    taxNameError: false,
    taxPercentageError: false,
  }
  const formReducer = (state, event) => {
    return { ...state, ...event };
  }
  const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
  }

  const [formData, setFormData] = useReducer(formReducer, initialFormValues);
  const [formErrorsData, setFormErrorsData] = useReducer(formErrorsReducer, initialFormErrorsValues);
  const { taxName, taxPercentage, } = formData;
  const { taxNameError, taxPercentageError, } = formErrorsData;
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);


  let mounted = true;

  useEffect(() => {
    return () => {
      mounted = false;
    }
  }, []);


  const onFormSubmit = async (event) => {
    event.preventDefault();  //imp
    let formValidationsPassedCheck = true;
    if (!taxName || !taxPercentage) {
      formValidationsPassedCheck = false;
      Object.entries(formData).forEach(([key, val]) => {
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
      document.getElementById('app-loader-container').style.display = "block";
      const TaxAddResponse = await TaxApiUtil.addTax(
        taxName,
        taxPercentage
      );
      if (TaxAddResponse.hasError) {
        setButtonDisabled(false);
        document.getElementById('app-loader-container').style.display = "none";
        showAlertUi(true, TaxAddResponse.errorMessage);

      } else if(TaxAddResponse.message === "tax name already exist") {
        setButtonDisabled(false);
        document.getElementById('app-loader-container').style.display = "none";
        showAlertUi(true, TaxAddResponse.message);
      }else {
        if (mounted) {     //imp if unmounted
          document.getElementById('app-loader-container').style.display = "none";
          setTimeout(() => {
            history.push({
              pathname: "/taxes",
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

    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });

  }


  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Taxes" link="/taxes" />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">New Tax</h1>

          <CustomButtonWithIcon
            size="small"
            isPrimary={true}
            text="Save"
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
                    name: "taxName",
                    value: taxName,
                  }}
                  label="*Tax Name"
                  errorMessage="Field Is Required"
                  error={taxNameError}
                />
              </div>
              <div className="form__input">
                <Input
                  className="primary required"
                  inputProps={{
                    disabled: false,
                    onChange: handleFormChange,
                    name: "taxPercentage",
                    value: taxPercentage,
                    type: 'text',
                  }}
                  maskOptions={{
                    regex: '[0-9]*'
                  }}
                  label="*Tax Percentage"
                  errorMessage="Field Is Required"
                  error={taxPercentageError}
                />
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AddTax;
