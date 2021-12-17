import React, { useState, useEffect, useReducer } from "react";
import { Input, Dropdown } from "@teamfabric/copilot-ui";
import { useHistory } from "react-router-dom";

// components
import ButtonBack from "../../../atoms/button_back";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import SwitchOutlet from "../../../atoms/switch_outlet";
import * as CustomersApiUtil from '../../../../utils/api/customer-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";



function CustomerPayBalance(props) {

  const initialFormValues = {
    customerPayAmount: "",
    customerPaymentMethod: "",
  }
  const initialFormErrorsValues = {
    customerPayAmountError: false,
    customerPaymentMethodError: false,
  }
  const formReducer = (state, event) => {
    return { ...state, ...event };
  }
  const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
  }

  const [formData, setFormData] = useReducer(formReducer, initialFormValues);
  const [formErrorsData, setFormErrorsData] = useReducer(formErrorsReducer, initialFormErrorsValues);
  const {
    customerPayAmount,
    customerPaymentMethod,
  } = formData;
  const {
    customerPayAmountError,
    customerPaymentMethodError,
  } = formErrorsData;
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { match = {} } = props;
  const { customer_id = {} } = match.params;
  const [customerData, setCustomerData] = useState(null);
  const [customerGender, setCustomerGender] = useState({});


  let mounted = true;


  useEffect(() => {
    if (customer_id !== undefined) { fetchSingleCustomerData(customer_id); }
    else {
      return popPage();
    }

    return () => {
      mounted = false;
    }

  }, []);



  const fetchSingleCustomerData = async (customerId) => {
    if (!customerId) {
      return popPage();
    }

    document.getElementById('app-loader-container').style.display = "block";
    const singleCustomerDataResponse = await CustomersApiUtil.getSingleCustomer(customerId);
    if (singleCustomerDataResponse.hasError) {
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, singleCustomerDataResponse.errorMessage);
      return delayPopPage();
    }
    const customerData = singleCustomerDataResponse.customer[0];
    const mappedCustomerResponse = {
      balance: customerData.balance,
      email: customerData.email,
      name: customerData.name,
      phone: customerData.phone,
      gender: customerData.gender || "",
      id: customerData.id,
    };
    setCustomerData(mappedCustomerResponse);
    document.getElementById('app-loader-container').style.display = "none";

  };


  const onNewBalanceSubmitted = async (event) => {
    event.preventDefault();  //imp
    let formValidationsPassedCheck = true;

    if (!customerPayAmount
      || !customerPaymentMethod
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

      const paymentInfo = {
        type: customerPaymentMethod,
        amount: customerPayAmount,
      };

      document.getElementById('app-loader-container').style.display = "block";
      const customerRechargeResponse = await CustomersApiUtil.rechargeCustomerAccount(
        customerData,
        paymentInfo
      );

      if (customerRechargeResponse.hasError) {
        setButtonDisabled(false);
        document.getElementById('app-loader-container').style.display = "none";
        showAlertUi(true, customerRechargeResponse.errorMessage);
        return;
      }

      document.getElementById('app-loader-container').style.display = "none";
      setTimeout(() => {
        popPage();
      }, 500);

    }

  };



  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }


  const popPage = () => {
    history.goBack();
  };

  const delayPopPage = () => {
    setTimeout(() => {
      history.goBack();
    }, 2000);
  };


  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });

    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });

  }


  const handlePaymentMethodSelect = (listItem) => {
    //console.log(listItem);  //imp
    setFormData({ customerPaymentMethod: listItem.value });
    setCustomerGender({ ...listItem });
    setFormErrorsData({
      customerPaymentMethodError: false,
    });
  }




  return (

    <div className="page customer_profile">
      <div className="page__back_btn"></div>

      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Customer Profile" link={`/customers/${customer_id}/view`} />
      </div>


      <div className="page__body">
        <div className="page__header">
          <h1 className="heading heading--primary">Pay Account Balance</h1>

          <div className="page__buttons">
            <CustomButtonWithIcon
              size="small"
              isPrimary={false}
              theme="light"
              emphasis="low"
              text="Cancel"
              onClick={popPage}
            />

            <CustomButtonWithIcon
              size="small"
              isPrimary={true}
              theme="light"
              emphasis="low"
              text="Save"
              onClick={onNewBalanceSubmitted}
            />
          </div>
        </div>


        <section className="page__content customer-pay">
          <div className="customer_info">
            {customerData &&
              <ul>
                <li className="row">
                  <span>Name</span>
                  <span>{customerData.name || ""}</span>
                </li>

                <li className="row">
                  <span>Phone</span>
                  <span>{customerData.phone || ""}</span>
                </li>

                <li className="row">
                  <span>Email</span>
                  <span>{customerData.email || ""}</span>
                </li>

                <li className="row">
                  <span>Gender</span>
                  <span>{customerData.gender || ""}</span>
                </li>

                <li className="row">
                  <span>Balance</span>
                  <span>{customerData.balance ? parseFloat(customerData.balance).toFixed(2) : ""}</span>
                </li>
              </ul>}
          </div>

          <div className="balance_form">
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              <div className="form__row">
                <div className="form__input">
                  <Dropdown
                    className="form-dropdown-required"
                    onSelect={handlePaymentMethodSelect}
                    placeholder="Select Payment Method"  //not working
                    options={[
                      {
                        id: 1,
                        name: "Credit Card",
                        value: "credit card"
                      },
                      {
                        id: 2,
                        name: "Cash",
                        value: "cash"
                      },
                    ]}
                    titleLabel="*Payment Type"
                    value={customerGender}   //not compulsary
                    width="100%"
                    errorMessage="Field Is Required"
                    errorState={customerPaymentMethodError}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="primary required"
                    inputProps={{
                      onChange: handleFormChange,
                      name: "customerPayAmount",
                      value: customerPayAmount,
                      type: 'number',
                    }}
                    label="*Amount"
                    errorMessage="Field Is Required"
                    error={customerPayAmountError}
                  />
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>

  );
}

export default CustomerPayBalance;
