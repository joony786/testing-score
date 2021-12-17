import React, { useEffect, useState } from "react";
import "./print.scss";
import moment from "moment";
//import UrlConstants from '../../../../utils/constants/url-configs';
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import * as SetupApiUtil from "../../../../utils/api/setup-api-utils";
import Constants from "../../../../utils/constants/constants";
import * as Helpers from "../../../../utils/helpers/scripts";

const PrintOverviewSales = (props) => {
  const [templateData, setTemplateData] = useState(null);

  // useEffect(() => {

  //     /*-----------set user store id-------------*/
  //     var userData = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
  //     userData = userData.data ? userData.data : null;

  //     if (userData) {
  //         if (
  //             checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
  //         ) {
  //             getUserStoreData(userData.auth.current_store);  //imp to get user outlet data

  //         }
  //     }
  //     /*-----------set user store id-------------*/

  // }, []);

  // const getUserStoreData = async (storeId) => {
  //     document.getElementById('app-loader-container').style.display = "block";
  //     const getOutletViewResponse = await SetupApiUtil.getOutlet(storeId);
  //     console.log('getOutletViewResponse:', getOutletViewResponse);

  //     if (getOutletViewResponse.hasError) {
  //         console.log('Cant fetch Store Data -> ', getOutletViewResponse.errorMessage);
  //         document.getElementById('app-loader-container').style.display = "none";
  //     }
  //     else {
  //         console.log('res -> ', getOutletViewResponse);
  //         let selectedStore = getOutletViewResponse.outlet;
  //         getTemplateData(selectedStore.template_id);   //imp to get template data

  //     }
  // }

  // const getTemplateData = async (templateId) => {

  //     const getTepmlateResponse = await SetupApiUtil.getTemplate(templateId);
  //     console.log('getTepmlateResponse:', getTepmlateResponse);

  //     if (getTepmlateResponse.hasError) {
  //         console.log('Cant get template Data -> ', getTepmlateResponse.errorMessage);
  //         document.getElementById('app-loader-container').style.display = "none";

  //     }
  //     else {
  //         console.log('res -> ', getTepmlateResponse);
  //         var receivedTemplateData = getTepmlateResponse.template;
  //         setTemplateData(receivedTemplateData);
  //         document.getElementById('app-loader-container').style.display = "none";

  //     }
  // }

  let templateImageSrc = "";
  let templateHeader = "";
  let templateHeaderComplete = [];
  let iterator = 0;

  // if (templateData) {
  //     templateImageSrc = `${templateData.template_image}`;    //new one
  //     templateHeader = `${templateData.template_header}`;    //new one
  //     //templateFooter = `${templateData.template_footer}`;    //new one
  //     templateHeaderComplete = templateHeader.split("\n");
  // }

  let overviewStart = moment(props.calenderDates[0]).format("dd MMM , yyyy");
  let overviewEnd = moment(props.calenderDates[1]).format("dd MMM , yyyy");

  let cash = Helpers.var_check_updated_all(props.salesSummaryMopsData.cash)
    ? props.salesSummaryMopsData.cash
    : 0;

  let credit = Helpers.var_check_updated_all(props.salesSummaryMopsData.credit)
    ? props.salesSummaryMopsData.credit
    : 0;

  let customer = Helpers.var_check_updated_all(
    props.salesSummaryMopsData.customer
  )
    ? props.salesSummaryMopsData.customer
    : 0;

  let discounts = Helpers.var_check_updated_all(
    props.salesSummaryMopsData.discounts
  )
    ? props.salesSummaryMopsData.discounts
    : 0;

  let total = cash + credit;
  total = total - discounts;
  total = parseFloat(total).toFixed(2);
  //console.log(total);

  cash = parseFloat(cash).toFixed(2);
  credit = parseFloat(credit).toFixed(2);
  customer = parseFloat(customer).toFixed(2);
  discounts = parseFloat(discounts).toFixed(2);

  return (
    <div id="printTable">
      <center>
        <img
          src={templateImageSrc}
          style={{ width: "6rem" }}
          alt="invoice_image"
        />
        <br />
        {templateHeaderComplete.length > 0 &&
          templateHeaderComplete.map((item) => {
            return (
              item !== "" && (
                <>
                  {" "}
                  <b key={iterator++}>{item}</b>
                  <br />
                </>
              )
            );
          })}
        <br />
        <span>
          <strong>Sales overview</strong>
        </span>
        <br />
        <b style={{ fontSize: "10px" }}>DATE: </b>{" "}
        <span>
          {overviewStart} - {overviewEnd}
        </span>
        <br />
      </center>
      <hr />

      <table
        className="print-sales-table sales-summary-invoice"
        style={{ width: "100%" }}
      >
        <tbody>
          <tr>
            <td>Cash</td>
            <td style={{ cssFloat: "right" }}>{cash}</td>
          </tr>
          <tr>
            <td>Credit/Debit Card</td>
            <td style={{ cssFloat: "right" }}>{credit}</td>
          </tr>
          <tr>
            <td>Customer Layby</td>
            <td style={{ cssFloat: "right" }}>{customer}</td>
          </tr>
          <tr>
            <td>Discounts</td>
            <td style={{ cssFloat: "right" }}>{discounts}</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <table
        className="print-sales-table sales-summary-invoice"
        style={{ width: "100%" }}
      >
        <tbody>
          <tr>
            <td>Total</td>
            <td style={{ cssFloat: "right" }}>{total}</td>
          </tr>
        </tbody>
      </table>
      <hr />
    </div>
  );
};

export default PrintOverviewSales;
