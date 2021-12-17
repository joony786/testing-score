import React, { useState, useEffect } from "react";
import {
  Tab,
  TabItem,
  Pagination,
  Modal,
  Dropdown,
  Snackbar,
} from "@teamfabric/copilot-ui";
import moment from "moment";

// components
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
  getSellInvoiceDataFromLocalStorage,
  saveDataIntoLocalStorage,
  //clearDataFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import { useHistory, Link } from "react-router-dom";
import * as SetupApiUtil from "../../../../utils/api/setup-api-utils";
import * as SalesApiUtil from "../../../../utils/api/sales-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import Constants from "../../../../utils/constants/constants";
import SellHistoryInvoicesTable from "../../../organism/table/sell/sellHistoryInvoicesTable";
import PrintSalesInvoiceTable from "../sell/sellInvoice";

// components
import ButtonSearch from "../../../atoms/button_search";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import CustomSearch from "../../../atoms/search";
import SwitchOutlet from "../../../atoms/switch_outlet";
import DateRangePicker from "../../../molecules/date_range_picker";
import QuickViewModalContent from "../../../molecules/modal_table";
import PageTitle from "../../../organism/header";
import { isArray } from "lodash";
import Permissions from "../../../../utils/constants/user-permissions";
import * as PermissionsHelpers from "../../../../utils/helpers/check-user-permission";
import DynamicModal from "../../../atoms/modal";

const dateFormat = "YYYY-MM-DD";
let dataSearched = []; //imp for searching

function SalesHistory() {
  const history = useHistory();
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("continue-sales");
  const [salesHistoryData, setSalesHistoryData] = useState([]);
  const [selectedTabData, setSelectedTabData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [salesListLimitCheck, setSalesListLimitCheck] = useState(true);
  const [currentViewedInvoiceId, setCurrentViewedInvoiceId] = useState("");
  const [currentViewedInvoiceQuickViewId, setCurrentViewedInvoiceQuickViewId] =
    useState("");
  const [selectedInvoiceData, setSelectedInvoiceData] = useState("");
  const [selectedHistoryRecordData, setSelectedHistoryRecordData] =
    useState("");
  const [selectedQuickViewInvoiceData, setSelectedQuickViewInvoiceData] =
    useState("");
  const [quickViewInvoicePrintData, setQuickViewInvoicePrintData] =
    useState(null);
  const [isViewInvoiceModalVisible, setIsViewInvoiceModalVisible] =
    useState(false);
  const [localStorageData, setLocalStorageData] = useState("");
  const [isQuickViewInvoiceModalVisible, setIsQuickViewInvoiceModalVisible] =
    useState(false);
  const [localCurrentInvoice, setLocalCurrentInvoice] = useState("");
  const [loading, setLoading] = useState(true);
  const [templateData, setTemplateData] = useState(null);
  const [selectedDates, setselectedDates] = useState([]);
  const [inputSearchValue, setInputSearchValue] = useState("");
  const [currentLoggedSuperUserId, getCurrentLoggedSuperUserId] = useState("");
  const [dataQuerySearch, setDataQuerySearch] = useState({});
  const [showDateModal, setShowDateModal] = useState(false);
  const [invoicesSelectedDate, setInvoicesSelectedDates] = useState([]);
  const [snackerError, setSnackerError] = useState(false);
  const [snackerMessage, setSnackerMessage] = useState("");

  const showSnackerError = (message) => {
    setSnackerError(true);
    setSnackerMessage(message);
    setTimeout(() => {
      setSnackerError(false);
      setSnackerMessage("");
    }, 2000);
  };
  const moduleInvoiceAddCheck =
    PermissionsHelpers.checkUserModuleRolePermission(
      Permissions.USER_PERMISSIONS.WRITE.INVOICES
    );

  let mounted = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    const { isAll, isDead, invoiceStatus } = handleSetInvoiceStatus(currentTab); //imp new ver
    fetchSalesHistoryData(20, currentPage, isAll, isDead, invoiceStatus); //imp new ver

    let userData = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    userData = userData.data ? userData.data : null;

    if (userData) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        setLocalStorageData(userData);
        getUserStoreData(userData?.store_id); //imp to get user outlet data
        //getCurrentLoggedSuperUserId(userData.auth.super_user); //imp new one working correctly
      }
    }

    return () => {
      mounted = false;
    };
  }, []); //imp to render when history prop changes

  const registerScopeFilter = (scope) => {
    if (!scope || !localStorageData) {
      return true;
    }
    return true;
    // if (
    //   localStorageData.scopes.includes(scope) ||
    //   (localStorageData.scopes.includes("*") && scope !== "ecommerce")
    // ) {
    //   return true;
    // } else {
    //   return false;
    // }
  };

  const handleSearchInputChange = async (value) => {
    setInputSearchValue(value);
  };

  const onSearch = (inputSeachValue) => {
    let searchValue = inputSeachValue;
    searchValue = searchValue.toLowerCase();
    console.log("searchValue", searchValue);
    if (searchValue === "") {
      setLoading(true);
      const { isAll, isDead, invoiceStatus } =
        handleSetInvoiceStatus(currentTab); //imp new ver
      fetchSalesHistoryData(
        paginationLimit,
        currentPage,
        isAll,
        isDead,
        invoiceStatus
      ); //imp new ver
    } else {
      const { isAll, isDead, invoiceStatus } =
        handleSetInvoiceStatus(currentTab); //imp new ver
      fetchSalesHistoryData(
        paginationLimit,
        currentPage,
        isAll,
        isDead,
        invoiceStatus,
        true,
        inputSeachValue
      ); //imp new ver
    }
  };

  const fetchSalesHistoryData = async (
    pageLimit = 100,
    pageNumber = 1,
    isAll,
    isDead,
    invoiceStatus,
    isSearch,
    showId
  ) => {
    let startDate = selectedDates[0]
      ? selectedDates[0]
      : moment(new Date()).format(dateFormat);
    let finishDate = selectedDates[1]
      ? selectedDates[1]
      : moment(new Date()).format(dateFormat);

    document.getElementById("app-loader-container").style.display = "block";
    let dataToSend = {};
    if (isAll === 1) {
      dataToSend = {
        limit: pageLimit,
        page: pageNumber,
        startDate,
        finishDate: finishDate,
      };
    } else if (isDead === 1) {
      dataToSend = {
        limit: pageLimit,
        page: pageNumber,
        is_dead: isDead,
        startDate,
        finishDate: finishDate,
      };
    } else if (isSearch) {
      dataToSend = {
        status: invoiceStatus,
        show_id: showId,
        startDate,
        finishDate: finishDate,
      };
    } else {
      dataToSend = {
        limit: pageLimit,
        page: pageNumber,
        status: invoiceStatus,
        startDate,
        finishDate: finishDate,
      };
    }
    setDataQuerySearch(dataToSend);
    const salesHistoryViewResponse = await SalesApiUtil.getSalesHistory(
      dataToSend
    );
    console.log("salesHistoryViewResponse:", salesHistoryViewResponse);

    if (salesHistoryViewResponse.hasError) {
      console.log(
        "Cant fetch registered products Data -> ",
        salesHistoryViewResponse.errorMessage
      );
      setLoading(false);
      /*------------------new verion---------------------*/
      setSalesHistoryData([]);
      //handletabChangeData([]);                    //imp prev ver
      setSelectedTabData([]); //imp new ver
      handledSearchedDataResponse([]);
      setPaginationData({});
      /*------------------new verion---------------------*/
      document.getElementById("app-loader-container").style.display = "none";
      //message.warning(salesHistoryViewResponse.errorMessage, 3);
    } else {
      if (mounted) {
        //imp if unmounted
        var salesData =
          salesHistoryViewResponse?.invoices?.data ||
          salesHistoryViewResponse.invoice;
        const isArrayTest = isArray(salesData);
        if (!isArrayTest) {
          salesData = [salesData];
        }
        setSalesHistoryData(salesData);
        setPaginationData(salesHistoryViewResponse?.invoices?.page || {});
        /*-------setting sales data selection---------*/
        //handletabChangeData(salesData);           //imp prev ver
        setSelectedTabData(salesData); //imp new ver
        /*-------setting continue sales data---------*/
        /*----------handle data serching response------------*/
        handledSearchedDataResponse(salesData);
        /*-----------handle data serching response-----------*/
        setLoading(false);
        //document.getElementById('app-loader-container').style.display = "none";      //imp but prev ver
        //message.success(salesHistoryViewResponse.message, 3);
      }
    }
  };

  function handledSearchedDataResponse(dataResponse) {
    dataResponse.forEach((item) => {
      var foundObj = dataSearched.find((obj) => {
        return obj.id === item.id;
      });
      if (!foundObj) {
        dataSearched.push(item);
      }
    });

    document.getElementById("app-loader-container").style.display = "none";
  }

  const handleSetInvoiceStatus = (activeTab) => {
    let isAll = 0;
    let isDead = 0;
    let invoiceStatus;
    let status = 0;

    if (activeTab === Constants.REGISTER_SALES_HISTORY.CONTINUE_TAB_KEY) {
      invoiceStatus = "parked";
      status = 1;
    }
    if (activeTab === Constants.REGISTER_SALES_HISTORY.COMPLETED_TAB_KEY) {
      invoiceStatus = "completed";
      status = 0
    }
    if (activeTab === Constants.REGISTER_SALES_HISTORY.RETURNS_TAB_KEY) {
      invoiceStatus = "returned";
      status = 2;
    }
    if (activeTab === Constants.REGISTER_SALES_HISTORY.DEAD_TAB_KEY) {
      isDead = 1;
      status = "dead"
    }
    if (activeTab === Constants.REGISTER_SALES_HISTORY.ALL_TAB_KEY) {
      isAll = 1;
      status = "all"
    }

    return { isAll: isAll, isDead: isDead, invoiceStatus: invoiceStatus, status };
  };

  const handletabChange = (index) => {
    console.log(index);

    let key =
      index === 0
        ? Constants.REGISTER_SALES_HISTORY.CONTINUE_TAB_KEY
        : index === 1
        ? Constants.REGISTER_SALES_HISTORY.RETURNS_TAB_KEY
        : index === 2
        ? Constants.REGISTER_SALES_HISTORY.COMPLETED_TAB_KEY
        : index === 3
        ? Constants.REGISTER_SALES_HISTORY.DEAD_TAB_KEY
        : Constants.REGISTER_SALES_HISTORY.ALL_TAB_KEY;

    const { isAll, isDead, invoiceStatus } = handleSetInvoiceStatus(key);
    setCurrentTab(key); //imp better to set before fetch
    dataSearched = []; //imp new ver
    setCurrentPage(1); //imp new ver
    setInputSearchValue(""); //imp new ver
    setLoading(true);
    fetchSalesHistoryData(paginationLimit, 1, isAll, isDead, invoiceStatus); //imp new ver
  };

  function handleInvoiceSelection(tableRecord, status) {
    setCurrentViewedInvoiceId(tableRecord.invoice_id);
    console.log("tableRecord", tableRecord);
    /*-----------set user current invoice store-------------*/
    var localStorageCurrentInvoice = getDataFromLocalStorage(
      Constants.SELL_CURRENT_INVOICE_KEY
    );
    localStorageCurrentInvoice = localStorageCurrentInvoice.data
      ? localStorageCurrentInvoice.data
      : null;

    setLocalCurrentInvoice(localStorageCurrentInvoice);
    /*-----------set user current invoice store-------------*/

    if (
      localStorageCurrentInvoice &&
      status !== "return" &&
      status !== "parked"
    ) {
      setIsViewInvoiceModalVisible(true);
    } //cache invoice exists
    else {
      getSelectedInvoiceHistory(
        tableRecord.invoice_id,
        tableRecord.show_id,
        tableRecord.status
      );
    }
  }

  function handleInvoiceQuickViewSelection(tableRecord) {
    if (tableRecord) {
      setCurrentViewedInvoiceQuickViewId(tableRecord.invoice_id);
      setSelectedHistoryRecordData(tableRecord); //imp for quick view stats
      getSelectedQuickViewInvoiceHistory(tableRecord.invoice_id, tableRecord); //imp
    }
  }

  const returnToSaleInProgress = () => {
    history.push({
      pathname: "/register/sell",
    });
  };

  const saveAndContinue = () => {
    var localInvoiceQueue = getSellInvoiceDataFromLocalStorage(
      Constants.SELL_INVOICE_QUEUE_KEY
    );

    if (Helpers.var_check(localInvoiceQueue.data)) {
      localInvoiceQueue.data.push(localCurrentInvoice); //insert
      saveDataIntoLocalStorage("invoice_queue", localInvoiceQueue.data); //insert into cache
      //message.success("Invoice held", 3);
      saveDataIntoLocalStorage("current_invoice", null); ///imp make empty current invoice
    }

    getSelectedInvoiceHistory(currentViewedInvoiceId);
  };

  const handlePrintQuickSaleInvoice = () => {
    //console.log("print");
    printSalesOverview();
  };

  const printSalesOverview = () => {
    let previewSalesInvoiceHtml = document.getElementById("printSalesTable");
    if (!previewSalesInvoiceHtml) {
      return;
    }
    previewSalesInvoiceHtml =
      document.getElementById("printSalesTable").innerHTML;

    var doc =
      '<html><head><title></title><link rel="stylesheet" type="text/css" href="/printInvoice.scss" /></head><body onload="window.print(); window.close();">' +
      previewSalesInvoiceHtml +
      "</body></html>";
    /* NEW TAB OPEN PRINT */
    //var popupWin = window.open("", "_blank");
    var popupWin = window.open(
      "",
      "_blank",
      "toolbar=no,scrollbars=yes,resizable=yes,top=100,left=400,width=500,height=500"
    );
    if (popupWin) {
      popupWin.document.open();
      // window.print(); window.close(); 'width: 80%, height=80%'
      popupWin.document.write(doc);
      popupWin.document.close(); //vvimp for autoprint
    }
  };

  const getSelectedInvoiceHistory = async (invoiceId, showId) => {
    saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, null);
    const getSaleHistoryResponse = await SalesApiUtil.getSalesInvoiceHistory(
      showId
    );
    console.log("getSaleHistoryResponse:", getSaleHistoryResponse);

    if (getSaleHistoryResponse.hasError) {
      console.log(
        "Cant fetch registered products Data -> ",
        getSaleHistoryResponse.errorMessage
      );
      showAlertUi(true, getSaleHistoryResponse.errorMessage);
    } else {
      //message.success(getSaleHistoryResponse.message, 2);
      setSelectedInvoiceData(getSaleHistoryResponse);
      history.push({
        pathname: "/register/sell",
        selected_invoice_data: getSaleHistoryResponse,
        selected_invoice_id: invoiceId,
      });
    }
  };

  const getSelectedQuickViewInvoiceHistory = async (invoiceId, tableRecord) => {
    document.getElementById("app-loader-container").style.display = "block";
    let status = "completed";
    let getSaleHistoryResponse;

    if (tableRecord.status === "2") {
      status = "returned";
    } else if (tableRecord.status === "1") {
      status = "parked";
    }
    if (tableRecord.is_dead === "1") {
      const dataToSend = {
        show_id: tableRecord.show_id,
        invoice_details: 1,
        is_dead: 1,
      };
      getSaleHistoryResponse = await SalesApiUtil.getSalesHistory(dataToSend);
    } else {
      getSaleHistoryResponse =
        await SalesApiUtil.getSalesInvoiceHistoryWithStatus(
          tableRecord.show_id,
          status
        );
    }
    console.log("getSaleHistoryResponse:", getSaleHistoryResponse);

    if (getSaleHistoryResponse.hasError) {
      console.log(
        "Cant fetch registered products Data -> ",
        getSaleHistoryResponse.errorMessage
      );
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, getSaleHistoryResponse.errorMessage);
    } else {
      console.log("res -> ,  getSaleHistoryResponse", getSaleHistoryResponse);
      //message.success(getSaleHistoryResponse.message, 2);
      document.getElementById("app-loader-container").style.display = "none";
      let tableProducsData = getSaleHistoryResponse.invoices.invoice_products;
      const isPromotion = getSaleHistoryResponse?.invoices?.promotion_id;
      /*---------------------------------------------------*/
      for (let i in tableProducsData) {
        const difference = tableProducsData[i].sale_price - tableProducsData[i].discount_price;
        const discountValue = tableProducsData[i]?.discount - difference || 0;
        tableProducsData[i].qty = tableProducsData[i].quantity;
        if (isPromotion) {
        tableProducsData[i].product_sale_price =
          tableProducsData[i].discount_price - discountValue;  
        } else {
          tableProducsData[i].product_sale_price =
          tableProducsData[i].discount_price;  
        }
        tableProducsData[i].original_sale_price =
          tableProducsData[i].sale_price;
        if (tableProducsData[i]?.discount > 0) {
          if (tableProducsData[i].original_quantity < 0) {
            tableProducsData[i].offer_price =
              tableProducsData[i].sale_price -
              (tableProducsData[i]?.discount /
                tableProducsData[i]?.original_quantity) *
                -1;
          } else {
            tableProducsData[i].offer_price =
              tableProducsData[i].sale_price -
              tableProducsData[i]?.discount /
                tableProducsData[i]?.original_quantity;
          }
        }
        tableProducsData[i].tax_total = tableProducsData[i].tax_total;
        if (Helpers.var_check(tableProducsData[i].quantity)) {
          if (tableRecord.status === "0") {
            //onlt if sale is completed
            tableProducsData[i].quantity =
              parseInt(tableProducsData[i].quantity) > 0
                ? parseInt(tableProducsData[i].quantity)
                : parseInt(tableProducsData[i].quantity) * -1;
          }
        }
        if (Helpers.var_check(tableProducsData[i].sale_price))
          tableProducsData[i].sale_price = parseFloat(
            parseFloat(tableProducsData[i].sale_price).toFixed(2)
          );
        else tableProducsData[i].sale_price = 0;
      } //enf of for loop

      /*---------------------------------------------------*/
      let invoiceData = JSON.parse(JSON.stringify(tableRecord));
      //invoiceData.invoice_details = getSaleHistoryResponse.invoice_details;   no need now
      invoiceData.products = tableProducsData;

      invoiceData = {
        ...invoiceData,
        sale_total: invoiceData?.sub_total,
        tax_total: getSaleHistoryResponse.invoices.invoice_total_tax,
        inv_discount: invoiceData.discounted_amount || 0,
        invoice_show_id: invoiceData.show_id || "",
        invoice_note: invoiceData.note || "",
      };
      // if (
      //   !getSaleHistoryResponse?.promotion_id &&
      //   getSaleHistoryResponse?.is_returned === "1"
      // ) {

      // }
      if (invoiceData?.status === "2") {
        invoiceData.returnInvoice = true;
        invoiceData.sale_total = parseFloat(invoiceData?.sub_total);
        invoiceData.sale_total = parseFloat(invoiceData.sale_total).toFixed(2);
      }
      setSelectedQuickViewInvoiceData(tableProducsData); //impp
      /*for (var key in tableRecord) {
        // check if the property/key is defined in the object itself, not in parent
        if (selectedHistoryRecordData.hasOwnProperty(key)) {
          //console.log(key, dictionary[key]);
          invoiceData[key] = tableRecord[key];
        }
      }*/

      //console.log("print-data", invoiceData);
      setQuickViewInvoicePrintData(invoiceData);
      /*---------------------------------------------------*/
      setIsQuickViewInvoiceModalVisible(true); //imp false for to hide
    }
  };

  const handleCancelModal = () => {
    setIsViewInvoiceModalVisible(false);
  };

  const handleQuickViewCancelModal = () => {
    setIsQuickViewInvoiceModalVisible(false);
  };

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    const { isAll, isDead, invoiceStatus } = handleSetInvoiceStatus(currentTab); //imp new ver
    fetchSalesHistoryData(
      paginationLimit,
      currentPg,
      isAll,
      isDead,
      invoiceStatus
    ); //imp new ver
  }

  const ExportToCsv = async (e) => {
    if (salesHistoryData.length > 0) {
      document.getElementById("app-loader-container").style.display = "block";
    const { status } = handleSetInvoiceStatus(currentTab); //imp new ver
    let salesHistoryImportParams = {
      startDate: selectedDates[0] || moment(new Date()).format("YYYY-MM-DD"),
      endDate: selectedDates[1] || moment(new Date()).format("YYYY-MM-DD"),
      invoiceStatus: status,
    };
    const salesInvoicesExportResponse = await SalesApiUtil.exportSalesInvoices(salesHistoryImportParams);

    if (salesInvoicesExportResponse.hasError) {
      console.log(
        "Cant Export Parked Sales Invoices -> ",
        salesInvoicesExportResponse.errorMessage
      );

      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, salesInvoicesExportResponse.errorMessage);
    } else {
      /*---------------csv download--------------------------------*/
      if (mounted) {     //imp if unmounted
        const link = salesInvoicesExportResponse?.data?.data;
        let a = document.createElement('a');
        a.href = link;
        a.download = "invoices" + new Date().toUTCString() + ".csv";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //afterwards we remove the element again
        /*---------------csv download--------------------------------*/
       document.getElementById("app-loader-container").style.display = "none";
      }
    }
    } else {
      showAlertUi(true, "Sales History Data Not Found");
    }
  };

  const getUserStoreData = async (storeId) => {
    //document.getElementById('app-loader-container').style.display = "block";
    const getOutletViewResponse = await SetupApiUtil.getOutletById(storeId);
    console.log("getOutletViewResponse:", getOutletViewResponse);

    if (getOutletViewResponse.hasError) {
      console.log(
        "Cant fetch Store Data -> ",
        getOutletViewResponse.errorMessage
      );
      //document.getElementById('app-loader-container').style.display = "none";
    } else {
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
      //document.getElementById('app-loader-container').style.display = "none";
    } else {
      var receivedTemplateData = getTepmlateResponse.template;
      setTemplateData(receivedTemplateData);
      //document.getElementById('app-loader-container').style.display = "none";
    }
  };

  const fetchSalesHistoryWithDateRange = (e) => {
    //fetchSalesHistoryData(20, 1);     //imp here to call new one
    const { isAll, isDead, invoiceStatus } = handleSetInvoiceStatus(currentTab); //imp new ver
    fetchSalesHistoryData(10, 1, isAll, isDead, invoiceStatus); //imp wirh updtaed page number new ver
  };

  const handleCalenderChangeDateSelect = (values) => {
    if (values) {
      let startDate = moment(values[0]).format(dateFormat);
      let finishDate = moment(values[1]).format(dateFormat);
      setselectedDates([startDate, finishDate]);
    }
  };

  const renderQuickViewModalContent = (
    selectedHistoryRecord,
    selectedQuickViewInvoice,
    quickViewInvoicePrintData
  ) => {
    let quickViewModalHeading = `Invoice Sale Data - ${
      quickViewInvoicePrintData && quickViewInvoicePrintData.show_id
    }`;
    const date = moment(
      quickViewInvoicePrintData && quickViewInvoicePrintData.date
    ).format("ddd DD MMM, yyyy");
    let labelsHeading = {
      label1: "SUB-TOTAL:",
      label2: "Discount:",
      label3: "Tax:",
      label4: "Total:",
    };

    return (
      <QuickViewModalContent
        date={date}
        selectedHistoryRecordData={selectedHistoryRecord}
        invoiceTableData={selectedQuickViewInvoice}
        modalHeading={quickViewModalHeading}
        labels={labelsHeading}
      />
    );
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const handleSyncInvocies = () => {
    setShowDateModal(true);
  };
  /*let WomensWearAccountCheck = Helpers.WomensWearSuperUserAccountIds.includes(
    currentLoggedSuperUserId
  );*/
  // syncInvoices

  //console.log(dataSearched);
  // console.log("quickViewInvoicePrintData", quickViewInvoicePrintData);

  const handleCalenderInvoicesSync = (values) => {
    if (values) {
      let startDate = moment(values[0]).format(dateFormat);
      let finishDate = moment(values[1]).format(dateFormat);
      setInvoicesSelectedDates([startDate, finishDate]);
    }
  };
  const successAlerUi = (show, message) => {
    Helpers.showWarningAppAlertUiContent(show, message);
  };

  const onSyncInvoices = async () => {
    let startDate = invoicesSelectedDate[0]
      ? invoicesSelectedDate[0]
      : moment(new Date()).format(dateFormat);
    let finishDate = invoicesSelectedDate[1]
      ? invoicesSelectedDate[1]
      : moment(new Date()).format(dateFormat);
    const data = {
      startDate: startDate,
      endDate: finishDate,
    };
    document.getElementById("app-loader-container").style.display = "block";
    const responseSync = await SalesApiUtil.syncInvoices(data);
    if (responseSync.hasError) {
      showSnackerError(responseSync.errorMessage);
      document.getElementById("app-loader-container").style.display = "none";
    } else {
      document.getElementById("app-loader-container").style.display = "none";
      setShowDateModal(false);
      successAlerUi(true, "Invoices Sync Successfully.");
    }
  };
  const DateModalRender = () => {
    return (
      <div className="page__date_picker modal_date_picker">
        <div className="form__row">
          <Snackbar
            dismissable
            height="60px"
            kind="alert"
            position="top-center"
            label={snackerMessage}
            onDismiss={() => {
              setSnackerMessage("");
              setSnackerError(false);
            }}
            zIndex={10000}
            show={snackerError}
            width="600px"
            withIcon
          />
        </div>
        <br />
        <DateRangePicker
          buttonText="Sync Invoices"
          startDateLabel="Start Date"
          endDateLabel="End Date"
          isFilter={false}
          onCalenderDateSelect={handleCalenderInvoicesSync}
          onFetchButtonClick={onSyncInvoices}
        />
      </div>
    );
  };
  const onCancelDateModal = () => {
    setShowDateModal(false);
  };
  return (
    <section className="page sales_history">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Sales History" />

      <div className="page__buttons">
        {moduleInvoiceAddCheck && (
          <Link to="/register/sell">
            <CustomButtonWithIcon text="New Sale" iconName="Add" />
          </Link>
        )}
        {/* {currentTab === Constants.REGISTER_SALES_HISTORY.CONTINUE_TAB_KEY && ( */}
          <CustomButtonWithIcon
            text="Export CSV"
            iconName="Add"
            onClick={ExportToCsv}
          />
        {/* )} */}
        <CustomButtonWithIcon
          text="Sync Invoices"
          iconName="Add"
          onClick={handleSyncInvocies}
        />
      </div>

      <div className="page__search">
        <CustomSearch
          placeholder="Search by Receipt No"
          onChange={handleSearchInputChange}
          onClearSearch={onSearch}
          handleEnterSearch={() => onSearch(inputSearchValue)}
          inputValue={inputSearchValue}
        />
        <ButtonSearch
          text="Search"
          clickHandler={() => onSearch(inputSearchValue)}
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

        <div className="page__tabs">
          <Tab
            variant="horizontal"
            heading=""
            navClassName="tabitem-space"
            tabChangeHandler={handletabChange}
            className="tabs_row"
          >
            <TabItem title="Continue Sales">
              {/* Table */}
              <div>
                <div className="page__table t-100">
                  <SellHistoryInvoicesTable
                    tableData={selectedTabData}
                    pageLimit={paginationLimit}
                    paginationData={paginationData}
                    tableDataLoading={loading}
                    onInvoiceSelection={handleInvoiceSelection}
                    tableType={
                      Constants.REGISTER_SALES_HISTORY.CONTINUE_TAB_KEY
                    }
                  />
                </div>
              </div>
              {/* Table */}
            </TabItem>
            <TabItem title="Returns">
              {/* Table */}
              <div className="page__table t-100">
                <SellHistoryInvoicesTable
                  tableData={selectedTabData}
                  tableDataLoading={loading}
                  pageLimit={paginationLimit}
                  paginationData={paginationData}
                  onInvoiceQuickViewSelection={handleInvoiceQuickViewSelection}
                  tableType={Constants.REGISTER_SALES_HISTORY.RETURNS_TAB_KEY}
                />
              </div>
              {/* Table */}
            </TabItem>
            <TabItem title="Completed">
              {/* Table */}
              <div className="page__table t-100">
                <SellHistoryInvoicesTable
                  tableData={selectedTabData}
                  tableDataLoading={loading}
                  pageLimit={paginationLimit}
                  paginationData={paginationData}
                  onInvoiceSelection={handleInvoiceSelection}
                  onInvoiceQuickViewSelection={handleInvoiceQuickViewSelection}
                  tableType={Constants.REGISTER_SALES_HISTORY.COMPLETED_TAB_KEY}
                  registerProcessReturn={registerScopeFilter("process_returns")}
                  salesHistoryData={salesHistoryData}
                />
              </div>
              {/* Table */}
            </TabItem>
            <TabItem title="Dead Sales">
              {/* Table */}
              <div className="page__table t-100">
                <SellHistoryInvoicesTable
                  tableData={selectedTabData}
                  tableDataLoading={loading}
                  pageLimit={paginationLimit}
                  paginationData={paginationData}
                  onInvoiceQuickViewSelection={handleInvoiceQuickViewSelection}
                  tableType={Constants.REGISTER_SALES_HISTORY.DEAD_TAB_KEY}
                />
              </div>
              {/* Table */}
            </TabItem>
            <TabItem title="All Sales">
              {/* Table */}
              <div className="page__table t-100">
                <SellHistoryInvoicesTable
                  tableData={selectedTabData}
                  pageLimit={paginationLimit}
                  paginationData={paginationData}
                  tableDataLoading={loading}
                  onInvoiceSelection={handleInvoiceSelection}
                  onInvoiceQuickViewSelection={handleInvoiceQuickViewSelection}
                  tableType={Constants.REGISTER_SALES_HISTORY.ALL_TAB_KEY}
                  registerProcessReturn={registerScopeFilter("process_returns")}
                />
              </div>
              {/* Table */}
            </TabItem>
          </Tab>
        </div>

        {/*------------------------quick-view-print--modal---------------------------*/}
        {isQuickViewInvoiceModalVisible && (
          <Modal
            //headerText={`Edit Ordered Quantity For ${editProduct.product_name}`}
            headerButtons={[]}
            //height="150px"
            onBackdropClick={handleQuickViewCancelModal}
            onClose={handleQuickViewCancelModal}
            //padding="20px 40px 20px 40px"
            render={() =>
              renderQuickViewModalContent(
                selectedHistoryRecordData,
                selectedQuickViewInvoiceData,
                quickViewInvoicePrintData
              )
            }
            //className=""
            showCloseButton
            size="medium"
            className="custom_modal_table"
            //width="500px"
            footerButtons={[
              {
                isPrimary: false,
                onClick: handleQuickViewCancelModal,
                text: "Cancel",
              },
              {
                isPrimary: true,
                onClick: handlePrintQuickSaleInvoice,
                text: "Print",
              },
            ]}
          />
        )}

        {/*--------------------------edit column-value--modal---------------------------*/}

        <Pagination
          handlePagination={handlePageChange}
          perPage={parseInt(paginationLimit)}
          //setCaption={handlePaginationCaption}
          totalRecords={paginationData && paginationData.totalElements}
          activePageNumber={currentPage}
        />

        {/* print sales overview */}
        {quickViewInvoicePrintData && (
          <PrintSalesInvoiceTable
            user={localStorageData}
            selectedOutletTemplateData={templateData}
            invoice={quickViewInvoicePrintData}
            invoiceType={"quick_view"}
          />
        )}

        {showDateModal && (
          <DynamicModal
            className="web-order-modal"
            heading="Select Date Range"
            size="medium"
            isCustomSize={false}
            // width={"800px"}
            height={"400px"}
            isCancelButton={true}
            isConfirmButton={false}
            onCancel={onCancelDateModal}
            renderModalContent={DateModalRender}
            onConfirm={onCancelDateModal}
          />
        )}
        {/* print sales overview */}
      </div>
    </section>
  );
}

export default SalesHistory;
