import React, { useState, useEffect } from "react";
import { Table, Icon } from "@teamfabric/copilot-ui";
import moment from "moment";
import * as Helpers from "../../../../utils/helpers/scripts";
import Constants from "../../../../utils/constants/constants";
import SvgIcons from "../../../svg";
import Permissions from "../../../../utils/constants/user-permissions";
import * as PermissionsHelpers from "../../../../utils/helpers/check-user-permission";
const _ = require("lodash");

let perPageNo = 10;

const SellHistoryInvoicesTable = (props) => {
  const {
    tableType = "",
    tableData = [],
    tableDataLoading = false,
    paginationData = {},
    checkCashier = false,
    salesHistoryData = {},
  } = props;
  const moduleEditCheck = PermissionsHelpers.checkUserModuleRolePermission(
    Permissions.USER_PERMISSIONS.UPDATE.INVOICES
  );
  const [tableDataPerPage, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  //const [currentPageNumber, setcurrentPageNumber] = useState(1);

  //console.log(paginationData);
  let totalRecordsLength;
  if (isEmptyPaginationData(paginationData)) {
    totalRecordsLength = 0;
  } else {
    totalRecordsLength = parseInt(paginationData.totalElements);
  }
  //console.log(totalRecordsLength);

  const handleInvoiceView = (record, status) => {
    props.onInvoiceSelection(record, status);
  };

  const handleInvoiceQuickView = (record) => {
    props.onInvoiceQuickViewSelection(record);
  };

  useEffect(() => {
    console.log("use-effect->tabledata->", tableData);
    /*----------------------setting menu option-----------------------------*/
    let allInvoicesData = [...tableData]; //vvv imp to set

    for (let i = 0; i < allInvoicesData.length; i++) {
      const showReturnButton = allInvoicesData[i]?.is_returned != "1";
      let item = allInvoicesData[i];
      item.invoice_id = item.id;
      let invoiceStatusValue = Helpers.getSalesInvoiceActiveStatus(
        item.status,
        item.is_dead
      );
      item.invoice_method = item.payment_method;
      item.sale_total_formatted = parseFloat(item.total_price).toFixed(2);
      item.invoice_datetime_formatted = moment(item.date).format(
        "DD MMM, yyyy"
      );
      item.inv_discount_formatted = parseFloat(item.discounted_amount).toFixed(
        2
      );
      item.invoice_status_formatted = invoiceStatusValue;
      item.action_icon_formatted =
        moduleEditCheck &&
        invoiceStatusValue ===
          Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.COMPLETED.VALUE &&
        props.registerProcessReturn &&
        showReturnButton ? (
          <span
            className="table-row-action-btn"
            onClick={() => handleInvoiceView(item, "return")}
          >
            <SvgIcons type="return-icon" />
          </span>
        ) : moduleEditCheck &&
          invoiceStatusValue ===
            Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.PARKED.VALUE ? (
          <span
            className="table-row-action-btn"
            onClick={() => handleInvoiceView(item, "parked")}
          >
            <SvgIcons type="parked-icon" />
          </span>
        ) : (
          <span className="table-row-action-btn">-</span>
        );

      if (
        props.tableType === "completed-sales" ||
        props.tableType === "all-sales" ||
        props.tableType === "dead-sales" ||
        props.tableType === "returned-sales"
      ) {
        item.quick_view_action_icon_formatted = (invoiceStatusValue ===
          Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.COMPLETED.VALUE ||
          invoiceStatusValue ===
            Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.RETURNED_COMPLETED
              .VALUE ||
          invoiceStatusValue ===
            Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.DEAD.VALUE) && (
          <Icon
            iconName="Eye"
            className="table-row-action-btn"
            size={15}
            onClick={() => handleInvoiceQuickView(item)}
          />
        );
      }
    }

    /*--------------------------setting menu option-------------------------*/
    setTableData(allInvoicesData.slice(0, perPageNo));
  }, [
    props.tableData,
    props.tableType,
    props.tableDataLoading,
    props.paginationData,
    props.registerProcessReturn,
  ]);

  //const delay = ms => new Promise(res => setTimeout(res, ms));
  function isEmptyPaginationData(obj) {
    return Object.keys(obj).length === 0;
  }

  function isEmptyTableData(data) {
    return data.length === 0;
  }

  let tableColumns = [];

  tableColumns = [
    {
      title: "Date",
      accessor: "invoice_datetime_formatted",
    },
    {
      title: "Receipt",
      accessor: "show_id",
    },
    {
      title: "Sold by",
      accessor: "sold_by",
    },
    {
      title: "Sale Total",
      accessor: "sale_total_formatted",
    },
    {
      title: "Discounted Amount",
      accessor: "inv_discount_formatted",
      className: "line-break",
    },
    // {
    //   title: "Invoice Note",
    //   accessor: "note",
    // },
    {
      title: "Mop",
      accessor: "invoice_method",
    },
    {
      title: "Status",
      accessor: "invoice_status_formatted",
    },
    {
      title: props.tableType === "continue-sales" ? "Continue" : "Return",
      accessor: "action_icon_formatted",
    },
  ];

  if (
    props.tableType === "completed-sales" ||
    props.tableType === "all-sales" ||
    props.tableType === "dead-sales" ||
    props.tableType === "returned-sales"
  ) {
    let item = {
      title: "View",
      accessor: "quick_view_action_icon_formatted",
    };

    tableColumns.push(item);
  }

  console.log(tableDataPerPage);

  return (
    <div>
      <Table
        data={tableDataPerPage}
        columns={tableColumns}
        showPagination={true}
        totalRecords={totalRecordsLength}
        perPage={perPageNo}
        //handlePagination={handlePagination}
        loading={tableDataLoading}
        //activePageNumber={currentPageNumber}  //but not in use
        rowClassName="sell-history-nested-invoices-table"
        render={({ data }) => {
          return isEmptyTableData(data) && !tableDataLoading ? (
            <tbody>
              <tr>
                <td colSpan={tableColumns.length + 1}>
                  <div className="table-no-search-data">NO RESULTS FOUND</div>
                </td>
              </tr>
            </tbody>
          ) : null;
        }}
      />
    </div>
  );
};

export default SellHistoryInvoicesTable;
