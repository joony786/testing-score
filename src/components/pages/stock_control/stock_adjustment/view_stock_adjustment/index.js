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
import moment from "moment";

const dateFormat = "YYYY-MM-DD";

function ViewStockAdjustment(props) {
  const [productsTableData, setProductsTableData] = useState([]);
  const [viewStockAdjustmentData, setViewStockAdjustmentData] = useState([]);
  const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
  const history = useHistory();
  const { match = {} } = props;
  const { adjustmentId = {} } = match !== undefined && match.params;
  let mounted = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (adjustmentId !== undefined) {
      getStockAdjustmentById(adjustmentId);
    } else {
      return popPage();
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mounted = false;
    };
  }, []);

  const getStockAdjustmentById = async (
    adjustmentId,
    pageLimit = 10,
    pageNumber = 1
  ) => {
    document.getElementById("app-loader-container").style.display = "block";
    const getStockAdjustmentResponse =
      await StockApiUtil.viewStockAdjustmentsById(
        adjustmentId,
        pageLimit,
        pageNumber
      );
    if (getStockAdjustmentResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, getStockAdjustmentResponse.errorMessage); //imp
      return delayPopPage();
    } else {
      if (mounted) {
        //imp if unmounted
        let products = getStockAdjustmentResponse.data.products;
        setProductsTableData(products);
        setViewStockAdjustmentData(getStockAdjustmentResponse.data);
        calculateProductsTotalQuantity([...products]);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const calculateProductsTotalQuantity = (data) => {
    let productsTotalQuantity = 0;
    const newData = [...data];
    newData.forEach((item) => {
      productsTotalQuantity =
        productsTotalQuantity + parseFloat(item.adjustment_quantity || 0);
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
    let csv = "Name,SKU,Quantity in POS,System Quantity,Difference,Adjustment Quantity,Adjustment Type\n";
    const arr = productsTableData;
    arr && arr.length > 0 && arr.forEach(function (row) {
        csv += row.name + "," + row.sku + "," + row.quantity_pos + "," + row.system_quantity + "," + row.difference + "," + row.adjustment_quantity + "," + row.type + "\n";
      });
    const fileName = "Stock_Cycling_" + new Date().toUTCString();
    Helpers.createCSV(fileName, csv);
    document.getElementById("app-loader-container").style.display = "none";
  };

  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack
          text="Back to Stock Control"
          link="/stock-control/stock-adjustments"
        />
      </div>

      <div className="page__body stock-order-products-container">
        <section className="page__header">
          <h1 className="heading heading--primary">View Stock Cycling</h1>
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
              <h2 className="heading heading--secondary">SCR</h2>
              <div className="label-stock-count">
                <label>{"Total Quantity : "}</label>
                <label>{productsTotalQuantity}</label>
              </div>
            </div>
            <div className="fieldset_switch order-products-title">
              <span className="label-stock-count lh-35">
                Reason: {viewStockAdjustmentData.message}
                <br />
                Stock Cycling Date:{" "}
                {moment(viewStockAdjustmentData.date).format(dateFormat)}
                <br />
                Outlet: {viewStockAdjustmentData.store_name}
              </span>
            </div>
          </fieldset>

          <div className="page__table">
            <StockNestedProductsTable
              tableData={[...productsTableData]}
              tableType="viewStockAdjustment"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default ViewStockAdjustment;
