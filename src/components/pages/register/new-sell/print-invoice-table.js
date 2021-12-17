import React, { useEffect } from "react";
import "./printInvoice.scss";
import moment from "moment";
import UrlConstants from "../../../../utils/constants/url-configs";
import * as Helpers from "../../../../utils/helpers/scripts";

const PrintSalesInvoice = (props) => {
  const {
    invoiceNo,
    templateData = null,
    invoiceData = {
      dateTime: new Date(),
    },
    user,
  } = props;

  let templateImageSrc = "";
  let templateHeader = "";
  let templateFooter = "";
  let templateFooterComplete = [];
  let templateHeaderComplete = [];
  let iterator = 0;

  if (templateData) {
    templateImageSrc = `${templateData.image}`; //new one
    templateHeader = `${templateData.header}`; //new one
    templateFooter = `${templateData.footer}`; //new one
    //templateFooter = templateFooter.replace(/\n/g, '<br />');
    templateFooterComplete = templateFooter.split("\n");
    templateHeaderComplete = templateHeader.split("\n");
  }

  let today = moment(invoiceData?.dateTime).format("ddd DD MMM, yyyy HH:mm A");
  let {} = props;
  let userName = "";
  if (user) {
    userName = user?.user_info?.user_name || "";
  } else {
    userName = invoiceData.user_name;
  }

  return (
    <div id="printInvoiceTable">
      <center>
        <img src={templateImageSrc} style={{ width: "6rem" }} />
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
        {/*<b>{removeHTML(templateHeader)}</b><br />*/}
        <div style={{ fontSize: "10px", marginTop: "7px" }}></div>
        <span>Receipt / Tax Invoice</span>
        <br />
        <br />
        <b style={{ fontSize: "10px" }}>Receipt #: </b>{" "}
        <span>{invoiceNo || ""}</span>
        <br />
        {/*<b style={{fontSize: "10px"}}>Invoice Note: </b> <span>{invoice.reference || invoice.invoice_note}</span><br /> */}
        <b style={{ fontSize: "10px" }}>Date: </b> <span>{today}</span>
        <br />
        {invoiceData?.completeReturn && (
          <b style={{ fontSize: "10px" }}>Returned Invoice</b>
        )}
        <br />
        <b style={{ fontSize: "10px" }}>Sales Person: </b>
        <span>{userName}</span>
        <br />
      </center>
      <table
        className="print-sales-invoice sales-invoice-table"
        style={{
          width: "100%",
          borderBottom: "2px solid #000",
          borderTop: "2px solid #000",
        }}
      >
        <thead>
          <tr>
            <th>QTY</th>
            <th>Name</th>
            <th>Color</th>
            <th>Size</th>
            <th>Price</th>
            <th>Discount Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData?.products.map((pro) => {
            return (
              <tr key={pro.id}>
                <td style={{ textAlign: "center" }}>{pro?.selectQty || 0}</td>
                <td style={{ textAlign: "center" }}>{pro?.name}</td>
                <td style={{ textAlign: "center" }}>-</td>
                <td style={{ textAlign: "center" }}>-</td>
                <td style={{ textAlign: "center" }}>
                  {pro?.originalPrice || 0}
                </td>
                <td style={{ textAlign: "center" }}>{pro?.offer_price || 0}</td>
                <td style={{ textAlign: "center" }}>
                  {(pro?.selectQty * pro?.offer_price).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ width: "100%", borderBottom: "2px dotted #000" }}>
        <p>
          <span>
            <b>Subtotal</b>
          </span>
          <span style={{ right: "20px", position: "absolute" }}>
            {invoiceData?.subTotal || 0}
          </span>
        </p>
        <p>
          <span>
            <b>Tax</b>
          </span>
          <span style={{ right: "20px", position: "absolute" }}>
            {invoiceData?.totalTax || 0}
          </span>
        </p>
        <p>
          <span>
            <b>Discount</b>
          </span>
          <span style={{ right: "20px", position: "absolute" }}>
            {invoiceData?.totalDiscount || 0}
          </span>
        </p>
        <p
          style={{
            borderBottom: "2px solid #000",
            borderTop: "2px solid #000",
          }}
        >
          <b>Total</b>
          <b style={{ right: "20px", position: "absolute" }}>
            {invoiceData?.totalAmount || 0}
          </b>
        </p>
        <p>
          <span>
            <b>{invoiceData?.paymentMethod}</b>
          </span>
          <span style={{ right: "20px", position: "absolute" }}>
            {invoiceData?.payed}
          </span>
        </p>
        <p>
          <span>
            <b>To Pay</b>
          </span>
          <span style={{ right: "20px", position: "absolute" }}>
            {" "}
            {invoiceData?.toPay || 0}
          </span>
        </p>
      </div>

      {invoiceData?.invoice_note && (
        <div
          style={{
            width: "100%",
            borderBottom: "2px dotted #000",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
          }}
        >
          <center>
            <b style={{ fontSize: "10px" }}>Invoice Note: </b>{" "}
            <span>{invoiceData?.invoice_note || ""}</span>
            <br />
          </center>
        </div>
      )}
      <center
        style={{
          borderBottom: "2px dotted #000",
          marginBottom: "5px; padding: 10px",
        }}
      >
        <img
          src={`${UrlConstants.BASE_URL}/api/open/barcode/${invoiceNo || ""}`}
          style={{ width: "30%" }}
        />
      </center>
      <hr />

      <div style={{ marginTop: "2rem" }}>
        <center>
          {templateFooterComplete.length > 0 &&
            templateFooterComplete.map((item) => {
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
        </center>
      </div>

      <hr />
    </div>
  );
};

export default PrintSalesInvoice;
