import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../../style.scss";

// components
import ButtonBack from "../../../../atoms/button_back";
import * as StockApiUtil from "../../../../../utils/api/stock-api-utils";
import * as Helpers from "../../../../../utils/helpers/scripts";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import SwitchOutlet from "../../../../atoms/switch_outlet";
import StockNestedProductsTable from "../../../../organism/table/stock/stockNestedProductsTable";
import Constants from "../../../../../utils/constants/constants";
import moment from "moment";

const dateFormat = "YYYY-MM-DD";

function ViewStockRequest(props) {
  const [productsTableData, setProductsTableData] = useState([]);
  const [viewStockRequestData, setViewStockRequestData] = useState([]);
  const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
  const history = useHistory();
  const { match = {} } = props;
  const { requestId = {} } = match !== undefined && match.params;
  let mounted = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (requestId !== undefined) {
      getStockRequestById(requestId);
    } else {
      return popPage();
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mounted = false;
    };
  }, []);

  const getStockRequestById = async (
    requestId,
    pageLimit = 10,
    pageNumber = 1
  ) => {
    document.getElementById("app-loader-container").style.display = "block";
    const getStockRequestResponse = await StockApiUtil.getStockRequestById(
      requestId,
      pageLimit,
      pageNumber
    );
    if (getStockRequestResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, getStockRequestResponse.errorMessage); //imp
      return delayPopPage();
    } else {
      if (mounted) {
        //imp if unmounted
        const products = getStockRequestResponse.transfer.products;
        getStockRequestResponse.transfer.status = getStockRequestResponse.transfer.status === "open"
              ? Constants.STOCK_CONTROL.OPEN : getStockRequestResponse.transfer.status === "recieved"
              ? Constants.STOCK_CONTROL.RECEIVED : getStockRequestResponse.transfer.status === "waiting_for_admin_approval"
              ? Constants.STOCK_CONTROL.GONE_FOR_APPROVAL : getStockRequestResponse.transfer.status === "rejected"
              ? Constants.STOCK_CONTROL.REJECTED
              : Constants.STOCK_CONTROL.FORCE_CLOSED;
        setProductsTableData(products);
        setViewStockRequestData(getStockRequestResponse.transfer);
        calculateProductsTotalQuantity([...products]);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const calculateProductsTotalQuantity = (data) => {
    var productsTotalQuantity = 0;
    const newData = [...data];
    newData.forEach((item) => {
      productsTotalQuantity =
        productsTotalQuantity + parseFloat(item.quantity || 0);
    });
    setProductsTotalQuantity(productsTotalQuantity);
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const popPage = () => {
    history.goBack();
  };

  const delayPopPage = () => {
    setTimeout(() => {
      history.goBack();
    }, 2000);
  };

  const handleDownloadFile = async (event) => {
    event.preventDefault();
    document.getElementById("app-loader-container").style.display = "block";
    var csv = "ProductName,SKU,Quantity\n";
    var arr = productsTableData;
    arr.forEach(function (row) {
      csv += row.name + "," + row.sku + "," + row.quantity + "\n";
    });
    csv += "\n";
    csv += "Total Quantity,," + productsTotalQuantity;
    const fileName = "STR_" + new Date().toUTCString();
    Helpers.createCSV(fileName, csv);
    document.getElementById("app-loader-container").style.display = "none";
  };

  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack
          text="Back to Stock Control"
          link="/stock-control/stock-request"
        />
      </div>

      <div className="page__body stock-order-products-container">
        <section className="page__header">
          <h1 className="heading heading--primary">View Stock Request</h1>
          <CustomButtonWithIcon
            size="small"
            isPrimary={true}
            text="Download"
            onClick={handleDownloadFile}
          />
        </section>
        <section className="page__content stock-add-po">
          <fieldset className="form__fieldset">
            <div className="fieldset_switch order-products-title">
              <h2 className="heading heading--secondary">STR</h2>
              <div className="label-stock-count">
                <label>{"Total Quantity : "}</label>
                <label>{productsTotalQuantity}</label>
              </div>
            </div>
            <div className="fieldset_switch order-products-title">
              <span className="label-stock-count lh-35">
                Status: {viewStockRequestData.status}
                <br />
                Ordered Date:{" "}
                {moment(viewStockRequestData.date).format(dateFormat)}
                <br />
                Destination Outlet: {viewStockRequestData.to_store}
              </span>
            </div>
          </fieldset>

          <div className="page__table">
            <StockNestedProductsTable
              tableData={[...productsTableData]}
              tableType="viewRequestStock"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default ViewStockRequest;
