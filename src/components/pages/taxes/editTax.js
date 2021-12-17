import React, { useState, useEffect, useReducer } from "react";
import { Input } from "@teamfabric/copilot-ui";
import { useHistory } from "react-router-dom";

// components
import ButtonBack from "../../atoms/button_back";
import * as TaxApiUtil from "../../../utils/api/tax-api-utils";
import * as Helpers from "../../../utils/helpers/scripts";
import CustomButtonWithIcon from "../../atoms/button_with_icon";
import SwitchOutlet from "../../atoms/switch_outlet";

function EditTax(props) {
  const initialFormValues = {
    taxName: "",
    taxPercentage: "",
  };
  const initialFormErrorsValues = {
    taxNameError: false,
    taxPercentageError: false,
  };
  const formReducer = (state, event) => {
    return { ...state, ...event };
  };
  const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
  };

  const [formData, setFormData] = useReducer(formReducer, initialFormValues);
  const [formErrorsData, setFormErrorsData] = useReducer(
    formErrorsReducer,
    initialFormErrorsValues
  );
  const { taxName, taxPercentage } = formData;
  const { taxNameError, taxPercentageError } = formErrorsData;
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { match = {} } = props;
  const { tax_id = {} } = match !== undefined && match.params;

  let mounted = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (tax_id !== undefined) {
      getTax(tax_id);
    } else {
      return popPage();
    }
    return () => {
      mounted = false;
    };
  }, []);

  const getTax = async (taxId) => {
    document.getElementById("app-loader-container").style.display = "block";
    const gettaxResponse = await TaxApiUtil.getTax(taxId);
    if (gettaxResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, gettaxResponse.errorMessage);
      return delayPopPage();
    } else {
      if (mounted) {
        //imp if unmounted
        const taxData = gettaxResponse.data; //vvimp
        setFormData({
          taxName: taxData.name,
          taxPercentage: taxData.value,
        });
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault(); //imp
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

      document.getElementById("app-loader-container").style.display = "block";
      const taxEditResponse = await TaxApiUtil.editTax(
        tax_id,
        taxName,
        taxPercentage
      );
      if (taxEditResponse.hasError) {
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, taxEditResponse.errorMessage);
      }else if(taxEditResponse.message === "tax name already exist") {
        setButtonDisabled(false);
        document.getElementById('app-loader-container').style.display = "none";
        showAlertUi(true, taxEditResponse.message);
      }else {
        if (mounted) {
          //imp if unmounted
          document.getElementById("app-loader-container").style.display =
            "none";
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
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });

    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
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

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">Edit Tax</h1>
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

export default EditTax;
