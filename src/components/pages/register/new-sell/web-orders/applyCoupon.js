import React, { useState, useReducer, useRef } from "react";
import { Input, Snackbar } from "@teamfabric/copilot-ui";
import DynamicModal from "../../../../atoms/modal";

const ApplyCoupon = (props) => {
  const { handleToggleCoupon, handleApplyCoupon, setCouponModal } = props;
  const initialCustomerFormValues = {
    coupon: "",
  };
  const initialCustomerFormErrorsValues = {
    couponError: false,
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
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { coupon } = formData;
  const { couponError } = formErrorsData;
  // Web Orders Component Work //
  const handleChangeCoupon = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });

    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });
  };

  const onApplyCoupon = async (event) => {
    event.preventDefault(); //imp
    let formValidationsPassedCheck = true;
    Object.entries(formData).forEach(([key, val]) => {
      if (!val) {
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
      handleApplyCoupon(coupon, setCouponModal);
    }
  };
  const ApplyCouponForm = () => {
    return (
      <div className="page sell">
        <h2 style={{ marginBottom: "3rem" }}>Apply Coupon</h2>
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
            <div className="form__row align-center">
              <Input
                className="primary"
                inputProps={{
                  disabled: false,
                  name: "coupon",
                  value: coupon,
                  onChange: handleChangeCoupon,
                }}
                label="*Coupon"
                errorMessage="Field Is Required"
                error={couponError}
              />
            </div>
          </div>
        </section>
      </div>
    );
  };
  return (
    <DynamicModal
      heading="Apply Coupon"
      size="medium"
      isCancelButton={true}
      isConfirmButton={true}
      onCancel={handleToggleCoupon}
      confirmButtonText="Apply"
      renderModalContent={ApplyCouponForm}
      onConfirm={onApplyCoupon}
    />
  );
};

export default ApplyCoupon;
