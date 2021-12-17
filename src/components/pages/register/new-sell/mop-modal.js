import React from "react";
import { Radio } from "@teamfabric/copilot-ui";
const MopModal = (props) => {
  const { setPaymentMethod, paymentMethod, selectedCustomerData } = props;
  const changeMethodOfPayment = (method) => {
    setPaymentMethod(method);
  };
  return (
    <>
      <h2 style={{ marginBottom: "3rem" }}>Select method of payment</h2>

      <Radio
        label="Cash"
        onChange={() => changeMethodOfPayment("Cash")}
        tabIndex={0}
        value="cash"
        className="mops-modal-inner-margin"
        checked={paymentMethod === "Cash" ? true : false}
      />
      <Radio
        label="Credit Card"
        onChange={() => changeMethodOfPayment("Credit Card")}
        tabIndex={1}
        className="mops-modal-inner-margin"
        checked={paymentMethod === "Credit Card" ? true : false}
      />
      <Radio
        label="Online"
        onChange={() => changeMethodOfPayment("Online")}
        tabIndex={2}
        className="mops-modal-inner-margin"
        checked={paymentMethod === "Online" ? true : false}
      />
      <Radio
        label="Customer Layby"
        onChange={() => changeMethodOfPayment("Customer Layby")}
        tabIndex={3}
        className="mops-modal-inner-margin"
        checked={paymentMethod === "Customer Layby" ? true : false}
        disabled={!selectedCustomerData?.id ? true : false}
      />
    </>
  );
};

export default MopModal;
