import React, { useEffect } from "react";
import "./printInvoice.scss";
import moment from "moment";
import UrlConstants from "../../../../utils/constants/url-configs";
import * as Helpers from "../../../../utils/helpers/scripts";

const PrintSalesInvoice = (props) => {
  const {
    selectedOutletTemplateData = null,
    invoiceStatusToCreate,
    totalInvoiceDiscount = 0,
  } = props;
  //console.log(props);

  useEffect(() => {}, []);

  let templateImageSrc = "";
  let templateHeader = "";
  let templateFooter = "";
  let templateFooterComplete = [];
  let templateHeaderComplete = [];
  let iterator = 0;

  /*if (props.user.template_data) {
        if (props.user.template_data.template_image) {
            //templateImageSrc = `${UrlConstants.IMAGE_UPLOADS_URL}/uploads/${props.user.template_data.template_image}`;    //imp prev
            templateImageSrc = `${props.user.template_data.template_image}`;    //new one
        }
        if (props.user.template_data.template_header) {
            templateHeader = props.user.template_data.template_header;
        }
    }*/

  if (selectedOutletTemplateData) {
    templateImageSrc = `${selectedOutletTemplateData.image}`; //new one
    templateHeader = `${selectedOutletTemplateData.header}`; //new one
    templateFooter = `${selectedOutletTemplateData.footer}`; //new one
    //templateFooter = templateFooter.replace(/\n/g, '<br />');
    templateFooterComplete = templateFooter.split("\n");
    templateHeaderComplete = templateHeader.split("\n");
    //console.log(templateFooterComplete);
  }

  function removeHTML(str) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText || "";
  }

  let today = moment(props.invoice.dateTime).format("ddd DD MMM, yyyy HH:mm A");
  let { invoice = "", invoiceType = "", currentInvoiceNo = "" } = props;
  let userName = "";
  if (props.user) {
    userName = props.user.user_info.user_name;
  } else {
    userName = invoice.user_name;
  }

  // console.log("invoice-data", invoice);

  let totalViewPrint = parseFloat(invoice.total_price).toFixed(2);
  // if (invoice?.returnInvoice && !invoice?.promotion_id) {
  //   totalViewPrint = parseFloat(
  //     parseFloat(invoice.sale_total) +
  //       parseFloat(invoice.tax_total) -
  //       parseFloat(invoice.inv_discount)
  //   ).toFixed(2);
  // } else {
  //   totalViewPrint = parseFloat(invoice.total_price).toFixed(2);
  // }
  const completeReturn =
    invoice?.is_returned === "1" && invoice?.status === "0";
  return (
    <div id="printSalesTable">
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
        <span>{currentInvoiceNo || invoice.invoice_show_id}</span>
        <br />
        {/*<b style={{fontSize: "10px"}}>Invoice Note: </b> <span>{invoice.reference || invoice.invoice_note}</span><br /> */}
        <b style={{ fontSize: "10px" }}>Date: </b> <span>{today}</span>
        <br />
        {completeReturn && <b style={{ fontSize: "10px" }}>Returned Invoice</b>}
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
          {invoice.products.map((pro) => {
            if (pro?.offer_price > 0) {
              pro.product_sale_price = pro?.offer_price;
            }
            if (pro?.original_quantity) {
              pro.qty = parseInt(pro?.original_quantity);
            }
            return (
              <tr key={pro.product_id}>
                <td style={{ textAlign: "center" }}>{pro.qty}</td>
                <td style={{ textAlign: "center" }}>
                  {/* {pro.searchName ||
                                            (pro.name &&
                                                Helpers.var_check_updated(pro.product_variant1_value) ? Helpers.var_check_updated(pro.product_variant2_value) ? <small>{pro.product_name + '/ ' + pro.product_variant1_value + '/ ' + pro.product_variant2_value}</small>
                                                : <small>{pro.name + ' / ' + pro.product_variant1_value}</small>
                                                : Helpers.var_check_updated(pro.product_variant2_value) ? <small>{pro.product_name + ' / ' + pro.product_variant2_value}</small>
                                                    : pro.name)
                                        } */}
                  {pro.name}
                </td>

                <td style={{ textAlign: "center" }}>
                  {pro.product_name &&
                  Helpers.var_check_updated(pro.product_variant1_value) ? (
                    <small>{pro.product_variant1_value}</small>
                  ) : (
                    ""
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  {pro.product_name &&
                  Helpers.var_check_updated(pro.product_variant2_value) ? (
                    <small>{pro.product_variant2_value}</small>
                  ) : (
                    ""
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  {parseFloat(pro?.original_sale_price).toFixed(2)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {parseFloat(pro?.product_sale_price).toFixed(2)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {(pro?.qty * pro?.product_sale_price).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {invoiceType !== "quick_view" && (
        <div style={{ width: "100%", borderBottom: "2px dotted #000" }}>
          <p>
            <span>
              <b>Subtotal</b>
            </span>
            <span style={{ right: "20px", position: "absolute" }}>
              {invoice.sub_total.toFixed(2)}
            </span>
          </p>
          <p>
            <span>
              <b>Tax</b>
            </span>
            <span style={{ right: "20px", position: "absolute" }}>
              {invoice.tax.toFixed(2)}
            </span>
          </p>
          <p>
            <span>
              <b>Discount</b>
            </span>
            <span style={{ right: "20px", position: "absolute" }}>
              {totalInvoiceDiscount > 0
                ? totalInvoiceDiscount?.toFixed(2)
                : invoice.discountAmount?.toFixed(2)}
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
              {(invoice.total - invoice.discountAmount).toFixed(2)}
            </b>
          </p>
          <p>
            <span>
              <b>{invoice.method}</b>
            </span>
            <span style={{ right: "20px", position: "absolute" }}>
              {invoice.payed}
            </span>
          </p>
          <p>
            <span>
              <b>To Pay</b>
            </span>
            <span style={{ right: "20px", position: "absolute" }}>
              {" "}
              {(invoice.total - invoice.payed - invoice.discountAmount).toFixed(
                2
              )}
            </span>
          </p>
        </div>
      )}

      {invoiceType === "quick_view" && (
        <div style={{ width: "100%", borderBottom: "2px dotted #000" }}>
          <p>
            <span>
              <b>Subtotal</b>
            </span>
            <span style={{ right: "20px", position: "absolute" }}>
              {parseFloat(invoice.sale_total).toFixed(2)}
            </span>
          </p>
          <p>
            <span>
              <b>Tax</b>
            </span>
            <span style={{ right: "20px", position: "absolute" }}>
              {parseFloat(invoice.tax_total).toFixed(2)}
            </span>
          </p>
          <p>
            <span>
              <b>Discount</b>
            </span>
            <span style={{ right: "20px", position: "absolute" }}>
              {parseFloat(invoice.inv_discount).toFixed(2)}
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
              {totalViewPrint}
            </b>
          </p>
        </div>
      )}

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
          <span>{invoice.reference || invoice.invoice_note}</span>
          <br />
        </center>
      </div>

      <center
        style={{
          borderBottom: "2px dotted #000",
          marginBottom: "5px; padding: 10px",
        }}
      >
        <img
          src={`${UrlConstants.BASE_URL}/api/open/barcode/${
            invoice.invoiceNo || invoice.invoice_unique
          }`}
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
