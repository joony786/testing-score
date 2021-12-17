import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

// components
import ButtonBack from "../../../atoms/button_back";
import * as CustomersApiUtil from "../../../../utils/api/customer-api-utils";
import SwitchOutlet from "../../../atoms/switch_outlet";
import Timeline from "../../../molecules/timeline";
import * as Helpers from "../../../../utils/helpers/scripts";


function CustomerHistory(props) {
  const [customerData, setCustomerData] = useState(null);
  const [creditsHistory, setCreditsHistory] = useState([]);

  const { match = {} } = props;
  const { customer_id = {} } = match.params;

  const history = useHistory();

  const popPage = () => {
    history.goBack();
  };

  const fetchCustomerCreditHistory = async (customerId) => {
    if (!customerId) {
      return popPage();
    }
    document.getElementById("app-loader-container").style.display = "block";
    const customerCreditHistoryResponse =
      await CustomersApiUtil.customerCreditDetails(customerId);
    if (customerCreditHistoryResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, customerCreditHistoryResponse.errorMessage);
      return popPage();
    }
    const customerData = customerCreditHistoryResponse.customer;
    const creditsHistoryData = customerCreditHistoryResponse.history;

    if (!customerData) {
      //message.error('Customer not found');
      //return popPage();
    } else if (!creditsHistoryData) {
      //message.error('Credits history data not found');
      //return popPage();
    }
    setCustomerData(customerData);
    setCreditsHistory(creditsHistoryData);
    document.getElementById("app-loader-container").style.display = "none";
  };


  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }

  useEffect(() => {
    fetchCustomerCreditHistory(customer_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer_id]);

  return (
    <div className="page cc_history">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack
          text="Back to Customer Profile"
          link={`/customers/${customer_id}/view`}
        />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">Customer Credit History</h1>
        </section>

        <section className="page__content">
          <Timeline
            creditsHistory={creditsHistory}
            customerData={customerData}
          />
        </section>
      </div>
    </div>
  );
}

export default CustomerHistory;
