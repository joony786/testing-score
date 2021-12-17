import React, { useState, useEffect, } from "react";
import { ButtonWithIcon } from "@teamfabric/copilot-ui";
import { Link, useHistory } from "react-router-dom";

// components
import ButtonBack from "../../../atoms/button_back";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import SwitchOutlet from "../../../atoms/switch_outlet";
import * as CustomersApiUtil from '../../../../utils/api/customer-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import * as PermissionsHelpers from "../../../../utils/helpers/check-user-permission";
import Permissions from "../../../../utils/constants/user-permissions";



function CustomerProfile(props) {
  const history = useHistory();
  const { match = {} } = props;
  const { customer_id = {} } = match.params;
  const [customerData, setCustomerData] = useState(null);

  const moduleEditCheck = PermissionsHelpers.checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.CUSTOMERS);
  const moduleDeleteCheck = PermissionsHelpers.checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.CUSTOMERS);


  let mounted = true;


  useEffect(() => {
    window.scrollTo(0, 0);
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


  const onPayAcccountBalanceClick = (e) => {
    e.preventDefault();
    history.push(`/customers/${customer_id}/pay-account-balance`);
  };

  const onCustomerCreditHistoryClick = (e) => {
    e.preventDefault();
    history.push(`/customers/${customer_id}/credit-history`);
  };




  return (

    <div className="page customer_profile">
      <div className="page__back_btn"></div>

      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Customers" link="/customers" />
      </div>

      <div className="page__body">
        <div className="page__header">
          <h1 className="heading heading--primary">Customer Profile</h1>

          <div className="page__buttons">
            <CustomButtonWithIcon
              size="small"
              isPrimary={false}
              disabled={!moduleEditCheck}
              theme="light"
              emphasis="low"
              text="Edit"
              icon="Edit"
              onClick={() => {
                history.push(`/customers/${customer_id}/edit`);
              }}
            />

            <CustomButtonWithIcon
              size="small"
              isPrimary={false}
              disabled={!moduleDeleteCheck}
              theme="light"
              emphasis="low"
              text="Delete"
              icon="Delete"
              onClick={() => {
                history.push(`/customers/${customer_id}/delete`);
              }}
            />
          </div>
        </div>


        <section className="page__content customer-profile ">
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

          <div className="customer_history">
            <Link to="/customer_credit_history">
              <ButtonWithIcon
                iconPosition="left"
                onClick={onCustomerCreditHistoryClick}
                text="View Credit History"
              />
            </Link>

            <Link to="/customer_pay_balance">
              <ButtonWithIcon
                iconPosition="left"
                onClick={onPayAcccountBalanceClick}
                text="Pay Account Balance"
              />
            </Link>
          </div>
        </section>
      </div>
    </div>

  );
}

export default CustomerProfile;
