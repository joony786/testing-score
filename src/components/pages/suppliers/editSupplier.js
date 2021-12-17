import React, { useState, useEffect, useReducer } from "react";
import { Input } from "@teamfabric/copilot-ui";
import { useHistory } from "react-router-dom";

// components
import ButtonBack from "../../atoms/button_back";
import * as SuppliersApiUtil from "../../../utils/api/suppliers-api-utils";
import * as Helpers from "../../../utils/helpers/scripts";
import CustomButtonWithIcon from "../../atoms/button_with_icon";
import SwitchOutlet from "../../atoms/switch_outlet";



function EditSupplier(props) {
  const initialFormValues = {
    supplierName: "",
    supplierContactPersonName: "",
    supplierEmail: "",
    supplierPhone: "",
    supplierTaxId: "",
  };
  const initialFormErrorsValues = {
    supplierNameError: false,
    supplierContactPersonNameError: false,
    supplierEmailError: false,
    supplierPhoneError: false,
    supplierTaxIdError: false,
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
  const {
    supplierName,
    supplierContactPersonName,
    supplierEmail,
    supplierPhone,
    supplierTaxId,
  } = formData;
  const {
    supplierNameError,
    supplierContactPersonNameError,
    supplierEmailError,
    supplierPhoneError,
    supplierTaxIdError,
  } = formErrorsData;
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const { match = {} } = props;
  const { supplier_id = {} } = match !== undefined && match.params;

  let mounted = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (supplier_id !== undefined) {
      getSupplier(supplier_id);
    } else {
      return popPage();
    }

    return () => {
      mounted = false;
    };
  }, []);

  const getSupplier = async (supplierId) => {
    document.getElementById("app-loader-container").style.display = "block";
    const getSupplierResponse = await SuppliersApiUtil.getSupplier(supplierId);
    console.log("getSupplierResponse:", getSupplierResponse);
    if (getSupplierResponse.hasError) {
      console.log(
        "Supplier Cant Fetched -> ",
        getSupplierResponse.errorMessage
      );
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, getSupplierResponse.errorMessage);
      return delayPopPage();
    } else {
      if (mounted) {
        //imp if unmounted
        const supplierData = getSupplierResponse.suppliers.data[0]; //vvimp
        setFormData({
          supplierName: supplierData.name,
          supplierContactPersonName: supplierData.contact_name,
          supplierPhone: supplierData.phone,
          supplierEmail: supplierData.email,
          supplierTaxId: supplierData.tax_number || "",
        });
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault(); //imp
    let formValidationsPassedCheck = true;

    if (supplierEmail) {
      let valid = Helpers.validateEmail(supplierEmail);
      if (!valid) {
        formValidationsPassedCheck = false;
      }
    }

    if (
      !supplierName ||
      !supplierContactPersonName ||
      !supplierEmail ||
      !supplierPhone
    ) {
      formValidationsPassedCheck = false;
      Object.entries(formData).forEach(([key, val]) => {
        console.log(key, val);
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
      const supplierEditResponse = await SuppliersApiUtil.editSupplier(
        supplier_id,
        supplierName,
        supplierContactPersonName,
        supplierPhone,
        supplierEmail,
        supplierTaxId
      );

      console.log("supplierEditResponse:", supplierEditResponse);
      if (supplierEditResponse.hasError) {
        console.log(
          "Cant Edit Supplier -> ",
          supplierEditResponse.errorMessage
        );
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, supplierEditResponse.errorMessage); //imp
      } else {
        if (mounted) {
          //imp if unmounted
          document.getElementById("app-loader-container").style.display =
            "none";
          setTimeout(() => {
            history.push({
              pathname: "/suppliers",
            });
          }, 500);
        }
      }
    }
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const validateEmailInput = (email) => {
    let validEmailCheck = Helpers.validateEmail(email);
    //console.log(validEmailCheck);
    if (validEmailCheck || !email) {
      //imp
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });

    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });

    if (name === "supplierEmail") {
      validateEmailInput(value);
    }
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
        <ButtonBack text="Back to Suppliers" link="/suppliers" />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">Edit Supplier</h1>

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
              <Input
                className="primary form__input required"
                inputProps={{
                  disabled: false,
                  onChange: handleFormChange,
                  name: "supplierName",
                  value: supplierName,
                }}
                label="*Supplier Name"
                errorMessage="Field Is Required"
                error={supplierNameError}
              />

              <Input
                className="primary form__input required"
                inputProps={{
                  disabled: false,
                  onChange: handleFormChange,
                  name: "supplierContactPersonName",
                  value: supplierContactPersonName,
                }}
                label="*Contact Person Name"
                errorMessage="Field Is Required"
                error={supplierContactPersonNameError}
              />
            </div>

            <div className="form__row">
              <Input
                className="primary form__input required"
                inputProps={{
                  type: "text",
                  disabled: false,
                  onChange: handleFormChange,
                  name: "supplierEmail",
                  value: supplierEmail,
                }}
                label="*Email Address"
                errorMessage={
                  supplierEmailError
                    ? "Field Is Required"
                    : !validEmail
                    ? "Please Input Valid Email"
                    : ""
                }
                error={supplierEmailError || !validEmail ? true : false}
              />
              <Input
                className="primary form__input required"
                inputProps={{
                  disabled: false,
                  onChange: handleFormChange,
                  name: "supplierPhone",
                  value: supplierPhone,
                }}
                maskOptions={{
                  regex: "[0-9]*",
                }}
                label="*Phone Number"
                errorMessage="Field Is Required"
                error={supplierPhoneError}
              />
            </div>

            <div className="form__row u_width_50">
              <Input
                className="primary form__input required"
                inputProps={{
                  disabled: false,
                  onChange: handleFormChange,
                  name: "supplierTaxId",
                  value: supplierTaxId,
                }}
                maskOptions={{
                  regex: "[0-9]*",
                }}
                label="Tax Number"
                //errorMessage="Field Is Required"
                //error={supplierTaxIdError}
              />
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default EditSupplier;
