import React, { useState, useEffect } from "react";
import { Table } from "@teamfabric/copilot-ui";
import moment from "moment";
import CustomTableAtionMenuItem from "../table_helpers/tableActionMenu";
import * as EcommerceApiUtil from "../../../../utils/api/ecommerce-api-utils";
import * as WebOrdersApiUtil from "../../../../utils/api/web-orders-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";

let perPageNo = 10;
const dateFormat = "YYYY-MM-DD";

const ManualOrderTableView = ({
  paginationData,
  tableType = "",
  tableData = [],
  tableDataLoading = false,
  currentPageIndex = 1,
  handleSelectOrder,
  handleAllOrdersSelect,
  handleOrderView,
  tableStatus,
  fetchAllOrdersData,
  onClickPageChanger,
  handlePrintInvoice,
}) => {
  const [tableDataPerPage, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // const [currentPageNumber, setcurrentPageNumber] = useState(currentPageIndex);

  // let totalRecordsLength;

  // if (isEmptyPaginationData(paginationData)) {
  //   totalRecordsLength = 0;
  // } else {
  //   totalRecordsLength = parseInt(paginationData.totalElements);
  // }
  useEffect(() => {
    if (tableData.length > 0 || tableData.length === 0) {
      handleTableFields(tableData);
    }
    // setTableData(tableData.slice(0, perPageNo));
    // setcurrentPageNumber(currentPageIndex);
    // renderData(tableData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData, tableDataLoading, tableType, currentPageIndex]);
  const handleTableFields = () => {
    let allOrderData = [...tableData];
    for (let i = 0; i < allOrderData.length; i++) {
      let item = allOrderData[i];
      if (!item?.isSync) {
        item.menu = (
          <CustomTableAtionMenuItem
            tableItem={item}
            tableItemId={item.orderId}
            tableItemMenuType="EcommerceManualReturn"
            tableStatus={item.orderType}
            handleTableMenuItemClick={handleTableMenuItemClick}
          />
        );
      }
    }
    setTableData(allOrderData.slice(0, perPageNo));
  };

  const handleTableMenuItemClick = async (orderId, order, itemLabel) => {
    if (itemLabel === "Sync Return") {
      return handleReturnWebOrder(orderId);
    }
  };
  const handleReturnWebOrder = async (id) => {
    document.getElementById("app-loader-container").style.display = "block";
    const dataToReturn = {
      orderId: id,
    };
    const returnWebOrderRes = await WebOrdersApiUtil.returnWebOrder(
      dataToReturn
    );
    if (!returnWebOrderRes.success) {
      const errorMessage =
        returnWebOrderRes?.errorMessage || returnWebOrderRes?.data?.message;
      console.log("Cant Return Web Order-> ", errorMessage);
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, errorMessage);
    } else {
      document.getElementById("app-loader-container").style.display = "none";
      successAlerUi(true, "Order Return Successfully");
      fetchAllOrdersData(tableStatus);
    }
  };
  //   const renderData = (tableData) => {};
  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };
  const successAlerUi = (show, message) => {
    Helpers.showWarningAppAlertUiContent(show, message);
  };
  // function isEmptyPaginationData(obj) {
  //   return Object.keys(obj).length === 0;
  // }
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handlePagination = async (id) => {
    setLoading(true);
    await delay(1000).then(() => {
      const d = tableData.slice(perPageNo * (id - 1), perPageNo * id);
      setTableData(d);
    });
    setLoading(false);
  };

  function isEmptyTableData(data) {
    return data.length === 0;
  }


  // const handlePagination = async (id) => {
  //   onClickPageChanger(id);
  // };

  let tableColumns = [];
  if (tableType === "ordertable") {
    tableColumns = [
      {
        title: "Order Id",
        accessor: "orderId",
      },
      {
        title: "",
        accessor: "menu",
      },
    ];
  }

  return (
    <Table
      data={tableDataPerPage}
      columns={tableColumns}
      showPagination={true}
      totalRecords={tableData.length}
      perPage={perPageNo}
      // isSelectable={true}
      handlePagination={handlePagination}
      loading={tableDataLoading || loading}
      // activePageNumber={currentPageNumber}
      onAllRowSelect={(e, isSelected) => handleAllOrdersSelect(e, isSelected)}
      // onRowClick={(e, rowData) => handleOrderView(rowData)}
      rowSelectHandler={(e, rowData) => handleSelectOrder(rowData)}
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
  );
};

export default ManualOrderTableView;
