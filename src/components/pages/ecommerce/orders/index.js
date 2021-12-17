import React, { useEffect, useState } from "react";
import { Navigation, TabItem, Tab } from "@teamfabric/copilot-ui";
import { Link, useHistory } from "react-router-dom";
import DateRangePicker from "../../../molecules/date_range_picker";

// components
import ButtonSearch from "../../../atoms/button_search";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import CustomSearch from "../../../atoms/search";
import SwitchOutlet from "../../../atoms/switch_outlet";
import PageTitle from "../../../organism/header";
import * as Helpers from "../../../../utils/helpers/scripts";
import * as EcommerceApiUtil from "../../../../utils/api/ecommerce-api-utils";
import OrderTableView from "../../../organism/table/order";
import ManualOrderTableView from "../../../organism/table/order/manual-order-table";
import PrintInvoiceTable from "../../register/new-sell/print-invoice-table";
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
  getSellInvoiceDataFromLocalStorage,
  saveDataIntoLocalStorage,
  clearDataFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import Constants from "../../../../utils/constants/constants";
import * as SetupApiUtil from "../../../../utils/api/setup-api-utils";

import moment from "moment";

const dateFormat = "YYYY-MM-DD";
let localStorageCacheData = null;

function Orders() {
  const [paginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [searchedData, setSearchedData] = useState(null);
  const [currentPageSearched, setCurrentPageSearched] = useState(1);
  const [inputSearchValue, setInputSearchValue] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const history = useHistory();
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [printInvoiceData, setPrintInvoiceData] = useState(null);
  const [localStorageUserData, setLocalStorageUserData] = useState("");
  const [templateData, setTemplateData] = useState(null);
  const [storeLocation, setStoreLocation] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");

  const tabsArray = ["confirmed", "pickup", "delivery", 'manual_returns'];
  let mounted = true;

  const handleSearchInputChange = async (value) => {
    setInputSearchValue(value);
  };
  useEffect(() => {
    let readFromLocalStorage = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    readFromLocalStorage = readFromLocalStorage?.data || null;
    if (readFromLocalStorage) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        localStorageCacheData = readFromLocalStorage; //vvv imp
        setLocalStorageUserData(readFromLocalStorage);
        // setCurrentLoggedSuperUserId(readFromLocalStorage.auth.super_user); //imp new one working correctly
        setStoreLocation(
          readFromLocalStorage?.store_location
        );
        fetchStoreData(readFromLocalStorage?.store_id); //vvvimp
      }
    }
  }, []);
  const fetchStoreData = async (currentStoreId) => {
    document.getElementById("app-loader-container").style.display = "block";
    const getOutletViewResponse = await SetupApiUtil.getOutletById(
      currentStoreId
    );
    console.log("getOutletViewResponse:", getOutletViewResponse);
    if (getOutletViewResponse.hasError) {
      console.log(
        "Cant fetch Store Data -> ",
        getOutletViewResponse.errorMessage
      );
      document.getElementById("app-loader-container").style.display = "none";
      // showAlertUi(true, getOutletViewResponse.errorMessage); //imp
    } else {
      document.getElementById("app-loader-container").style.display = "none";
      let selectedStore = getOutletViewResponse.store;
      getTemplateData(selectedStore?.template_id); //imp to get template data
    }
  };

  const getTemplateData = async (templateId) => {
    const getTepmlateResponse = await SetupApiUtil.getTemplateById(templateId);
    console.log("getTepmlateResponse:", getTepmlateResponse);
    if (getTepmlateResponse.hasError) {
      console.log(
        "Cant get template Data -> ",
        getTepmlateResponse.errorMessage
      );
    } else {
      const receivedTemplateData = getTepmlateResponse.template;
      setTemplateData(receivedTemplateData);
    }
  };

  const onSearch = async (inputValue) => {
    let searchValue = inputValue;
    if (searchValue === "") {
      // if empty value
      setSearchedData(null);
      setLoading(true);
      fetchAllOrdersData();
      return;
    }
    // setSearchedData(searchValue);
    // setLoading(true);
    // setCurrentPageSearched(1);    //imp
    // fetchSearchTaxes(paginationLimit, 1, searchValue);
  };

  // const fetchSearchTaxes = async () => {
  //   const taxesSearchResponse = await EcommerceApiUtil.getAllOrders();
  //   if (taxesSearchResponse.hasError) {
  //     setLoading(false);
  //     setData([]);  //imp
  //     showAlertUi(true, taxesSearchResponse.errorMessage);  //imp
  //   }
  //   else {
  //     if (mounted) {     //imp if unmounted
  //       const taxesSearchData = taxesSearchResponse.data.data;
  //       setData(taxesSearchData);
  //       setPaginationData(taxesSearchResponse?.data?.page || {});
  //       setLoading(false);
  //     }
  //   }

  // }
  const tableStatus = tabsArray.at(selectedTab);

  const fetchAllOrdersData = async (
    status,
    isSearch = true,
    tabChange = false
  ) => {
    let startDate = selectedDates[0]
      ? moment.utc(selectedDates[0])
      : moment.utc();
    let finishDate = selectedDates[1]
      ? moment.utc(selectedDates[1])
      : moment.utc();
    let apiData = {};
    const checkStatus = tabChange ? status : tableStatus;
    if (checkStatus === "pickup") {
      apiData.orderType = "Pick Up";
    }
    if (checkStatus === "delivery") {
      apiData.orderType = "Delivery Orders";
    }
    if (searchValue !== "" && isSearch) {
      apiData.orderId = searchValue;
    } else {
      apiData.startDate = startDate;
      apiData.endData = finishDate;
    }
    if (checkStatus !== "manual_returns") {
      try {
        document.getElementById("app-loader-container").style.display = "block";
        const taxesViewResponse = await EcommerceApiUtil.getAllOrders(apiData);
        const taxesData = taxesViewResponse.data.orders;
        setData(taxesData);
        setPaginationData({});
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      } catch (e) {
        setLoading(false);
        setData([]); //imp
        document.getElementById("app-loader-container").style.display = "none";
      }
    } else {
      try {
        const apiData = {};
        if (searchValue !== "" && isSearch) {
          apiData.orderId = searchValue
        }
        document.getElementById("app-loader-container").style.display = "block";
        const taxesViewResponse = await EcommerceApiUtil.getManualReturnOrders(apiData);
        const taxesData = taxesViewResponse?.manualReturns;
        setData(taxesData);
        setPaginationData({});
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      } catch (e) {
        setLoading(false);
        setData([]); //imp
        document.getElementById("app-loader-container").style.display = "none";
      }
    } 
   
  };

  useEffect(() => {
    fetchAllOrdersData();
    return () => {
      mounted = false;
    };
  }, []);

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchAllOrdersData(paginationLimit, currentPg);
  }

  function handleSearchedDataPageChange(currentPg) {
    setCurrentPageSearched(currentPg);
    setLoading(true);
    //fetchSearchTaxes(paginationLimit, currentPg, searchedData);
  }

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };
  const handleSelectOrder = (order) => {
    const findOrderExist = selectedOrders.find((or) => or._id === order._id);
    if (findOrderExist) {
      const filterOrders = selectedOrders.filter((or) => or._id !== order._id);
      setSelectedOrders(filterOrders);
    } else {
      setSelectedOrders([...selectedOrders, order]);
    }
  };
  const handleAllOrdersSelect = (e, isSelected) => {
    if (isSelected) {
      setSelectedOrders(data);
    } else {
      setSelectedOrders([]);
    }
  };

  const handleChangeSearchValue = (value) => {
    setSearchValue(value);
  };
  const handleClearSearch = () => {
    setSearchValue("");
    fetchAllOrdersData("", false);
  };
  const fetchSalesHistoryWithDateRange = (e) => {
    fetchAllOrdersData(tableStatus); //imp wirh updtaed page number new ver
  };
  const handleOrderView = (order) => {
    const OrderId = order?.orderId;
    history.push(`/ecommerce/orders/${OrderId}/view`);
  };
  const handletabChange = (index) => {
    setSelectedTab(index);
    const status = tabsArray.at(index);
    fetchAllOrdersData(status, true, true);
    // console.log("tabAtIndex", tabAtIndex);
  };
  const handleSearchByOrderId = () => {
    fetchAllOrdersData();
  };
  const handleCalenderChangeDateSelect = (values) => {
    let startDate = moment(values[0]).format(dateFormat);
    let finishDate = moment(values[1]).format(dateFormat);
    setSelectedDates([startDate, finishDate]);
  };
  const handlePrintInvoice = (order) => {
    setInvoiceNo(order?.orderId);
    const productsToPrint = [];
    for (const pro of order?.items) {
      productsToPrint.push({
        id: pro?._id || "",
        name: pro?.title || "",
        selectQty: pro?.quantity || 0,
        originalPrice: parseFloat(pro?.salePrice).toFixed(2) || 0,
        offer_price: parseFloat(pro?.specialPrice).toFixed(2) || 0,
      });
    }
    const subTotal = parseFloat(
      parseFloat(order?.orderTotal) -
        parseFloat(order?.orderDiscount) -
        parseFloat(order?.taxTotal)
    ).toFixed(2);
    const printInvoiceDataToSet = {
      completeReturn: false,
      subTotal: parseFloat(subTotal).toFixed(2) || 0,
      totalTax: parseFloat(order?.taxTotal).toFixed(2) || 0,
      totalDiscount: parseFloat(order?.orderDiscount).toFixed(2) || 0,
      totalAmount: parseFloat(order?.orderTotal).toFixed(2) || 0,
      paymentMethod: order?.paymentMethod || "",
      payed: parseFloat(order?.orderTotal).toFixed(2) || 0,
      toPay: 0,
      invoice_note: "",
      products: productsToPrint,
    };
    setPrintInvoiceData(printInvoiceDataToSet);
    printSalesOverview(); //imp first print then reset fields
  };
  const printSalesOverview = () => {
    var previewSalesInvoiceHtml = document.getElementById("printInvoiceTable");
    if (!previewSalesInvoiceHtml) {
      return;
    }
    previewSalesInvoiceHtml =
      document.getElementById("printInvoiceTable").innerHTML;
    var doc =
      '<html><head><title></title><link rel="stylesheet" type="text/css" href="/printInvoice.scss" /></head><body onload="window.print(); window.close();" >' +
      previewSalesInvoiceHtml +
      "</body></html>";
    /* NEW TAB OPEN PRINT */
    var popupWin = window.open(
      "",
      "_blank",
      "toolbar=no,scrollbars=yes,resizable=yes,top=100,left=400,width=500,height=500"
    );
    if (popupWin) {
      popupWin.document.open();
      //window.print(); window.close(); //'width: 80%, height=80%'
      popupWin.document.write(doc);
      popupWin.document.close(closeFunction()); //vvimp for autoprint
    }
  };
  const closeFunction = async () => {
    setPrintInvoiceData(null);
  };
  return (
    <section className="page orders">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="All Orders" />
      {/* <div className="page__buttons">
        <CustomButtonWithIcon
          text="Make Invoice"
          iconName="Add"
          disabled={true}
          // onClick={ExportToCsv}
        />
      </div> */}
      <div className="page__search">
        <CustomSearch
          disabled={false}
          placeholder="Search Order by Order Id"
          onChange={handleChangeSearchValue}
          handleEnterSearch={handleSearchByOrderId}
          onClearSearch={handleClearSearch}
          inputValue={searchValue}
        />
        <ButtonSearch
          text="Search"
          disabled={true}
          clickHandler={handleSearchByOrderId}
        />
      </div>
      <div className="page__body">
        <div className="page__date_picker">
          <DateRangePicker
            startDateLabel="Start Date"
            endDateLabel="End Date"
            isFilter={true}
            onCalenderDateSelect={handleCalenderChangeDateSelect}
            onFetchButtonClick={fetchSalesHistoryWithDateRange}
          />
        </div>
        {/* <div className="page__buttons">
        <CustomButtonWithIcon text="Fetch Orders" iconName="Add" />
        <Link to="/order_view">
          <CustomButtonWithIcon text="View Order" iconName="Add" />
        </Link>
      </div>

      <div className="page__search">
        <CustomSearch onChange={handleSearchInputChange} onClearSearch={onSearch} />
        <ButtonSearch text="Search" clickHandler={() => onSearch(inputSearchValue)} />
      </div>

      <div className="page__tabs">
        <Navigation
          className="primary"
          links={[
            {
              active: true,
              id: 1,
              label: "All Orders",
              url: "/orders",
            },
            {
              active: false,
              id: 2,
              label: "Sale Orders",
              url: "/",
            },
            {
              active: false,
              id: 3,
              label: "Completed Orders",
              url: "/",
            },
          ]}
          onClick={function noRefCheck() {}}
          orientation="horizontal"
        />
      </div> */}

        {/* Table */}

        <div className="page__tabs">
          <Tab
            variant="horizontal"
            heading=""
            navClassName="tabitem-space"
            tabChangeHandler={handletabChange}
            className="tabs_row"
          >
            <TabItem title="All Orders" active={selectedTab === 0}>
              {/* Table */}
              <OrderTableView
                pageLimit={paginationLimit}
                tableData={data}
                tableDataLoading={loading}
                onClickPageChanger={
                  searchedData ? handleSearchedDataPageChange : handlePageChange
                }
                currentPageIndex={
                  searchedData ? currentPageSearched : currentPage
                }
                paginationData={paginationData}
                tableType="ordertable"
                handleSelectOrder={handleSelectOrder}
                handleAllOrdersSelect={handleAllOrdersSelect}
                handleOrderView={handleOrderView}
                tableStatus={tableStatus}
                fetchAllOrdersData={fetchAllOrdersData}
                handlePrintInvoice={handlePrintInvoice}
              />
            </TabItem>
            <TabItem title="Pickup Orders" active={selectedTab === 1}>
              {/* Table */}
              <div className="page__table t-130">
                <OrderTableView
                  pageLimit={paginationLimit}
                  tableData={data}
                  tableDataLoading={loading}
                  onClickPageChanger={
                    searchedData
                      ? handleSearchedDataPageChange
                      : handlePageChange
                  }
                  currentPageIndex={
                    searchedData ? currentPageSearched : currentPage
                  }
                  paginationData={paginationData}
                  tableType="ordertable"
                  handleSelectOrder={handleSelectOrder}
                  handleAllOrdersSelect={handleAllOrdersSelect}
                  handleOrderView={handleOrderView}
                  tableStatus={tableStatus}
                  fetchAllOrdersData={fetchAllOrdersData}
                  handlePrintInvoice={handlePrintInvoice}
                />
              </div>
              {/* Table */}
            </TabItem>
            <TabItem title="Delivery Orders" active={selectedTab === 2}>
              {/* Table */}
              <div className="page__table t-130">
                <OrderTableView
                  pageLimit={paginationLimit}
                  tableData={data}
                  tableDataLoading={loading}
                  onClickPageChanger={
                    searchedData
                      ? handleSearchedDataPageChange
                      : handlePageChange
                  }
                  currentPageIndex={
                    searchedData ? currentPageSearched : currentPage
                  }
                  paginationData={paginationData}
                  tableType="ordertable"
                  handleSelectOrder={handleSelectOrder}
                  handleAllOrdersSelect={handleAllOrdersSelect}
                  handleOrderView={handleOrderView}
                  tableStatus={tableStatus}
                  fetchAllOrdersData={fetchAllOrdersData}
                  handlePrintInvoice={handlePrintInvoice}
                />
              </div>
              {/* Table */}
            </TabItem>
            <TabItem title="Manual Return Orders" active={selectedTab === 3}>
              {/* Table */}
              <div className="page__table t-130">
                <ManualOrderTableView
                  pageLimit={paginationLimit}
                  tableData={data}
                  tableDataLoading={loading}
                  onClickPageChanger={
                    searchedData
                      ? handleSearchedDataPageChange
                      : handlePageChange
                  }
                  currentPageIndex={
                    searchedData ? currentPageSearched : currentPage
                  }
                  paginationData={paginationData}
                  tableType="ordertable"
                  handleSelectOrder={handleSelectOrder}
                  handleAllOrdersSelect={handleAllOrdersSelect}
                  handleOrderView={handleOrderView}
                  tableStatus={tableStatus}
                  fetchAllOrdersData={fetchAllOrdersData}
                  handlePrintInvoice={handlePrintInvoice}
                />
              </div>
              {/* Table */}
            </TabItem>
          </Tab>
        </div>
      </div>
      {printInvoiceData && (
        <PrintInvoiceTable
          templateData={templateData}
          user={localStorageUserData}
          invoiceData={printInvoiceData}
          invoiceNo={invoiceNo}
        />
      )}
      {/* Table */}
    </section>
  );
}

export default Orders;
