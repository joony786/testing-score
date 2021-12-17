import React, { useState, useEffect } from "react";
import { Table } from "@teamfabric/copilot-ui";
import moment from "moment";
import CustomTableAtionMenuItem from "../table_helpers/tableActionMenu";
import * as EcommerceApiUtil from "../../../../utils/api/ecommerce-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";

let perPageNo = 10;
const dateFormat = "YYYY-MM-DD";

const OrderTableView = (props) => {
  const {
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
    handlePrintInvoice,
  } = props;

  const [tableDataPerPage, setTableData] = useState([]);
  // const [currentPageNumber, setcurrentPageNumber] = useState(currentPageIndex);
  const [loading, setLoading] = useState(false);

  let totalRecordsLength;

  // if (isEmptyPaginationData(paginationData)) {
  //   totalRecordsLength = 0;
  // } else {
  //   totalRecordsLength = parseInt(paginationData.totalElements);
  // }
  useEffect(() => {
    if (tableData.length > 0 || tableData.length === 0) {
      handleTableFields(tableData);
    }
    // totalRecordsLength = tableData?.length;
    // setTableData(tableData.slice(0, perPageNo));
    // setcurrentPageNumber(currentPageIndex);
    // renderData(tableData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableData,
    tableDataLoading,
    tableType,
    currentPageIndex,
  ]);
  console.log("totalRecordsLength", totalRecordsLength)
  const handleTableFields = () => {
    let allOrderData = [...tableData];
    for (let i = 0; i < allOrderData.length; i++) {
      let item = allOrderData[i];
      if (tableType === "ordertable") {
        if (item.dateTime) {
          item.dateTime = moment(item.dateTime).format(dateFormat);
        }
        item.orderTotal = parseFloat(item.orderTotal || 0).toFixed(2);
        item.orderDiscount = parseFloat(item.orderDiscount || 0).toFixed(2);
        item.shippingMethod = item?.courier?.shippingMethod || "";
        item.shippingPrice =
          parseFloat(item?.courier?.shippingPrice || 0).toFixed(2) || "";
        item.menu = (
          <CustomTableAtionMenuItem
            tableItem={item}
            tableItemId={item.orderId}
            tableItemMenuType="EcommerceOrder"
            tableStatus={item.orderType}
            handleTableMenuItemClick={handleTableMenuItemClick}
          />
        );
      }
    }
    setTableData(allOrderData.slice(0, perPageNo));
  };

  const handleTableMenuItemClick = async (orderId, order, itemLabel) => {
    if (itemLabel === "View") {
      return handleOrderView(order);
    }
    if (itemLabel === "Mark Shipped") {
      dispatachedOrder(order, orderId);
    }
    if (itemLabel === "Cancel") {
      cancelOrder(order, orderId);
    }
    if (itemLabel === "Download") {
      printDileveryOrder(order?.courier?.shippingLabel);
    }
  };

  const dispatachedOrder = async (order, orderId) => {
    document.getElementById("app-loader-container").style.display = "block";
    const orderData = {
      status: "dispatched",
    };
    const orderUpdateResponse = await EcommerceApiUtil.updateOrderStatus(
      orderId,
      orderData
    );
    console.log("orderUpdateResponse:", orderUpdateResponse);
    if (orderUpdateResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, orderUpdateResponse.errorMessage);
    } else {
      const orderData = {
        orderId: orderId,
        deliveryNumber: order.deliveryNumber,
      };
      const wmsOrderUpdateRes = await EcommerceApiUtil.updateWMSOrderStatus(
        orderData
      );
      console.log("wmsOrderUpdateRes", wmsOrderUpdateRes);
      if (wmsOrderUpdateRes.hasError) {
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, wmsOrderUpdateRes.errorMessage);
      } else {
        document.getElementById("app-loader-container").style.display = "none";
        fetchAllOrdersData(tableStatus);
        if (order?.courier?.shippingLabel) {
          printDileveryOrder(order?.courier?.shippingLabel)
        } else {
          handlePrintInvoice(order);
        }
      }
    }
  };

  const printDileveryOrder = (data) => {
    window.open("data:application/octet-stream;charset=utf-16le;base64,"+data) 

  }
  const cancelOrder = async (order, orderId) => {
    document.getElementById("app-loader-container").style.display = "block";
    const orderData = {
      status: "canceled",
    };
    const orderUpdateResponse = await EcommerceApiUtil.updateOrderStatus(
      order.siteOrderId,
      orderData
    );
    console.log("orderUpdateResponse:", orderUpdateResponse);
    if (orderUpdateResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, orderUpdateResponse.errorMessage);
    } else {
      fetchAllOrdersData(tableStatus);
    }
  };
  //   const renderData = (tableData) => {};
  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
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
  //   props.onClickPageChanger(id);
  // };

  let tableColumns = [];
  if (tableType === "ordertable") {
    tableColumns = [
      {
        title: "Order Id",
        accessor: "orderId",
      },
      //   {
      //     title: "Region",
      //     accessor: "region",
      //   },
      {
        title: "Order Date",
        accessor: "dateTime",
      },
      {
        title: "Order Stauts",
        accessor: "status",
      },
      {
        title: "Shipping Method",
        accessor: "shippingMethod",
      },
      {
        title: "Shipping Cost",
        accessor: "shippingPrice",
      },
      {
        title: "Order Total (PKRs)",
        accessor: "orderTotal",
      },
      {
        title: "Discount",
        accessor: "orderDiscount",
      },
      {
        title: "",
        accessor: "menu",
      },
    ];
  }

  return (
    <div>
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
    </div>
  );
};

export default OrderTableView;
