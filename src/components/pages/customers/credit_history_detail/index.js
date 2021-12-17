import React, { useEffect, useState } from "react";
import ButtonBack from "../../../atoms/button_back";
import SwitchOutlet from "../../../atoms/switch_outlet";
import * as CustomerApiUtil from "../../../../utils/api/customer-api-utils";
import * as SalesApiUtil from "../../../../utils/api/sales-api-utils";
import SellHistoryCustomerView from "../../../organism/table/sell/sellHistoryCustomerView";
import { useHistory } from "react-router";
const CreditHistoryDetail = (props) => {
  const { match = {} } = props;
  const history = useHistory();
  const { invoice_id = "" } = match !== undefined && match.params;
  const [invoiceData, setInvoiceData] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvoiceHistoryData = async () => {
    setIsLoading(true);
    document.getElementById("app-loader-container").style.display = "block";
    const params = {
      invoice_id: invoice_id,
      invoice_details: 1,
    };
    const invoiceHistoryRes = await SalesApiUtil.getSalesHistory(params);
    if (invoiceHistoryRes.hasError) {
      console.log(
        "Cant fetch registered products Data -> ",
        invoiceHistoryRes.errorMessage
      );
      setIsLoading(false);
      history.goBack();
      document.getElementById("app-loader-container").style.display = "none";
    } else {
      document.getElementById("app-loader-container").style.display = "none";
      const invoiceHistoryData = invoiceHistoryRes.invoices || {};
      const customerRes = await CustomerApiUtil.getSingleCustomer(invoiceHistoryData.customer_id);
      if (!customerRes.hasError) {
        setCustomerData(customerRes.customer[0]);
      }
      setInvoiceData(invoiceHistoryData);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchInvoiceHistoryData();
  }, []);
  const productsCount = invoiceData?.invoice_products?.length || 0;
  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack
          text={`Invoice # ${invoice_id}`}
          link={`/customers/${customerData?.id}/credit-history`}
        />
      </div>
      <div className="page__body stock-order-products-container">
        <section className="page__content stock-add-po  margin-bottom">
          <fieldset className="form__fieldset">
            <div className="fieldset_switch order-products-title">
              <h3 className="heading heading--primary ">Customer</h3>
            </div>
            <div className="fieldset_switch order-products-title">
              <span className="label-stock-count lh-35">
                Name: {customerData?.name}
                <br />
                Email: {customerData?.email}
                <br />
                Phone No: {customerData?.phone}
              </span>
            </div>
          </fieldset>
        </section>
        <section className="page__header">
          <h3 className="heading heading--primary margin-bottom">Products</h3>
          <span className="product-count-title">
            Total Products:{"  "}
            <span className="product-count"> {productsCount}</span>
          </span>
        </section>
        <SellHistoryCustomerView
          isLoading={isLoading}
          tableData={invoiceData?.invoice_products || []}
        />
      </div>
    </div>
  );
};

export default CreditHistoryDetail;
