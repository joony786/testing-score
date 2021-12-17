import React from "react";
import SellNestedQuickViewProductsTable from "../../organism/table/sell/sellQuickViewProductsTable";

function ModalTable(props) {
  const {
    date = "",
    selectedHistoryRecordData = null,
    invoiceTableData = [],
    modalHeading = "Modal Heading",
    labels = null,
  } = props;
  const completeReturn =
    selectedHistoryRecordData.is_returned === "1" &&
    selectedHistoryRecordData.status === "0";
  // let totalValue = 0;

  // if (
  //   !selectedHistoryRecordData?.promotion_id &&
  //   selectedHistoryRecordData?.is_returned === "1" &&
  //   selectedHistoryRecordData?.status === "2"
  // ) {
  //   totalValue = parseFloat(
  //     parseFloat(selectedHistoryRecordData.sub_total) +
  //       parseFloat(selectedHistoryRecordData.invoice_total_tax || 0) +
  //       parseFloat(selectedHistoryRecordData.discounted_amount)
  //   ).toFixed(2);
  // } else {
  //   totalValue = parseFloat(
  //     parseFloat(selectedHistoryRecordData.sub_total) +
  //       parseFloat(selectedHistoryRecordData.invoice_total_tax || 0) -
  //       parseFloat(selectedHistoryRecordData.discounted_amount)
  //   ).toFixed(2);
  // }
  return (
    <div className="modal_table">
      <div className="modal_table__container">
        <div className="modal_table__header">
          <h1 className="modal_heading_invoice">
            {modalHeading}
            <br />
            {date}
            <br />
            {completeReturn && <span>Returned Invoice</span>}
          </h1>
        </div>
        <div className="modal_table__table page__table">
          <SellNestedQuickViewProductsTable
            selectedHistoryRecordData={selectedHistoryRecordData}
            tableData={invoiceTableData}
          />
        </div>
        {selectedHistoryRecordData?.note !== "" && (
          <center>
            Invoice Note:
            <span>{selectedHistoryRecordData?.note}</span>
          </center>
        )}
        <div className="modal_table__info">
          <ul>
            <li>
              <span className="title">{labels ? labels.label1 : ""}</span>
              <span className="value">
                {selectedHistoryRecordData &&
                  parseFloat(selectedHistoryRecordData.sub_total).toFixed(2)}
              </span>
            </li>
            <li>
              <span className="title">{labels ? labels.label2 : ""}</span>
              <span className="value">
                {selectedHistoryRecordData &&
                  parseFloat(
                    selectedHistoryRecordData.discounted_amount
                  ).toFixed(2)}
              </span>
            </li>
            <li>
              <span className="title">{labels ? labels.label3 : ""}</span>
              <span className="value">
                {selectedHistoryRecordData &&
                  parseFloat(
                    selectedHistoryRecordData.invoice_total_tax || 0
                  ).toFixed(2)}
              </span>
            </li>
            <li>
              <span className="title">{labels ? labels.label4 : ""}</span>
              <span className="value">
                {parseFloat(selectedHistoryRecordData.total_price).toFixed(2)}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ModalTable;
