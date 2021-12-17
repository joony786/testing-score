import React, { useState, useEffect } from "react";
import { Icon, Modal, Table } from "@teamfabric/copilot-ui";

import moment from "moment";
import * as StockApiUtil from "../../../../utils/api/stock-api-utils";
import { genericSearchPageLimit } from "../../../../utils/helpers/scripts";
import * as Helpers from "../../../../utils/helpers/scripts";
import CustomTableAtionMenuItem from "../table_helpers/tableActionMenu";
import { Link, useHistory } from "react-router-dom";
import { viewPurchaseOrdersGRN } from "../../../../utils/api/stock-api-utils";
import {
  formatDate,
  getPurchaseOrder,
} from "../../../pages/stock_control/stock_control_utils";

let perPageNo = "20";

const dateFormat = "YYYY-MM-DD";

const PurchaseOrderProductTable = (props) => {
  const [allData, setAllData] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  const [purchaseOrderModalTableData, setPurchaseOrderModalData] = useState([]);
  const [purchaseOrderPaginationData, setPurchaseOrderPaginationData] =
    useState([]);
  const [loading, setLoading] = useState(false);
  const [poView, setPOView] = useState(false);
  const [tableType, setTableType] = useState("default");
  const [purchaseProducts, setPurchaseProducts] = useState([]);
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [forceClosePurchaseOrderView, setForceClosePurchaseOrderView] =
    useState(false);
  const [forceCloseOrderName, setForceCloseOrderName] = useState(false);

  const history = useHistory();

  const { selectedDates = "" } = props;
  console.log(selectedDates);

  let startDate = selectedDates[0]
    ? selectedDates[0]
    : moment(new Date()).format(dateFormat);
  let finishDate = selectedDates[1]
    ? selectedDates[1]
    : moment(new Date()).format(dateFormat);
  //
  useEffect(() => {
    console.log("use-effect-tbale");
    setAllData([]);
    // if(selectedDates[0].length > 0 && selectedDates[1].length > 0) {
    fetchPurchaseOrder(startDate, finishDate).then((r) => r);
    // }
    return () => {
      mounted = false;
    };
  }, [selectedDates]);

  // for receive goods
  useEffect(() => {
    setPurchaseOrderModalData(purchaseProducts);
    setPurchaseOrderPaginationData(purchaseProducts);
  }, [purchaseProducts]);

  let mounted = true;
  let tableColumns = [];

  if (tableType === "default") {
    tableColumns = [
      {
        title: "PO #",
        accessor: "po_id",
      },
      {
        title: "Name",
        accessor: "name",
      },
      {
        title: "Ordered date",
        accessor: "date",
      },
      {
        title: "Due date",
        accessor: "delivery_datetime",
      },
      {
        title: "Supplier",
        accessor: "supplier_name",
      },
      {
        title: "Status",
        accessor: "status",
      },
      {
        title: "Action",
        accessor: "menu",
      },
      {
        title: "Quick View",
        accessor: "quick_view",
      },
      {
        title: " View",
        accessor: "view",
      },
    ];
    // Product Name	SKU	Quantity left	Quantity ordered	Price	Total
  } else if (tableType === "poView") {
    tableColumns = [
      {
        title: " Product Name",
        accessor: "name",
      },
      {
        title: "SKU",
        accessor: "sku",
      },
      {
        title: "Quantity left",
        accessor: "quantity",
      },
      {
        title: "Quantity ordered",
        accessor: "recieved_by_total",
      },
      {
        title: "Price",
        accessor: "price",
      },
    ];
  }

  // const getPurchaseOrder = async (po_id, grn_id,f1,f2) => {
  //     document.getElementById("app-loader-container").style.display = "block";
  //     const fetchPurchaseOrder = await viewPurchaseOrdersGRN(po_id, grn_id)
  //     if (fetchPurchaseOrder.hasError) {
  //         console.log(
  //             "Cant fetch registered products Data -> ",
  //             fetchPurchaseOrder.errorMessage
  //         );
  //         //message.warning(productsDiscountsViewResponse.errorMessage, 3);
  //         document.getElementById("app-loader-container").style.display = "none";
  //     } else {
  //         console.log("res -> ", fetchPurchaseOrder);
  //         setPurchaseProducts(fetchPurchaseOrder.products)
  //         setPurchaseOrder(fetchPurchaseOrder.purchase_order_info)
  //         document.getElementById("app-loader-container").style.display = "none";
  //     }
  // }
  const handleTableMenuItemClick = async (propId, propObj, itemLabel) => {
    console.log(propId, propObj, itemLabel, "here");
    const { grn_id, po_id, name, date } = propObj;
    console.log(propObj.date);
    let obj = { grn_id, po_id, date };
    let s = { name, po_id };

    await getPurchaseOrder(
      po_id,
      grn_id,
      setPurchaseProducts,
      setPurchaseOrder
    );
    if (itemLabel === "Receive") {
      return history.push({
        pathname: `/purchase-orders/${po_id}/${grn_id}/receive`,
        state: obj,
      });
    } else if (itemLabel === "Force Close") {
      setForceCloseOrderName(s);
      setForceClosePurchaseOrderView(true);
    }
  };

  function handleCloseModal() {
    setTableType("default");
    setPOView(false);
  }

  async function handlePOQuickView(_, data) {
    console.log(data);
    const { po_id, grn_id } = data;
    // await getPurchaseOrder(po_id, grn_id)
    document.getElementById("app-loader-container").style.display = "block";
    const fetchPurchaseOrder = await viewPurchaseOrdersGRN(po_id, grn_id);
    if (fetchPurchaseOrder.hasError) {
      console.log(
        "Cant fetch registered products Data -> ",
        fetchPurchaseOrder.errorMessage
      );
      //message.warning(productsDiscountsViewResponse.errorMessage, 3);
      document.getElementById("app-loader-container").style.display = "none";
    } else {
      console.log("res -> ", fetchPurchaseOrder);
      setPurchaseProducts(fetchPurchaseOrder.products);
      setPurchaseOrder(fetchPurchaseOrder.purchase_order_info);
      document.getElementById("app-loader-container").style.display = "none";
    }
    setTableType("poView");
    setPOView(true);
  }

  const showAlertUi = (show, errorText, s) => {
    if (s) {
      return Helpers.showWarningAppAlertUiContent(show, errorText);
    }
    return Helpers.showAppAlertUiContent(show, errorText);
  };

  const fetchPurchaseOrder = async (startDate, finishDate) => {
    console.log(startDate, finishDate)
    let pageNumber = 1;
    const PurchaseOrderResponse = await StockApiUtil.viewPurchaseOrders(genericSearchPageLimit, pageNumber, startDate, finishDate)
    if (PurchaseOrderResponse.hasError) {
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
        // showAlertUi(true, PurchaseOrderResponse.errorMessage);  //imp
    } else {
        if (mounted) {
            console.log(PurchaseOrderResponse);
            const purchaseData = PurchaseOrderResponse.purchase.data
            console.log(purchaseData)
            purchaseData.forEach((item, index, arr) => {
                item.delivery_datetime = moment(item.delivery_datetime).format(dateFormat)
                item.date = moment(item.date).format(dateFormat)
                purchaseData[index].menu = item.status === 'partial received'  ? <CustomTableAtionMenuItem tableItem={item}
                                                                                              tableItemId={item.grn_id ? item.grn_id : item.show_id}
                                                                                              tableItemMenuType="purchaseRequest"
                                                                                              handleTableMenuItemClick={handleTableMenuItemClick}/>
                    : item.status === 'open' ?  <CustomTableAtionMenuItem tableItem={item}
                    tableItemId={item.grn_id ? item.grn_id : item.show_id}
                    tableItemMenuType="purchaseRequest"
                    handleTableMenuItemClick={handleTableMenuItemClick}/> :
                    <em>-</em>

                purchaseData[index].quick_view = (
                    <Icon
                        iconName="Eye"
                        className="table-row-action-btn eye"
                        size={15}
                        onClick={(e) => handlePOQuickView(e, item)}
                    />
                )
                purchaseData[index].view = item.grn_id ? (    

                    <Link to={{
                        pathname: `/stock-control/purchase-orders/${item.grn_id}/grn-view`,
                        state: { grn_id: item.grn_id,
                        po_id: item.po_id,
                        date: item.date }
                      }}>View GRN</Link>

                ) : <em>-</em>
            })

            setAllData(purchaseData)
            setPaginationData(purchaseData)
        }
    }
  };

  function renderModalContent() {
    console.log(purchaseOrder);
    const { id, status, date, delivery_datetime, name, supplier_name } =
      purchaseOrder;

    // const type = returnProductStatus(status)

    return (
      <div className='modal__content'>
        <div className='mainContent_heading purchase__order--status modal_list'>
          <ul>
            <li>
              Name / Reference: <span>{name}</span>
            </li>

            <li>
              Status: <span className='status'>{status}</span>
            </li>
            <li>
              Ordered Date: <span>{formatDate(date)}</span>
            </li>

            <li>
              Supplier: <span>{supplier_name}</span>
            </li>
          </ul>

          <ul>
            <li>
              Order No: <span>{id}</span>
            </li>
            <li>
              Due date: <span>{formatDate(delivery_datetime)}</span>
            </li>
          </ul>
        </div>
        <div className={"page__table"}>
          <Table
            data={purchaseOrderModalTableData}
            columns={tableColumns}
            showPagination={true}
            totalRecords={purchaseOrderPaginationData.length}
            perPage={perPageNo}
            handlePagination={handlePaginationForViewProducts}
            loading={loading}
            render={({ data }) => {
              return isEmptyTableData(purchaseOrderModalTableData) &&
                !loading ? (
                <tbody>
                  <tr>
                    <td colSpan={tableColumns.length + 1}>
                      <div className='table-no-search-data'>
                        NO RESULTS FOUND
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : null;
            }}
          />
        </div>
      </div>
    );
  }

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handlePagination = async (id) => {
    // API call with page number (ie. id)
    console.log(id);

    setLoading(true);
    await delay(1000).then(() => {
      const d =
        paginationData &&
        paginationData.slice(perPageNo * (id - 1), perPageNo * id);
      setAllData(d);
    });
    setLoading(false);
  };
  const handlePaginationForViewProducts = async (id) => {
    // API call with page number (ie. id)
    console.log(id);
    setLoading(true);
    await delay(1000).then(() => {
      const d =
        purchaseOrderPaginationData &&
        purchaseOrderPaginationData.slice(perPageNo * (id - 1), perPageNo * id);
      setPurchaseOrderModalData(d);
    });
    setLoading(false);
  };
  const handleClosEditProductModal = () => {
    setForceClosePurchaseOrderView(false);
  };

  const renderEditProductModalContent = () => {
    return (
      <>
        <h2 style={{ marginBottom: "3rem" }}>
          Do you really want to Force Close '{forceCloseOrderName.name}'?
        </h2>
      </>
    );
  };
  async function ForceCloseGRN() {
    let id = forceCloseOrderName.po_id;
    console.log(id);
    const forceCloseGRNResponse = await StockApiUtil.forceCloseGRN(id);
    console.log(forceCloseGRNResponse);
    if (forceCloseGRNResponse.hasError) {
      showAlertUi(true, forceCloseGRNResponse.errorMessage);
      //message.warning(productsDiscountsViewResponse.errorMessage, 3);
      document.getElementById("app-loader-container").style.display = "none";
    } else {
      console.log("res -> ", forceCloseGRNResponse);
      showAlertUi(true, forceCloseGRNResponse.message, "s");
      document.getElementById("app-loader-container").style.display = "none";
      await fetchPurchaseOrder(startDate, finishDate);
      setForceClosePurchaseOrderView(false);
    }
  }
  function isEmptyTableData(data) {
    return data.length === 0;
  }

  return (
    <div className='page__table'>
      {tableType === "default" && (
        <Table
          data={allData}
          columns={tableColumns}
          showPagination={true}
          totalRecords={paginationData.length}
          perPage={perPageNo}
          handlePagination={handlePagination}
          loading={loading}
          render={({ data }) => {
            return isEmptyTableData(data) && !loading ? (
              <tbody>
                <tr>
                  <td colSpan={tableColumns.length + 1}>
                    <div className='table-no-search-data'>NO RESULTS FOUND</div>
                  </td>
                </tr>
              </tbody>
            ) : null;
          }}
        />
      )}

      {poView && (
        <Modal
          footerButtons={[
            {
              //disabled: true,
              isPrimary: false,
              onClick: () => {
                setTableType("default");
                setPOView(false);
              },
              text: "Cancel",
            },
            // {
            //     // disabled: !boxData,
            //     isPrimary: true,
            //     // onClick: handleAddBoxData,
            //     text: "print",
            // },
          ]}
          headerText='Purchase Order View'
          headerButtons={[]}
          height='600px'
          onBackdropClick={handleCloseModal}
          onClose={handleCloseModal}
          padding='20px 40px 20px 40px'
          render={renderModalContent}
          className='products-variants-modal'
          showCloseButton
          size='large'
          width='800px'
        />
      )}
      {forceClosePurchaseOrderView && (
        <Modal
          //headerText={`Edit Ordered Quantity For ${editProduct.product_name}`}
          headerButtons={[]}
          height='150px'
          onBackdropClick={handleClosEditProductModal}
          onClose={handleClosEditProductModal}
          padding='20px 40px 20px 40px'
          render={renderEditProductModalContent}
          className='edit-product-ordered-qty-modal'
          showCloseButton
          size='small'
          width='200px'
          footerButtons={[
            {
              isPrimary: true,
              onClick: ForceCloseGRN,
              text: "Save",
            },
            {
              isPrimary: false,
              onClick: handleClosEditProductModal,
              text: "Cancel",
            },
          ]}
        />
      )}
    </div>
  );
};

export default PurchaseOrderProductTable;
