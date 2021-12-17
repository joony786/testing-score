import React, { useState, useReducer, useRef } from "react";
import { Input, Snackbar } from "@teamfabric/copilot-ui";
import * as WebOrdersApiUtil from "../../../../../utils/api/web-orders-api-utils";
import * as Helpers from "../../../../../utils/helpers/scripts";
import DynamicModal from "../../../../atoms/modal";

const CreateCustomerModal = (props) => {
  const {
    handleCreateCustomer,
    setCustomerSearchValue,
    setCustomerDropDown,
    setCreateCustomerModal,
    setSelectedCustomerData,
  } = props;
  const initialCustomerFormValues = {
    first: "",
    middle: "",
    last: "",
    email: "",
  };
  const initialCustomerFormErrorsValues = {
    firstError: false,
    lastError: false,
    emailError: false,
  };
  const formReducer = (state, event) => {
    return { ...state, ...event };
  };
  const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
  };
  const [formData, setFormData] = useReducer(
    formReducer,
    initialCustomerFormValues
  );
  const [formErrorsData, setFormErrorsData] = useReducer(
    formErrorsReducer,
    initialCustomerFormErrorsValues
  );
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { first, middle, last, email } = formData;
  const { firstError, lastError, emailError } = formErrorsData;
  // Web Orders Component Work //
  const handleChangeCreateCustomer = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });

    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });
    if (name === "email") {
      validateEmailInput(value);
    }
  };
  const validateEmailInput = (email) => {
    let validEmailCheck = Helpers.validateEmail(email);
    if (validEmailCheck || !email) {
      //imp
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };
  const onCreateCustomer = async (event) => {
    event.preventDefault(); //imp
    let formValidationsPassedCheck = true;
    Object.entries(formData).forEach(([key, val]) => {
      if (!val && key !== "middle") {
        let inputErrorKey = `${key}Error`;
        setFormErrorsData({
          [inputErrorKey]: true,
        });
        formValidationsPassedCheck = false;
      }
    });

    if (formValidationsPassedCheck) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }

      let addCustomerPostData = {};
      addCustomerPostData.user = {
        name: {
          first,
          middle,
          last,
        },
      };
      addCustomerPostData.registrationSite = "local";
      addCustomerPostData.user.email = email;
      document.getElementById("app-loader-container").style.display = "block";
      let addCustomerResponse = await WebOrdersApiUtil.createCustomer(
        addCustomerPostData
      );
      if (!addCustomerResponse.success) {
        const errorMessage =
          addCustomerResponse?.errorMessage ||
          addCustomerResponse?.data?.message;
        console.log("Cant Add Customer -> ", errorMessage);
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, errorMessage);
        setShowError(true);
        setErrorMessage(errorMessage);
        setTimeout(() => {
          setShowError(false);
          setErrorMessage("");
        }, 2000);
      } else {
        document.getElementById("app-loader-container").style.display = "none";
        setCustomerDropDown(false);
        setCreateCustomerModal(false);
        console.log("addCustomerResponse", addCustomerResponse);
        const customerResData = addCustomerResponse?.data;
        const customerData = {
          _id: customerResData.id,
          address: [],
          fullName: `${customerResData?.name?.first} ${customerResData?.name?.middle} ${customerResData?.name?.last}`,
          isActive: { status: true },
          phone: [],
          email: email,
        };
        setSelectedCustomerData(customerData);
        setCustomerSearchValue(customerData?.fullName);
      }
    }
  };
  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };
  const CreateCustomerForm = () => {
    return (
      <div className="page sell">
        <h2 style={{ marginBottom: "3rem" }}>Create New Customer</h2>
        <section className="customer">
          <Snackbar
            dismissable
            height="60px"
            kind="alert"
            label={errorMessage}
            onDismiss={() => {
              setErrorMessage("");
              setShowError(false);
            }}
            show={showError}
            width="600px"
            withIcon
          />
          <div className="form">
            <div className="form__row">
              <Input
                className="primary"
                inputProps={{
                  disabled: false,
                  name: "first",
                  value: first,
                  onChange: handleChangeCreateCustomer,
                }}
                label="*First Name"
                errorMessage="Field Is Required"
                error={firstError}
              />
              <Input
                className="primary"
                inputProps={{
                  disabled: false,
                  value: middle,
                  name: "middle",
                  onChange: handleChangeCreateCustomer,
                }}
                label="Middle Name"
              />
            </div>
            <div className="form__row">
              <Input
                className="primary"
                inputProps={{
                  type: "email",
                  disabled: false,
                  value: last,
                  name: "last",
                  onChange: handleChangeCreateCustomer,
                }}
                label="*Last Name"
                errorMessage="Field Is Required"
                error={lastError}
              />
              <Input
                className="primary"
                inputProps={{
                  disabled: false,
                  value: email,
                  name: "email",
                  onChange: handleChangeCreateCustomer,
                }}
                label="*Email"
                errorMessage={
                  emailError
                    ? "Field Is Required"
                    : !validEmail
                    ? "Please Input Valid Email"
                    : ""
                }
                error={emailError || !validEmail ? true : false}
              />
            </div>
          </div>
        </section>
      </div>
    );
  };
  return (
    <DynamicModal
      heading="Create New Customer"
      size="medium"
      isCancelButton={true}
      isConfirmButton={true}
      onCancel={handleCreateCustomer}
      renderModalContent={CreateCustomerForm}
      onConfirm={onCreateCustomer}
    />
  );
};

export default CreateCustomerModal;
