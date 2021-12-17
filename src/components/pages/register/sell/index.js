import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Dropdown,
  Modal,
  AutoComplete,
  Icon,
  Loading,
  Calendar,
  Radio,
} from "@teamfabric/copilot-ui";
import moment from "moment";

// components
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
  getSellInvoiceDataFromLocalStorage,
  saveDataIntoLocalStorage,
  clearDataFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import { useHistory } from "react-router-dom";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import * as ProductsApiUtil from "../../../../utils/api/products-api-utils";
import * as SetupApiUtil from "../../../../utils/api/setup-api-utils";
import * as SalesApiUtil from "../../../../utils/api/sales-api-utils";
import * as CouriersApiUtil from "../../../../utils/api/couriers-api-utils";
import * as CustomersApiUtil from "../../../../utils/api/customer-api-utils";
import * as WebOrdersApiUtil from "../../../../utils/api/web-orders-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import {
  createPayloadToSave,
  promotionPayload,
  calculateTotalData,
} from "../../../../utils/helpers/web-orders";
import Constants from "../../../../utils/constants/constants";
import SwitchOutlet from "../../../atoms/switch_outlet";
import PageTitle from "../../../organism/header";
import SellNestedProductsTable from "../../../organism/table/sell/sellNestedProductsTable";
import PrintSalesInvoiceTable from "./sellInvoice";
import Customer_Card from "../../../molecules/customer_card";
import short from "short-uuid";
import DynamicModal from "../../../atoms/modal";
import WebOrders from "./web-orders";
import ReturnWebOrders from "./return-web-orders";

let localStorageCacheData = null;
let currentReceiptNumber = null;
let customerTimeout = null;
let productTimeout = null;
//let mopType = "";
const timeFormat = "HH:mm:ss";
const todayDate = moment().format("yyyy/MM/DD");
const calenderMaxDate = new Date();

function Sell() {
  const history = useHistory();
  const [componentMount, setComponentMount] = useState(false);
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [customersShow, setCustomersShow] = useState(false);
  const [customersSearchLoading, setCustomersSearchLoading] = useState(false);
  const [productsSearchLoading, setProductsSearchLoading] = useState(false);
  const [saleInvoiceData, setSaleInvoiceData] = useState(null);
  const [shortUUID, setShortUUID] = useState("");
  const [registereProductsData, setRegistereProductsData] = useState([]);
  const [productsSearchResult, setProductsSearchResult] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedSearchValue, setSelectedSearchValue] = useState("");
  const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
  const [productsTableData, setProductsTableData] = useState([]);
  // const [couriersData, setCouriersData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [localStorageData, setLocalStorageData] = useState("");
  const [isMopModalVisible, setIsMopModalVisible] = useState(false);
  const [selectedCutomer, setSelectedCutomer] = useState("");
  const [selectedCustomerValue, setSelectedCustomerValue] = useState("");
  const [productsTotalAmount, setProductsTotalAmount] = useState(0);
  const [paidAmountValue, setPaidAmountValue] = useState(0);
  const [discountInputChangeValue, setDiscountInputChangeValue] = useState(0);
  const [invoiceNoteValue, setInvoiceNoteValue] = useState("");
  const [courierData, setCourierData] = useState({});
  const [taxCategoryChangeData, setTaxCategoryChangeData] = useState({});
  const [syncStatus, setSyncStatus] = useState(false);
  const [templateData, setTemplateData] = useState(null);
  const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState(0);
  const [networkStatus, setNetworkStatus] = useState(window.navigator.onLine); //imp
  //const [refreshStatus, setRefreshStatus] = useState(false);
  const [calenderDate, setCalenderDate] = useState(todayDate);
  const [currentLoggedSuperUserId, setCurrentLoggedSuperUserId] = useState("");
  const [mopType, setMopType] = useState("Cash");
  const [webOrderModal, setWebOrderModal] = useState(false);
  const [invoiceStatusToCreate, setInvoiceStatusToCreate] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [totalInvoiceDiscount, setTotalInvoiceDiscount] = useState(0);

  let mounted = true;
  const isRetunredInvoice = saleInvoiceData?.oldStatus === "0";

  useEffect(() => {
    /*-----------set user cache data------------*/
    let readFromLocalStorage = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    let invoiceCacheData = getDataFromLocalStorage(
      Constants.SELL_CURRENT_INVOICE_KEY
    );
    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;
    if (readFromLocalStorage) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        localStorageCacheData = readFromLocalStorage; //vvv imp
        setLocalStorageData(readFromLocalStorage);
        setCurrentLoggedSuperUserId(readFromLocalStorage.auth.super_user); //imp new one working correctly
        setStoreLocation(readFromLocalStorage.auth.Store_info.Store_location);
        fetchApisData(readFromLocalStorage.auth.Store_info.Store_id); //vvvimp
      }
    }
    if (invoiceCacheData?.data) {
      setSaleInvoiceData(invoiceCacheData?.data);
    }
    /*-----------set user cache data------------*/

    /*-----------------network status hooks----------------------*/
    window.addEventListener("offline", function (e) {
      setNetworkStatus(false);
      //console.log('offline');
    });
    window.addEventListener("online", function (e) {
      setNetworkStatus(true);
      //console.log('online');
    });

    /*---------------------------------------*/

    return () => {
      console.log("unmount");
      saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, null); //imp new one
      mounted = false;
    };
    setComponentMount(true);
  }, []);
  const inputRef = useRef(null);

  const fetchApisData = async (currentStoreId) => {
    document.getElementById("app-loader-container").style.display = "block";

    await Promise.all([
      // fetchRegisteredProductsData(),
      // fetchCouriersData(),
      getUserStoreData(currentStoreId),
      // getCurrentInvoiceNumber(),
    ]);

    document.getElementById("app-loader-container").style.display = "none";

    if (history.location.selected_invoice_data === undefined) {
      startInvoice();
    }
    if (history.location.selected_invoice_data !== undefined) {
      handleReturnedSaleProcess();
    }
  };

  const handleReturnedSaleProcess = async () => {
    //console.log("inside-processs-return-handler");
    let selectedViewedInvoice = history.location.selected_invoice_data;
    const productsData = [];
    if (
      selectedViewedInvoice &&
      selectedViewedInvoice.invoices &&
      selectedViewedInvoice.invoices.invoice_products.length > 0
    ) {
      for (const pro of selectedViewedInvoice?.invoices?.invoice_products) {
        productsData.push({
          ...pro,
          id: pro.product_id,
          qty: pro.quantity,
          prices: {
            sale_price: pro.sale_price,
          },
        });
      }
    }

    selectedViewedInvoice = {
      invoice_details: selectedViewedInvoice.invoices,
      invoices: productsData,
    };
    const customerId =
      selectedViewedInvoice?.invoice_details?.customer_id || "";
    if (customerId) {
      const customerRes = await CustomersApiUtil.getSingleCustomer(customerId);
      if (!customerRes.hasError) {
        setSelectedCutomer(customerRes.customer[0]);
      }
    }

    console.log("invoice-imp-for-returns", selectedViewedInvoice);
    let tmpInvoice = await createNewInvoice(
      "returns sale",
      selectedViewedInvoice.invoice_details
    );
    let rt = false;
    let saleStatus = "";
    if (selectedViewedInvoice.status_invoice == 0) {
      rt = true;
      tmpInvoice.saleStatus = "returned";
    }
    if (selectedViewedInvoice.status_invoice == 1) {
      tmpInvoice.saleStatus = "parked";
    }
    tmpInvoice.OldInvoiceNo = history.location.selected_invoice_id;
    tmpInvoice.discountVal =
      selectedViewedInvoice?.invoice_details?.discount_percentage; /*imp pending for now */
    tmpInvoice.products = selectedViewedInvoice.invoices;
    tmpInvoice.return = rt;
    if (selectedViewedInvoice.hasCustomer == true) {
      tmpInvoice.customer = selectedViewedInvoice.customer;
      tmpInvoice.hasCustomer = true;
    }

    saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, tmpInvoice);
    //console.log(tmpInvoice);
    updateCart(tmpInvoice); //imp new one ver //imp to pass true in case of loacal invoice total paid value
  };

  // const fetchRegisteredProductsData = async () => {
  //   //document.getElementById('app-loader-container').style.display = "block";
  //   const productsDiscountsViewResponse =
  //     await ProductsApiUtil.getFullRegisteredProducts();
  //   console.log(
  //     " productsDiscountsViewResponse:",
  //     productsDiscountsViewResponse
  //   );

  //   if (productsDiscountsViewResponse.hasError) {
  //     console.log(
  //       "Cant fetch registered products Data -> ",
  //       productsDiscountsViewResponse.errorMessage
  //     );
  //     //document.getElementById('app-loader-container').style.display = "none";
  //     showAlertUi(true, productsDiscountsViewResponse.errorMessage); //imp
  //     // history.push({
  //     //   pathname: "/register/salesHistory",
  //     // });
  //   } else {
  //     console.log("res -> ", productsDiscountsViewResponse);

  //     if (mounted) {
  //       //imp if unmounted
  //       //message.success(productsDiscountsViewResponse.message, 3);
  //       /*-------for filtering products--------*/
  //       var products =
  //         productsDiscountsViewResponse.products.data ||
  //         productsDiscountsViewResponse.products;

  //       for (let i in products) {
  //         var searchName = products[i].product_name;
  //         if (Helpers.var_check_updated(products[i].product_variant1_value)) {
  //           searchName += " / " + products[i].product_variant1_value;
  //         }
  //         if (Helpers.var_check_updated(products[i].product_variant2_value)) {
  //           searchName += " / " + products[i].product_variant2_value;
  //         }
  //         products[i].searchName = searchName;
  //         //products[i].qty = 0;   //imp but not set here ,set at addorder
  //       }

  //       setRegistereProductsData(products);

  //       /*-------for filtering products--------*/
  //       //document.getElementById('app-loader-container').style.display = "none";
  //     }
  //   }
  // };

  ////////////////imp funcyionality////////////////////
  ////////////////imp funcyionality////////////////////
  ////////////////imp funcyionality////////////////////

  const startInvoice = async () => {
    //console.log("start-invoice");
    let readFromLocalStorage = getDataFromLocalStorage(
      Constants.SELL_CURRENT_INVOICE_KEY
    );
    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;

    let currentInvoice = {};

    if (readFromLocalStorage) {
      //currentInvoice = readFromLocalStorage;   //imp prev version
      /*-------------------------new version-------------------------*/
      for (var key in readFromLocalStorage) {
        if (readFromLocalStorage.hasOwnProperty(key)) {
          //console.log(key + "-" + readFromLocalStorage[key]);
          currentInvoice[key] = readFromLocalStorage[key];
        }
      }
      /*-------------------------new version-------------------------*/
      //console.log("imp-here-local-storage");
      updateCart(currentInvoice, true); //imp to pass true in case of loacal invoice total paid value
    } else {
      currentInvoice = await createNewInvoice(); //imp await to be here
      //console.log("imp->currentInvoice", currentInvoice);

      //console.log("see1", currentInvoice);
      updateCart(currentInvoice);
    }
  };

  ////////////////imp functionality////////////////////

  // Invoice addInvoiceRequest Function
  const addInvoiceRequest = async (saleInvoiceData, status) => {
    let localCurrentInvoiceData = getDataFromLocalStorage(
      Constants.SELL_CURRENT_INVOICE_KEY
    );

    localCurrentInvoiceData = localCurrentInvoiceData.data
      ? localCurrentInvoiceData.data
      : null;

    console.log("imp-local-invoice-inside-request-add->", saleInvoiceData);
    const invoiceNumber = saleInvoiceData?.show_id || short.generate();
    const invoiceDataToSave = {
      customer_id: selectedCutomer.id,
      date: calenderDate,
      status: status,
      discount:
        totalInvoiceDiscount > 0 || isRetunredInvoice
          ? totalInvoiceDiscount
          : saleInvoiceData.discountAmount,
      shipping_address: storeLocation,
      billing_address: storeLocation,
      payment_method: mopType || "Cash",
      invoice_note: invoiceNoteValue,
      invoice_number: invoiceNumber,
    };
    const invoiceProducts = [];
    let promotionDis = 0;
    for (const product of saleInvoiceData.products) {
      invoiceProducts.push({
        product_id: product.id,
        quantity: product.qty,
        discount: product.discounted_amount,
        promotions:
          product.promotions || product?.invoice_item_promotions || [],
      });
      if (product?.promotions?.length) {
        invoiceDataToSave.promotion_id = product.promotions[0].promotion_id;
        invoiceDataToSave.promotion_title =
          product.promotions[0].promotion_title;
        invoiceDataToSave.promotion_value =
          product.promotions[0].promotion_value;
      }
      promotionDis = promotionDis + product.discounted_amount;
    }

    invoiceDataToSave.invoice_products = invoiceProducts;
    let registerInvoiceResponse;
    //document.getElementById('app-loader-container').style.display = "block";
    if (
      saleInvoiceData?.show_id &&
      (saleInvoiceData?.oldStatus === "1" || saleInvoiceData?.oldStatus === "0")
    ) {
      if (saleInvoiceData?.oldStatus === "0") {
        const returnCount = parseInt(saleInvoiceData?.returnCount || "0");
        invoiceDataToSave.invoice_number = `${
          invoiceDataToSave.invoice_number
        }-${returnCount + 1}`;
        invoiceDataToSave.status = "returned";
        setInvoiceStatusToCreate("returned");
        if (saleInvoiceData?.promotion_id) {
          invoiceDataToSave.promotion_id = saleInvoiceData?.promotion_id;
          invoiceDataToSave.promotion_title = saleInvoiceData?.promotion_title;
          invoiceDataToSave.promotion_value = saleInvoiceData?.promotion_value;
          setSaleInvoiceData({
            ...saleInvoiceData,
            payed: saleInvoiceData?.total,
            total:
              saleInvoiceData?.sub_total -
              saleInvoiceData?.tax * -1 -
              parseFloat(promotionDis),
            discountAmount: -parseFloat(promotionDis),
          });
        }
      }
      registerInvoiceResponse = await SalesApiUtil.updateRegisterInvoice(
        invoiceDataToSave,
        saleInvoiceData.OldInvoiceNo
      );
    } else {
      setInvoiceStatusToCreate("completed");
      registerInvoiceResponse = await SalesApiUtil.registerInvoice({
        invoices: [invoiceDataToSave],
      });
    }
    if (registerInvoiceResponse.hasError) {
      console.log(
        "Cant add registered Invoice Data -> ",
        registerInvoiceResponse.errorMessage
      );
      console.log("Fail");
      //document.getElementById('app-loader-container').style.display = "block";
      showAlertUi(true, registerInvoiceResponse.errorMessage);
      return "failure"; //imp message must be exact
    } else {
      let invoicesData = registerInvoiceResponse.Invoices_added;
      setShortUUID(invoiceDataToSave.invoice_number);
      console.log("add-invoice-request-response", invoicesData);
      //document.getElementById('app-loader-container').style.display = "none";
      return "success"; //imp message must be exact
    }
  };
  console.log("saleInvoiceData in retunr", saleInvoiceData);

  // const getCurrentInvoiceNumber = async (returnSale = "") => {
  //   const getInvoieNumberResponse =
  //     await SalesApiUtil.getCurrentInvoiceNumber();
  //   console.log("getInvoieNumberResponse:", getInvoieNumberResponse);
  //   if (getInvoieNumberResponse.hasError) {
  //     console.log(
  //       "Cant getInvoieNumber -> ",
  //       getInvoieNumberResponse.errorMessage
  //     );
  //     showAlertUi(true, getInvoieNumberResponse.errorMessage);
  //     currentReceiptNumber = null; //imp
  //   } else {
  //     if (mounted) {
  //       //imp if unmounted
  //       //message.success(couriersViewResponse.message, 3);
  //       let invNoRes = getInvoieNumberResponse.invoice_number;
  //       currentReceiptNumber = invNoRes; //imp
  //     }
  //   }
  // };
  ////////////////imp functionality////////////////////

  ////////////////imp functionality////////////////////

  ////////////////imp functionality////////////////////

  async function createNewInvoice(clearSaleVal = "", returnsSaleObj = null) {
    /*-----------imp new ver for actuall receipt no------------*/
    let currInvoiceNo;
    if (networkStatus) {
      //online
      if (clearSaleVal === "clear sale" || clearSaleVal === "dead sale") {
        currInvoiceNo = currentReceiptNumber;
      } else {
        if (clearSaleVal === "returns sale") {
          currInvoiceNo =
            returnsSaleObj && parseInt(returnsSaleObj.invoice_show_id);
        } else {
          currInvoiceNo = currentReceiptNumber;
        }
      }
      //console.log("currInvoiceNo", currInvoiceNo);
    }
    /*-----------imp new ver for actuall receipt no------------*/
    console.log(
      "returnsSaleObj?.discounted_amount",
      returnsSaleObj?.discounted_amount,
      returnsSaleObj
    );
    let discountValue = 0;
    const isPromotionSale = returnsSaleObj?.promotion_id;
    const isDiscount = returnsSaleObj && returnsSaleObj?.discounted_amount > 0;
    console.log("isDiscount", isDiscount);
    if (isDiscount && !returnsSaleObj?.promotion_id) {
      discountValue =
        (100 *
          (returnsSaleObj?.sub_total - returnsSaleObj?.discounted_amount)) /
        returnsSaleObj?.sub_total;
      discountValue = 100 - discountValue;
      console.log("discountValue", discountValue);
      setTotalInvoiceDiscount(0);
    }
    // $scope.invoice
    var data = {};
    data.isDiscount = false;
    data.show_id = returnsSaleObj?.show_id || "";
    data.oldStatus = returnsSaleObj?.status || "";
    data.returnCount = returnsSaleObj?.return_count || "";
    data.oldDiscountVal = parseFloat(discountValue) || 0;
    data.dateTime = moment(new Date()).format("yyyy/MM/DD HH:mm:ss"); //imp prev ver
    //data.invoiceNo = Helpers.uniqid();                                   //imp prev ver
    data.invoiceNo = Helpers.makeUniqueReceiptId(20); //generate 20 chars aplanumeric code
    //data.invoiceNo = uuid();
    data.OldInvoiceNo = "";
    data.store_id = localStorageCacheData.auth.store_random;
    data.user_id = localStorageCacheData.user_info.user_random;
    data.method = "Cash";
    data.status = "current";
    data.products = [];
    data.tax = 0;
    data.total = 0;
    data.sub_total = 0;
    data.payed = 0;
    data.return = false;
    data.customer = {};
    data.discountVal = discountValue;
    data.hasCustomer = false;
    data.discountAmount = 0;
    data.courier_code = "";
    data.saleStatus = "new_sale";
    if (isDiscount && returnsSaleObj?.promotion_id) {
      let discountCount = 0;
      for (const pro of returnsSaleObj?.invoice_products) {
        discountCount = discountCount + pro.quantity * pro.discount;
      }
      data.promotion_id = returnsSaleObj?.promotion_id;
      data.promotion_value = returnsSaleObj?.promotion_value;
      data.promotion_title = returnsSaleObj?.promotion_title;
      setTotalInvoiceDiscount(parseFloat(discountCount * -1));
      returnsSaleObj.sale_total = returnsSaleObj?.sale_total - discountCount;
      data.discounted_amount = discountCount;
      discountValue = 0;
    } else {
      setTotalInvoiceDiscount(0);
    }
    setSaleInvoiceData(data);
    setInvoiceCouponApplied(false);
    setInvoicePromotionApplied(false);
    setInvoiceSalePriceApplied(false);
    setInvoiceCouponValue("");
    return data;
  }
  console.log("totalInvoiceDiscount", totalInvoiceDiscount);
  function updateCart(
    invoiceData,
    localStorageInvoiceTotalPayedCheck = false,
    isPromoApplied = false,
    totalDisPromotions
  ) {
    const returnedInvoice = invoiceData?.oldStatus === "0";
    console.log("invoiceDataonly", invoiceData);
    //var costFormValues = costForm.getFieldsValue();

    //console.log(formValues);
    //console.log(costFormValues);

    //var clonedInvoiceData = JSON.parse(JSON.stringify(invoiceData));
    //var clonedInvoiceData = { ...invoiceData };   //imp prev version
    let clonedInvoiceData = {};
    /*-------------------new version----------------*/
    for (let key in invoiceData) {
      if (invoiceData.hasOwnProperty(key)) {
        //console.log(key + "-" + invoiceData[key]);
        clonedInvoiceData[key] = invoiceData[key];
      }
    }
    /*-------------------new version---------------*/

    // for (let key in invoiceData) {
    //   delete invoiceData[key];
    // }

    let tableProducsData = clonedInvoiceData ? clonedInvoiceData.products : [];

    clonedInvoiceData.tax = 0;
    clonedInvoiceData.sub_total = 0;
    clonedInvoiceData.total = 0;
    for (let i in tableProducsData) {
      let item = tableProducsData[i];
      if (!item.oldQty) {
        item.oldQty = item.qty;
      }
      if (invoiceData?.oldStatus === "0" && item.qty > 0) {
        item.qty = item.qty * -1;
      }
      if (item?.discount > 0) {
        item.discounted_amount = item?.discount;
        item.discount_per_item = item?.discount;
      }
      // if (item?.promotions?.length > 0) {
      //   item.discounted_amount = item?.discount / item.qty;
      // }
      if (!item.tax_info) {
        item.tax_info = {
          tax_amount: item.tax_amount,
          tax_value: item.tax_value,
          tax_id: item.tax_id,
          tax_name: item.tax_name,
        };
      }
      if (!item?.prices?.discount_price && item?.prices?.discount_price === 0) {
        item.prices.discount_price = item.product_sale_price;
      }

      tableProducsData[i].product_sale_price =
        item.prices.discount_price > 0
          ? item.prices.discount_price
          : item.prices.sale_price;
      tableProducsData[i].original_sale_price =
        item.prices.discount_price > 0
          ? item.prices.discount_price
          : item.prices.sale_price;
      if (
        tableProducsData[i]?.discounted_amount &&
        !clonedInvoiceData?.promotion_id
      ) {
        tableProducsData[i].offer_price =
          item.product_sale_price - item.discounted_amount;
        tableProducsData[i].discount_per_item =
          item.discounted_amount / item.qty;
      } else if (
        tableProducsData[i]?.discounted_amount &&
        clonedInvoiceData?.promotion_id
      ) {
        tableProducsData[i].offer_price =
          item.product_sale_price - item.discounted_amount;
      }
      tableProducsData[i].product_id = tableProducsData[i].id;
      if (Helpers.var_check(tableProducsData[i].qty))
        tableProducsData[i].qty = parseInt(tableProducsData[i].qty);
      else tableProducsData[i].qty = 0;
      if (Helpers.var_check(tableProducsData[i].product_sale_price))
        tableProducsData[i].product_sale_price = parseFloat(
          parseFloat(tableProducsData[i].product_sale_price).toFixed(2)
        );
      else tableProducsData[i].product_sale_price = 0;

      if (!tableProducsData[i].original_tax_value)
        tableProducsData[i].original_tax_value =
          tableProducsData[i].tax_info.tax_value;

      tableProducsData[i].tax_info.tax_value =
        clonedInvoiceData.taxCategory === "punjab_food_fbr"
          ? 5
          : tableProducsData[i].original_tax_value;
      if (tableProducsData[i]?.offer_price > 0) {
        clonedInvoiceData.tax +=
          (tableProducsData[i].tax_info.tax_value *
            tableProducsData[i].qty *
            tableProducsData[i].offer_price) /
          100;
        clonedInvoiceData.sub_total +=
          tableProducsData[i].offer_price * tableProducsData[i].qty;
      } else {
        clonedInvoiceData.tax +=
          (tableProducsData[i].tax_info.tax_value *
            tableProducsData[i].qty *
            tableProducsData[i].product_sale_price) /
          100;
        clonedInvoiceData.sub_total +=
          tableProducsData[i].product_sale_price * tableProducsData[i].qty;
      }
    } //enf of for loop

    /*clonedInvoiceData.products = tableProducsData; //imp
    setProductsTableData(tableProducsData); //vvimp*/
    console.log("totalDisPromotions", totalDisPromotions);
    if (totalDisPromotions > 0) {
      clonedInvoiceData.total +=
        clonedInvoiceData.tax + clonedInvoiceData.sub_total;
    } else {
      clonedInvoiceData.total +=
        clonedInvoiceData.tax + clonedInvoiceData.sub_total;
    }
    clonedInvoiceData.tax = parseFloat(
      parseFloat(clonedInvoiceData.tax).toFixed(2)
    );
    clonedInvoiceData.sub_total = parseFloat(
      parseFloat(clonedInvoiceData.sub_total).toFixed(2)
    );
    clonedInvoiceData.total = parseFloat(
      parseFloat(clonedInvoiceData.total).toFixed(2)
    );
    if (returnedInvoice) {
      clonedInvoiceData.total = parseFloat(
        clonedInvoiceData.total + -clonedInvoiceData.discounted_amount
      );
    }

    /*-------------------new version-fabric---------------------------------------*/
    let discountedInputValue = 0;
    /*if (discountInputChangeValue) {  //string input value 
      console.log("inside", discountInputChangeValue);
      discountedInputValue = discountInputChangeValue === "" ? 0 : discountInputChangeValue;
    }*/
    if (clonedInvoiceData.discountVal && !isPromoApplied) {
      discountedInputValue = clonedInvoiceData.discountVal;
    }
    if (clonedInvoiceData?.oldDiscountVal && !isPromoApplied) {
      discountedInputValue = clonedInvoiceData.oldDiscountVal;
    }
    /*-------------------new version-fabric---------------------------------------*/

    /*let discountedInputValue = (Helpers.var_check(costFormValues.discounted_value)) ? costFormValues.discounted_value
      : (clonedInvoiceData.discountVal) ? clonedInvoiceData.discountVal : 0;   imp prev version */

    discountedInputValue = parseInt(discountedInputValue).toFixed(2);
    //console.log(discountedInputValue);
    discountedInputValue = parseFloat(discountedInputValue);
    clonedInvoiceData.discountVal = discountedInputValue;
    clonedInvoiceData.show_id = invoiceData.show_id;
    clonedInvoiceData.discountAmount = parseFloat(
      ((discountedInputValue * clonedInvoiceData.sub_total) / 100).toFixed(2)
    );

    console.log("clonedInvoiceData", clonedInvoiceData);
    if (!localStorageInvoiceTotalPayedCheck) {
      //imp check for local
      clonedInvoiceData.payed = parseFloat(
        parseFloat(
          clonedInvoiceData.total - clonedInvoiceData.discountAmount
        ).toFixed(2)
      );
    }
    console.log(
      "clonedInvoiceDataclonedInvoiceData",
      clonedInvoiceData,
      returnedInvoice
    );

    clonedInvoiceData.products = tableProducsData; //imp
    setProductsTableData(tableProducsData); //vvimp

    setSaleInvoiceData(clonedInvoiceData); //imp
    //console.log(clonedInvoiceData);
    //console.log(clonedInvoiceData.payed);

    /* costForm.setFieldsValue({
      paid: clonedInvoiceData && clonedInvoiceData.payed,
      discounted_value: clonedInvoiceData && clonedInvoiceData.discountVal
    }); //imp */
    /*----new ver fabric-----*/
    setPaidAmountValue(clonedInvoiceData && clonedInvoiceData.payed);
    //setDiscountInputChangeValue(clonedInvoiceData && clonedInvoiceData.discountVal);
    /*----new ver fabric-----*/
    saveDataIntoLocalStorage(
      Constants.SELL_CURRENT_INVOICE_KEY,
      clonedInvoiceData
    ); //imp

    //saveDataIntoLocalStorage("current_invoice", clonedInvoiceData);   //imp
  }

  const handlePayBill = async (status, check = false) => {
    //console.log("changed", formData);
    //console.log(status);

    if (productsTableData.length === 0) {
      showAlertUi(true, "No Products Added");
      return;
    }

    saleInvoiceData.status = status; //imp
    //let invoiceProducts = saleInvoiceData.products;

    for (let i = 0; i < saleInvoiceData.products.length; i++) {
      let item = saleInvoiceData.products[i];
      delete item.delete_button;
      delete item.total_val;
    }

    if (
      saleInvoiceData.hasCustomer &&
      saleInvoiceData.method === "Customer Layby"
    ) {
      //if customer selected
      let invoiceTotal = parseFloat(
        saleInvoiceData.total - saleInvoiceData.discountAmount
      ).toFixed(2);
      if (parseFloat(saleInvoiceData.customer.balance) < invoiceTotal) {
        //message.warning("Insufficient Balance", 3);      //imp
        //return;                                          //imp
      }
    } //end of inner if (customer selected)

    let AddInvoiceRequestRespone;
    if (status === "completed" || status === "parked") {
      document.getElementById("app-loader-container").style.display = "block";
      // receipt add and print function
      AddInvoiceRequestRespone = await addInvoiceRequest(
        saleInvoiceData,
        status
      );
      if (AddInvoiceRequestRespone === "success") {
        saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, null);
      }
      document.getElementById("app-loader-container").style.display = "none";
      if (AddInvoiceRequestRespone === "success") {
        if (status === "completed") {
          printSalesOverview(); //imp first print then reset fields
        }
        resetFiledsOnNewInvoice(); //after print must
      }
    }
  };

  const resetFiledsOnNewInvoice = async () => {
    setSelectedCutomer("");
    setSelectedCustomerValue(""); //imp new one
    setProductsTableData([]); //vvimp new one

    setCourierData({});
    setTaxCategoryChangeData({});
    setInvoiceNoteValue("");
    setDiscountInputChangeValue("");
    setCalenderDate(todayDate);

    let newInvoice = await createNewInvoice(); //new invoice again
    /*----------new ver for checkout items updation----------*/
    calculateProductsTotalQuantityAndAmount([]);
    /*----------new ver for checkout items updation----------*/
    updateCart(newInvoice);
  };
  const closeFunction = async () => {
    let newInvoice = await createNewInvoice("dead sale");
    updateCart(newInvoice);
  };

  const printSalesOverview = () => {
    var previewSalesInvoiceHtml = document.getElementById("printSalesTable");
    if (!previewSalesInvoiceHtml) {
      return;
    }
    previewSalesInvoiceHtml =
      document.getElementById("printSalesTable").innerHTML;

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

  const handleDeadSale = async (e) => {
    document.getElementById("app-loader-container").style.display = "block";
    const invoiceNumber = saleInvoiceData?.show_id;
    const invoiceDataToSave = {
      customer_id: saleInvoiceData.customer_id,
      date: calenderDate,
      status: "parked",
      discount: saleInvoiceData.discountVal,
      shipping_address: storeLocation,
      billing_address: storeLocation,
      payment_method: mopType || "Cash",
      invoice_note: invoiceNoteValue,
      invoice_number: invoiceNumber,
      is_dead: "1",
    };
    setShortUUID(invoiceNumber);
    const invoiceProducts = [];
    for (const product of saleInvoiceData.products) {
      invoiceProducts.push({
        product_id: product.id,
        quantity: product.qty,
      });
    }
    invoiceDataToSave.invoice_products = invoiceProducts;
    const salesHistoryDeadResponse = await SalesApiUtil.updateRegisterInvoice(
      invoiceDataToSave,
      saleInvoiceData.OldInvoiceNo
    );
    console.log("salesHistoryViewResponse:", salesHistoryDeadResponse);
    if (salesHistoryDeadResponse.hasError) {
      console.log(
        "Cant fetch registered products Data -> ",
        salesHistoryDeadResponse.errorMessage
      );
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, salesHistoryDeadResponse.errorMessage);
    } else {
      if (mounted) {
        //imp if unmounted
        ////////////////////////update local////////////////////////////
        saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, null);
        setTaxCategoryChangeData({}); //imp
        let newInvoice = await createNewInvoice("dead sale");
        updateCart(newInvoice);
        ////////////////////////update local////////////////////////////
        document.getElementById("app-loader-container").style.display = "none";
        history.push({
          pathname: "/register/sales-history",
        });
      }
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
      // showAlertUi(true, getOutletViewResponse.errorMessage); //imp
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
      //showAlertUi(true, getTepmlateResponse.errorMessage);  //imp
    } else {
      var receivedTemplateData = getTepmlateResponse.template;
      setTemplateData(receivedTemplateData);
      //document.getElementById('app-loader-container').style.display = "none";
    }
  };

  // const fetchCouriersData = async () => {
  //   const couriersViewResponse = await CouriersApiUtil.viewAllCouriers();
  //   console.log("couriersViewResponse:", couriersViewResponse);

  //   if (couriersViewResponse.hasError) {
  //     console.log("Cant fetch couriers -> ", couriersViewResponse.errorMessage);
  //     showAlertUi(true, couriersViewResponse.errorMessage); //imp
  //   } else {
  //     if (mounted) {
  //       //imp if unmounted
  //       let couriersData =
  //         couriersViewResponse.courier.data || couriersViewResponse.courier;
  //       /*----------------------setting menu option-----------------------------*/
  //       for (let i = 0; i < couriersData.length; i++) {
  //         let item = couriersData[i];
  //         item.id = item.courier_id;
  //         item.name = item.courier_name;
  //       }
  //       /*--------------------------setting menu option-------------------------*/
  //       setCouriersData(couriersData);
  //     }
  //   }
  // };

  ////////////////imp functionality////////////////////
  ////////////////imp funcyionality////////////////////
  ////////////////imp funcyionality////////////////////

  const handleCustomerSearch = async (e) => {
    let searchValue = e.target.value;
    setSelectedCustomerValue(searchValue); //imp  working correctly
    if (customerTimeout) {
      clearTimeout(customerTimeout);
    }
    if (searchValue.length > 0) {
      // customerTimeout = setTimeout(() => {
      searhCustomerApi(searchValue);
      // }, 2000);
    }
  };

  const searhCustomerApi = async (searchValue) => {
    setCustomersShow(true);
    setCustomersSearchLoading(true);

    const customersSearchResponse = await CustomersApiUtil.searchCustomers(
      Helpers.productsSearchPageLimit,
      Helpers.productsSearchPageNumber,
      searchValue
    );
    console.log("customersSearchResponse:", customersSearchResponse);

    if (customersSearchResponse.hasError) {
      console.log(
        "Cant search Customer -> ",
        customersSearchResponse.errorMessage
      );
      setCustomersSearchLoading(false); //imp to hide customers search loading
    } else {
      setCustomersSearchLoading(false); //imp to hide customers search loading
      setCustomersData(
        customersSearchResponse?.Customer?.data ||
          customersSearchResponse?.Customers
      );
    }
  };

  const handleChange = (e) => {
    setSelectedSearchValue(e.target.value);
    if (e.target.value.length > 0) {
      setShow(true);
    }
  };
  useEffect(() => {
    let delayDebounceFn;
    if (selectedSearchValue !== "") {
      delayDebounceFn = setTimeout(() => {
        handleSearch(selectedSearchValue);
        // Send Axios request here
      }, 500);
    }
    return () => clearTimeout(delayDebounceFn);
  }, [selectedSearchValue]);
  const handleEnterProductSearch = async (e) => {
    if (e.keyCode === 13) {
      const productsSearchResponse = await ProductsApiUtil.searchProducts(
        Helpers.productsSearchPageLimit,
        Helpers.productsSearchPageNumber,
        selectedSearchValue
      );
      if (productsSearchResponse.hasError) {
        console.log(
          "Cant search Customer -> ",
          productsSearchResponse.errorMessage
        );
        setProductsSearchLoading(false);
      } else {
        const productData =
          productsSearchResponse?.products?.data[0] ||
          productsSearchResponse?.products;
        let selectedProductId = productData?.id;
        selectedProductId = selectedProductId.toString();
        setSelectedProductId(selectedProductId); //passes productId
        handleAddProduct(selectedProductId, [productData]); //imp new one
        setSelectedSearchValue(""); //searchName
        setShow(false); //imp new ver02G48WF94702G48WF947
        setCustomersShow(false);
        setProductsSearchResult([]);
        if (!isRetunredInvoice) {
          handleClearAllDiscount();
        }
      }
    }
  };

  const handleSelect = (e) => {
    //console.log(e);
    //let productId = value.split('-');
    let selectedProductId = e.target.value;
    selectedProductId = selectedProductId.toString();
    //console.log(option.children);
    setSelectedSearchValue(""); //searchName
    setSelectedProductId(selectedProductId); //passes productId
    handleAddProduct(selectedProductId); //imp new one
    setShow(false); //imp new ver
    setCustomersShow(false);
    setProductsSearchResult([]);
    if (!isRetunredInvoice) {
      handleClearAllDiscount();
    }
    //setSelectedProductId(null);
  };

  const handleCustomerSelect = (cus) => {
    setSelectedCutomer(cus); //passes customer
    setSelectedCustomerValue(cus.name); //working correctly
    setCustomersShow(false);
    saleInvoiceData.customer = cus;
    saleInvoiceData.hasCustomer = true;
    //setSaleInvoiceData(saleInvoiceData);
    updateCart(saleInvoiceData);
  };

  const handleCustomerDelete = () => {
    if (saleInvoiceData.method == "Customer Layby") {
      saleInvoiceData.method = "Cash";
    }
    saleInvoiceData.customer = {};
    setSelectedCutomer("");
    saleInvoiceData.hasCustomer = false;
    setSaleInvoiceData(saleInvoiceData); //imp
    updateCart(saleInvoiceData);
  };

  const handleChangeProductsData = (productsData, row) => {
    let newDiscount = 0;
    if (isRetunredInvoice) {
      const findProduct = productsData.find((pro) => pro.id === row.id);
      newDiscount = findProduct.discount * findProduct.qty;
      if (newDiscount <= 0) {
        setTotalInvoiceDiscount(newDiscount);
      } else {
        setTotalInvoiceDiscount(newDiscount * -1);
      }
    }
    calculateProductsTotalQuantityAndAmount(productsData);
    //setProductsTableData(productsData);   //calling in updatecart now
    saleInvoiceData.products = productsData;
    updateCart(saleInvoiceData, false, false, newDiscount); //imp
    if (productsData?.length === 0) {
      setInvoiceCouponApplied(false);
      setInvoicePromotionApplied(false);
      setInvoiceSalePriceApplied(false);
      setTotalInvoiceDiscount(0);
    }
    if (!isRetunredInvoice) {
      handleClearAllDiscount();
    }
  };

  const handleAddProduct = (
    selectedProdId = selectedProductId,
    dataToSearch = []
  ) => {
    var productExistsCheck = false;
    var newData = [...productsTableData];
    //productsTableData
    let index;
    if (productsSearchResult?.length > 0) {
      index = productsSearchResult.findIndex(
        (item) => selectedProdId == item.id
      );
    } else {
      index = dataToSearch.findIndex((item) => selectedProdId == item.id);
    }
    if (index > -1) {
      //deep copy
      let selectedItem;
      if (productsSearchResult?.length > 0) {
        selectedItem = JSON.parse(JSON.stringify(productsSearchResult[index]));
      } else {
        selectedItem = JSON.parse(JSON.stringify(dataToSearch[index]));
      }
      console.log("products-table-data-first->", productsTableData);
      console.log("sale-invoice-data-first->", saleInvoiceData);
      productsTableData.forEach((p) => {
        if (p.id === selectedItem.id) {
          productExistsCheck = true;
          p.qty += 1;
        }
      }); //end of for loop

      if (productExistsCheck) {
        calculateProductsTotalQuantityAndAmount(productsTableData);
        //setProductsTableData(productsTableData);  // caling in updatecart now imppp
        //update cart  imp
        saleInvoiceData.products = [...productsTableData]; //vvimp to pass [...]
        saveDataIntoLocalStorage(
          Constants.SELL_CURRENT_INVOICE_KEY,
          saleInvoiceData
        ); //imp
        updateCart(saleInvoiceData);

        //update cart  imp
      }
      if (!productExistsCheck) {
        selectedItem.qty = 1;
        newData.push(selectedItem);
        //console.log("imp1-table", newData);
        calculateProductsTotalQuantityAndAmount(newData);
        //setProductsTableData(newData);  // callng in updatecart now imppp
        //update cart  imp
        saleInvoiceData.products = newData;
        saveDataIntoLocalStorage(
          Constants.SELL_CURRENT_INVOICE_KEY,
          saleInvoiceData
        ); //vvimp
        updateCart(saleInvoiceData);

        //update cart  imp
      }

      console.log("products-table-data->", saleInvoiceData);
    } //end of top first if
    setProductsSearchResult([]);
  };

  const calculateProductsTotalQuantityAndAmount = (data) => {
    var productsTotalQuantity = 0;
    var productsTotal = 0;

    const newData = [...data];
    newData.forEach((item) => {
      productsTotal =
        productsTotal +
        parseFloat(item.qty || 0) * parseFloat(item.prices.discount_price);
      productsTotalQuantity = productsTotalQuantity + item.qty;
    });

    setProductsTotalQuantity(productsTotalQuantity);
    setProductsTotalAmount(productsTotal);
  };

  const handleSearch = async (value) => {
    //setSelectedSearchValue(value);
    setProductsSearchLoading(true);
    setShow(true);
    const productsSearchResponse = await ProductsApiUtil.searchProducts(
      Helpers.productsSearchPageLimit,
      Helpers.productsSearchPageNumber,
      value
    );
    console.log("productsSearchResponse:", productsSearchResponse);

    if (productsSearchResponse.hasError) {
      console.log(
        "Cant search Customer -> ",
        productsSearchResponse.errorMessage
      );
      setProductsSearchLoading(false);
    } else {
      setProductsSearchResult(
        productsSearchResponse?.products?.data ||
          productsSearchResponse?.products
      );
      setProductsSearchLoading(false);
    }
    // var currValue = value;
    // currValue = currValue.toLowerCase();
    // if (currValue === "") {
    //   setProductsSearchResult([]);
    // } else {
    //   const filteredData = registereProductsData.filter((entry) => {
    //     let searchValue = entry.searchName;
    //     searchValue = searchValue.toLowerCase();
    //     let productSku = entry.product_sku;
    //     productSku = productSku.toLowerCase();

    //     return (
    //       searchValue.includes(currValue) || productSku.includes(currValue)
    //     );
    //   });
    //   setProductsSearchResult(filteredData);
    // }
  };

  /*------------form input events handlets---------------*/
  /*------------form input events handlets---------------*/
  /*------------form input events handlets---------------*/

  const handlePaidChange = (e) => {
    let inputValue = e.target.value;
    console.log("paid-change-before>", inputValue);
    //var costFormValues = costForm.getFieldsValue();
    //console.log(costFormValues);
    let paidAmount;
    if (Helpers.var_check(inputValue) || inputValue === "") {
      paidAmount = inputValue;
    } else {
      paidAmount = 0;
    }

    console.log("paid-change-after>", paidAmount);
    setPaidAmountValue(paidAmount);

    const clonedInvoice = { ...saleInvoiceData };
    clonedInvoice.payed = paidAmount;

    //costForm.setFieldsValue({ paid: clonedInvoiceData && clonedInvoiceData.payed }); //imp
    saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, clonedInvoice); //imp
    setSaleInvoiceData(clonedInvoice);
  };

  const handleDiscountChange = (e) => {
    console.log("dis-inp-value->", e.target.value);
    let discountedVal = e.target.value;
    if (discountedVal <= 100) {
      setDiscountInputChangeValue(discountedVal); //not need as it's done in update cart
      saleInvoiceData.discountVal = discountedVal || 0;
      saleInvoiceData.isDiscount = true;
      updateCart(saleInvoiceData, false, 0, false);
    }
  };

  const handleInvoiceNoteChange = (e) => {
    //console.log(e.target.value);
    setInvoiceNoteValue(e.target.value);
    //const clonedInvoice = { ...saleInvoiceData };  //pending
    saleInvoiceData.reference = e.target.value;
    saveDataIntoLocalStorage(
      Constants.SELL_CURRENT_INVOICE_KEY,
      saleInvoiceData
    ); //imp
    setSaleInvoiceData(saleInvoiceData);
  };

  // const handleCourierSelectChange = (listItem) => {
  //   //console.log(listItem);  //imp
  //   setCourierData({ ...listItem });
  //   //const clonedInvoice = { ...saleInvoiceData };
  //   saleInvoiceData.courier_code = listItem.courier_code;
  //   saveDataIntoLocalStorage(
  //     Constants.SELL_CURRENT_INVOICE_KEY,
  //     saleInvoiceData
  //   ); //imp
  //   setSaleInvoiceData(saleInvoiceData);
  // };

  const onInvoiceDateChange = (value) => {
    console.log(value); //gmt string
    //let today = moment(new Date()).format(dateFormat);  //current date
    //let dateString = moment(value).format('yyyy/MM/DD');
    let dateString = moment(value).format("yyyy/MM/DD"); //imp keep as it is

    setCalenderDate(moment(value).format("yyyy/MM/DD"));

    console.log(dateString); //gmt string
    let currentTime = moment().format(timeFormat); //current time
    if (value) {
      const clonedSaleInvoiceData = { ...saleInvoiceData };
      clonedSaleInvoiceData.dateTime = dateString + " " + currentTime;
      setSaleInvoiceData(clonedSaleInvoiceData);
    }
  };

  const onInvoiceDateChangeInput = (e) => {
    console.log(e.target.value); //string only
    setCalenderDate(moment(new Date(e.target.value)).format("DD/MM/yyyy"));
  };

  const handleTaxCategorySelectChange = (listItem) => {
    //console.log(listItem);  //imp
    setTaxCategoryChangeData({ ...listItem });
    if (listItem.value == 16) {
      saleInvoiceData.taxCategory = "simple_tax";
    }
    if (listItem.value == 5) {
      saleInvoiceData.taxCategory = "punjab_food_fbr";
    }

    updateCart(saleInvoiceData); //imp;
  };

  const handleDeleteSale = async (e) => {
    if (productsTableData.length === 0) {
      showAlertUi(true, "No Products Added");
      return;
    }
    saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, null);
    setTaxCategoryChangeData({});
    setCourierData({});
    setInvoiceNoteValue("");
    setDiscountInputChangeValue("");
    setCalenderDate(todayDate);
    let newInvoice = await createNewInvoice("clear sale");
    updateCart(newInvoice);
  };

  const showMopModal = () => {
    setIsMopModalVisible(true);
  };

  const handleMopModalCancel = () => {
    setIsMopModalVisible(false);
  };
  const renderMopModalContent = () => {
    return (
      <>
        <h2 style={{ marginBottom: "3rem" }}>Select method of payment</h2>

        <Radio
          label="Cash"
          onChange={() => changeMethodOfPayment("Cash")}
          tabIndex={0}
          value="cash"
          className="mops-modal-inner-margin"
          checked={mopType === "Cash" ? true : false}
        />
        <Radio
          label="Credit Card"
          onChange={() => changeMethodOfPayment("Credit Card")}
          tabIndex={1}
          className="mops-modal-inner-margin"
          checked={mopType === "Credit Card" ? true : false}
        />
        <Radio
          label="Online"
          onChange={() => changeMethodOfPayment("Online")}
          tabIndex={2}
          className="mops-modal-inner-margin"
          checked={mopType === "Online" ? true : false}
        />
        <Radio
          label="Customer Layby"
          onChange={() => changeMethodOfPayment("Customer Layby")}
          tabIndex={3}
          className="mops-modal-inner-margin"
          checked={mopType === "Customer Layby" ? true : false}
          disabled={saleInvoiceData && saleInvoiceData.hasCustomer === false}
        />
      </>
    );
  };

  const changeMethodOfPayment = (methodName) => {
    //console.log(methodName);
    //mopType = methodName;
    saleInvoiceData.method = methodName;
    setMopType(methodName); //working great while modal opening
    setSaleInvoiceData(saleInvoiceData);
    saveDataIntoLocalStorage(
      Constants.SELL_CURRENT_INVOICE_KEY,
      saleInvoiceData
    );
  };

  const registerScopeFilter = (localUserInfo) => {
    if (!localUserInfo) {
      return;
    }
    // console.log(localUserInfo);
    if (localUserInfo.user_role == "cashier") {
      return true;
    } else {
      return false;
    }
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const successAlerUi = (show, message) => {
    Helpers.showSuccessAlertUiContent(show, message);
  };
  const [invoiceCouponValue, setInvoiceCouponValue] = useState("");
  const [invoiceCouponValueError, setInvoiceCouponValueError] = useState(false);
  const [invoicePromotionApplied, setInvoicePromotionApplied] = useState(false);
  const [invoiceCouponApplied, setInvoiceCouponApplied] = useState(false);
  const [invoiceSalePriceApplied, setInvoiceSalePriceApplied] = useState(false);

  const handleChangeInvoiceCouponValue = (e) => {
    setInvoiceCouponValue(e.target.value);
    if (invoiceCouponValueError) {
      setInvoiceCouponValueError(false);
    }
  };
  const handleSaleApplyPromotion = async () => {
    if (saleInvoiceData?.products?.length > 0) {
      const payload = promotionPayload(saleInvoiceData.products);
      document.getElementById("app-loader-container").style.display = "block";
      const promotionsRes = await WebOrdersApiUtil.getPromotions(payload);
      if (!promotionsRes.success) {
        const errorMessage =
          promotionsRes?.errorMessage || promotionsRes?.data?.message;
        console.log("Cant Add Address -> ", errorMessage);
        showAlertUi(true, errorMessage);
        document.getElementById("app-loader-container").style.display = "none";
      } else {
        const discountItems = promotionsRes?.data?.items;
        const updatesProducts = [];
        let totalDiscount = 0;
        for (const pro of saleInvoiceData?.products) {
          const findDiscount = discountItems.find(
            (item) => item.itemId == pro.external_code
          );
          if (findDiscount) {
            const discountAppliedData = [];
            for (const dis of findDiscount?.appliedDiscount) {
              discountAppliedData.push({
                promotion_title: dis.promoTitle,
                promotion_id: dis._id || dis.id,
                promotion_value: dis.value || 0,
              });
            }
            totalDiscount += findDiscount.discount;
            updatesProducts.push({
              ...pro,
              offer_price:
                pro.prices.discount_price - findDiscount.discount / pro.qty,
              discounted_amount: findDiscount.discount / pro.qty,
              promotions: discountAppliedData,
            });
          } else {
            updatesProducts.push(pro);
          }
        }
        setDiscountInputChangeValue("");
        setTotalInvoiceDiscount(totalDiscount);
        const updatedData = {
          ...saleInvoiceData,
          discountAmount: 0,
          products: updatesProducts,
        };
        updateCart(updatedData, false, true, totalDiscount);
        setInvoicePromotionApplied(true);
        setInvoiceSalePriceApplied(false);
        setInvoiceCouponApplied(false);
        successAlerUi(true, "Promotion applied successfully");
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };
  const handleSaleApplyCoupon = async () => {
    if (saleInvoiceData?.products?.length > 0 && invoiceCouponValue) {
      const payload = promotionPayload(saleInvoiceData?.products, [
        invoiceCouponValue,
      ]);
      document.getElementById("app-loader-container").style.display = "block";
      const couponRes = await WebOrdersApiUtil.getCouponDiscount(payload);
      if (!couponRes.success) {
        const errorMessage =
          couponRes?.errorMessage || couponRes?.data?.message;
        showAlertUi(true, errorMessage);
        document.getElementById("app-loader-container").style.display = "none";
      } else {
        const discountItems = couponRes?.data || [];
        const updatesProducts = [];
        let totalDiscount = 0;
        for (const pro of saleInvoiceData?.products) {
          const findDiscount = discountItems.find(
            (item) => item.itemId == pro.external_code
          );
          if (findDiscount) {
            const couponsApplied = [];
            for (const dis of findDiscount?.discountApplied) {
              couponsApplied.push({
                promotion_title: dis.promoTitle,
                promotion_id: dis._id || dis.id,
                promotion_value: dis.value || 0,
              });
            }
            totalDiscount += findDiscount.discount;
            updatesProducts.push({
              ...pro,
              discounted_amount: findDiscount.discount / pro.qty,
              promotions: couponsApplied,
            });
          } else {
            updatesProducts.push(pro);
          }
        }
        setDiscountInputChangeValue("");
        setTotalInvoiceDiscount(totalDiscount);
        const updatedData = {
          ...saleInvoiceData,
          discountAmount: 0,
          products: updatesProducts,
        };
        updateCart(updatedData, false, true, totalDiscount);
        setInvoiceCouponApplied(true);
        setInvoiceSalePriceApplied(false);
        setInvoicePromotionApplied(false);
        successAlerUi(true, "Coupon applied successfully");
        document.getElementById("app-loader-container").style.display = "none";
      }
    } else {
      if (invoiceCouponValue === "") {
        setInvoiceCouponValueError(true);
      }
    }
  };

  // const handleSaleApplySalePrice = async () => {
  //   if (saleInvoiceData?.products?.length > 0) {
  //     const itemIds = saleInvoiceData?.products?.map(
  //       (pro) => pro.external_code
  //     );
  //     const payload = {
  //       itemIds,
  //       priceListId: 100000,
  //     };
  //     console.log("payload", payload);
  //     document.getElementById("app-loader-container").style.display = "block";
  //     const offerRes = await WebOrdersApiUtil.getOfferPrice(payload);
  //     console.log("promotionsRes", offerRes);
  //     if (!offerRes.success) {
  //       const errorMessage = offerRes?.errorMessage || offerRes?.data?.message;
  //       console.log("Cant Add Address -> ", errorMessage);
  //       showAlertUi(true, errorMessage);
  //     } else {
  //       const discountItems = offerRes?.data;
  //       const updatesProducts = [];
  //       let totalDiscount = 0;
  //       for (const pro of saleInvoiceData?.products) {
  //         const findDiscount = discountItems.find(
  //           (item) => item.itemId == pro.external_code
  //         );
  //         if (findDiscount) {
  //           updatesProducts.push({
  //             ...pro,
  //             offer_price: findDiscount?.price?.sale,
  //             discounted_amount: 0,
  //             promosApplied: [],
  //           });
  //         } else {
  //           updatesProducts.push(pro);
  //         }
  //       }
  //       setTotalInvoiceDiscount(0);
  //       const updatedData = {
  //         ...saleInvoiceData,
  //         products: updatesProducts,
  //       };
  //       setSaleInvoiceData(updatedData);
  //       updateCart(updatedData);
  //       setInvoiceSalePriceApplied(true);
  //       setInvoicePromotionApplied(false);
  //       setInvoiceCouponApplied(false);
  //       document.getElementById("app-loader-container").style.display = "none";
  //     }
  //   }
  // };

  const handleClearAllDiscount = () => {
    if (saleInvoiceData?.products?.length > 0) {
      const updatesProducts = [];
      for (const pro of saleInvoiceData?.products) {
        updatesProducts.push({
          ...pro,
          offer_price: 0,
          promosApplied: [],
          promotions: [],
        });
      }
      setTotalInvoiceDiscount(0);
      const updatedData = {
        ...saleInvoiceData,
        products: updatesProducts,
      };
      setSaleInvoiceData(updatedData);
      updateCart(updatedData, false, false, 0);
      setInvoiceCouponValue("");
      setInvoiceSalePriceApplied(false);
      setInvoicePromotionApplied(false);
      setInvoiceCouponApplied(false);
    }
  };

  /*------------form input events handlets---------------*/
  /*------------form input events handlets---------------*/
  /*------------form input events handlets---------------*/

  let WomensWearAccountCheck = Helpers.WomensWearSuperUserAccountIds.includes(
    currentLoggedSuperUserId
  );

  const [selectedCustomerData, setSelectedCustomerData] = useState({});
  const [selectedAddressData, setSelectedAddressData] = useState({});
  const [selectedShippingData, setSelectedShippingData] = useState({});
  const [selectedProductsData, setSelectedProductsData] = useState([]);
  const [totalData, setTotalData] = useState({});
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [promotionApplied, setPromotionApplied] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  const [returnWebOrderModal, setReturnWebOrderModal] = useState(false);
  const [returnWebOrderData, setReturnWebOrderData] = useState({});

  const handleSaveWebOrder = async () => {
    if (
      selectedShippingData &&
      selectedAddressData &&
      selectedCustomerData &&
      selectedProductsData.length > 0 &&
      totalData
    ) {
      setIsLoading(true);
      document.getElementById("app-loader-container").style.display = "block";
      const dataToSave = createPayloadToSave(
        selectedCustomerData,
        selectedAddressData,
        selectedProductsData,
        selectedShippingData,
        totalData
      );
      const createWebOrderRes = await WebOrdersApiUtil.createWebOrder([
        dataToSave,
      ]);
      console.log("createWebOrderRes", createWebOrderRes);
      if (!createWebOrderRes.success) {
        const errorMessage =
          createWebOrderRes?.errorMessage || createWebOrderRes?.data?.message;
        console.log("Cant Add Address -> ", errorMessage);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, errorMessage);
        setShowError(true);
        setErrorMessage(errorMessage);
        setIsLoading(false);
        scrollModal();
        setTimeout(() => {
          setShowError(false);
          setErrorMessage("");
        }, 2000);
      } else {
        setIsLoading(false);
        const productsData = [];
        for (const pro of selectedProductsData) {
          productsData.push({
            name: pro.name,
            qty: pro.selectQty,
            original_sale_price: pro.prices.discount_price,
            product_sale_price:
              pro.prices.discount_price - pro.discounted_amount / pro.selectQty,
          });
        }
        console.log("totalData", totalData);
        const webOrderData = {
          products: productsData,
          sub_total: parseInt(totalData.subTotal),
          tax: parseInt(totalData.totalTax),
          discountAmount: parseInt(totalData.discountedAmount),
          payed: parseInt(totalData.subTotal + totalData?.tax_amount),
          total: parseInt(totalData.subTotal + totalData?.tax_amount),
          invoice_show_id: createWebOrderRes.data.orderCreated[0].orderId,
        };
        setSaleInvoiceData(webOrderData);
        setWebOrderModal(false);
        printSalesOverview();
        document.getElementById("app-loader-container").style.display = "none";
        setSelectedCustomerData({});
        setSelectedAddressData({});
        setSelectedShippingData({});
        setSelectedProductsData([]);
        setTotalInvoiceDiscount(0);
        setPromotionApplied(false);
        setCouponApplied(false);
        setTotalData({});
      }
    } else {
      setShowError(true);
      setErrorMessage("Please fill the required data");
      scrollModal();
      setTimeout(() => {
        setShowError(false);
        setErrorMessage("");
      }, 2000);
    }
  };
  const handleAddWebOrder = () => {
    setWebOrderModal(!webOrderModal);
    setSelectedCustomerData({});
    setSelectedAddressData({});
    setSelectedShippingData({});
    setSelectedProductsData([]);
    setTotalData({});
  };

  const handleApplyPromotion = async () => {
    if (selectedProductsData.length > 0) {
      const payload = promotionPayload(selectedProductsData);
      document.getElementById("app-loader-container").style.display = "block";
      const promotionsRes = await WebOrdersApiUtil.getPromotions(payload);
      if (!promotionsRes.success) {
        const errorMessage =
          promotionsRes?.errorMessage || promotionsRes?.data?.message;
        console.log("Cant Add Address -> ", errorMessage);
        errorMessageWebOrder(errorMessage);
      } else {
        const discountItems = promotionsRes?.data?.items;
        const updatesProducts = [];
        let totalDiscount = 0;
        for (const pro of selectedProductsData) {
          const findDiscount = discountItems.find(
            (item) => item.itemId == pro.external_code
          );
          if (findDiscount) {
            const discountAppliedData = [];
            for (const dis of findDiscount?.appliedDiscount) {
              discountAppliedData.push({ name: dis.promoTitle });
            }
            console.log("discountAppliedData", discountAppliedData);
            totalDiscount += findDiscount.discount;
            updatesProducts.push({
              ...pro,
              discounted_amount: findDiscount.discount,
              promosApplied: discountAppliedData,
            });
          } else {
            updatesProducts.push(pro);
          }
        }
        setTotalData(calculateTotalData(updatesProducts, totalDiscount));
        setSelectedProductsData(updatesProducts);
        setPromotionApplied(true);
        setCouponApplied(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };
  const handleApplyCoupon = async (couponValue, setCouponModal) => {
    if (selectedProductsData.length > 0) {
      const payload = promotionPayload(selectedProductsData, [couponValue]);
      document.getElementById("app-loader-container").style.display = "block";
      const couponRes = await WebOrdersApiUtil.getCouponDiscount(payload);
      if (!couponRes.success) {
        const errorMessage =
          couponRes?.errorMessage || couponRes?.data?.message;
        errorMessageWebOrder(errorMessage);
      } else {
        const discountItems = couponRes?.data || [];
        const updatesProducts = [];
        let totalDiscount = 0;
        for (const pro of selectedProductsData) {
          const findDiscount = discountItems.find(
            (item) => item.itemId == pro.external_code
          );
          if (findDiscount) {
            const couponsApplied = [];
            for (const dis of findDiscount?.discountApplied) {
              couponsApplied.push({ name: dis.promoTitle });
            }
            console.log("couponsApplied", couponsApplied);
            totalDiscount += findDiscount.discount;
            updatesProducts.push({
              ...pro,
              discounted_amount: findDiscount.discount,
              promosApplied: couponsApplied,
            });
          } else {
            updatesProducts.push(pro);
          }
        }
        setTotalData(calculateTotalData(updatesProducts, totalDiscount));
        setSelectedProductsData(updatesProducts);
        setCouponModal(false);
        setPromotionApplied(false);
        setCouponApplied(true);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };
  const scrollModal = () => {
    const modalContent = document.getElementsByClassName("modal_content");
    if (modalContent?.length) {
      modalContent[0].scrollTop = 0;
    }
  };
  const handleClearWebOrderAllDiscount = () => {
    if (selectedProductsData.length > 0) {
      if (promotionApplied || couponApplied) {
        const updatesProducts = [];
        for (const pro of selectedProductsData) {
          updatesProducts.push({
            ...pro,
            discounted_amount: 0,
            promosApplied: [],
          });
        }
        setPromotionApplied(false);
        setCouponApplied(false);
        setTotalInvoiceDiscount(0);
        setTotalData(calculateTotalData(updatesProducts, 0));
        setSelectedProductsData(updatesProducts);
      }
    }
  };
  const errorMessageWebOrder = (errorMessage) => {
    console.log("Cant Add Address -> ", errorMessage);
    document.getElementById("app-loader-container").style.display = "none";
    showAlertUi(true, errorMessage);
    setShowError(true);
    setErrorMessage(errorMessage);
    scrollModal();
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 2000);
  };
  const WebOrder = () => {
    return (
      <WebOrders
        showError={showError}
        setShowError={setShowError}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        totalData={totalData}
        setTotalData={setTotalData}
        selectedCustomerData={selectedCustomerData}
        setSelectedCustomerData={setSelectedCustomerData}
        setSelectedAddressData={setSelectedAddressData}
        selectedShippingData={selectedShippingData}
        setSelectedShippingData={setSelectedShippingData}
        setSelectedProductsData={setSelectedProductsData}
        selectedProductsData={selectedProductsData}
        paymentMethod={paymentMethod}
        handleApplyPromotion={handleApplyPromotion}
        handleApplyCoupon={handleApplyCoupon}
        couponApplied={couponApplied}
        promotionApplied={promotionApplied}
        handleClearWebOrderAllDiscount={handleClearWebOrderAllDiscount}
      />
    );
  };
  const isReturned = isRetunredInvoice ? "-" : "";
  let discountAmountToShow = 0;

  if (totalInvoiceDiscount > 0 || saleInvoiceData?.promotion_id) {
    discountAmountToShow = totalInvoiceDiscount;
  } else if (saleInvoiceData?.discountAmount) {
    discountAmountToShow = saleInvoiceData.discountAmount.toFixed(2);
  }

  const handleReturnWebOrder = () => {
    setReturnWebOrderModal(!returnWebOrderModal);
    handleClearWebOrderAllDiscount();
  };
  const handleConfirmReturn = async () => {
    if (returnWebOrderData?.orderId) {
      document.getElementById("app-loader-container").style.display = "block";
      const dataToReturn = {
        orderId: returnWebOrderData.orderId,
      };
      const returnWebOrderRes = await WebOrdersApiUtil.returnWebOrder(
        dataToReturn
      );
      if (!returnWebOrderRes.success) {
        const errorMessage =
          returnWebOrderRes?.errorMessage || returnWebOrderRes?.data?.message;
        console.log("Cant Return Web Order-> ", errorMessage);
        document.getElementById("app-loader-container").style.display = "none";
        errorMessageWebOrder(errorMessage);
      } else {
        const productsData = [];
        for (const pro of selectedProductsData) {
          productsData.push({
            name: pro.name,
            qty: -pro.selectQty,
            original_sale_price: pro.prices.discount_price,
            product_sale_price:
              pro.prices.discount_price - pro.discounted_amount / pro.selectQty,
          });
        }
        console.log("totalData", totalData);
        const webOrderData = {
          products: productsData,
          sub_total: parseInt(totalData.subTotal),
          tax: parseInt(totalData.totalTax),
          discountAmount: parseInt(totalData.discountedAmount),
          payed: parseInt(totalData.subTotal + totalData?.tax_amount),
          total: parseInt(totalData.subTotal + totalData?.tax_amount),
          invoice_show_id: returnWebOrderRes.orderId,
        };
        document.getElementById("app-loader-container").style.display = "none";
        setSaleInvoiceData(webOrderData);
        setWebOrderModal(false);
        setSelectedProductsData([]);
        setReturnWebOrderData({});
        setTotalData({});
        printSalesOverview();
      }
    } else {
      errorMessageWebOrder("Order Id is required");
    }
  };

  const returnWebOrder = () => {
    return (
      <ReturnWebOrders
        errorMessageWebOrder={errorMessageWebOrder}
        showError={showError}
        setShowError={setShowError}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        totalData={totalData}
        setTotalData={setTotalData}
        paymentMethod={paymentMethod}
        returnWebOrderData={returnWebOrderData}
        setSelectedProductsData={setSelectedProductsData}
        selectedProductsData={selectedProductsData}
        setReturnWebOrderData={setReturnWebOrderData}
      />
    );
  };
  console.log("saleInvoiceData", saleInvoiceData);
  // useEffect(() => {
  //   if (inputRef?.current) {
  //     inputRef?.current?.focus();
  //   }
  // }, [inputRef?.current]);
  return (
    <>
      <div className="page sell">
        <div className="page__top">
          <SwitchOutlet />
        </div>

        <PageTitle title="Sell" />

        <div className="page__buttons">
          {saleInvoiceData && saleInvoiceData.saleStatus !== "returned" && (
            <CustomButtonWithIcon
              text="Park Sale"
              iconName="Add"
              onClick={() => handlePayBill("parked")}
            />
          )}
          <CustomButtonWithIcon
            text="Clear Sale"
            iconName="Add"
            onClick={handleDeleteSale}
          />
          {saleInvoiceData && saleInvoiceData.oldStatus === "1" && (
            <CustomButtonWithIcon
              className="dead-sale-button"
              text="Dead Sale"
              iconName="Add"
              onClick={handleDeadSale}
              disabled={!networkStatus}
            />
          )}
          <CustomButtonWithIcon
            text="Add Web Order"
            iconName="Add"
            onClick={handleAddWebOrder}
          />
          <CustomButtonWithIcon
            text="Return Order"
            iconName="Delete"
            onClick={handleReturnWebOrder}
          />
        </div>

        <div className="page__content">
          {/* product */}
          <section className="product">
            <div className="form">
              <div className="form__row">
                <div className="form__input">
                  <AutoComplete
                    inputProps={{
                      icon: "Search",
                      className: "search-autocomplete",
                      isFloatedLabel: false,
                      boxed: false,
                      inputProps: {
                        // ref: inputRef,
                        placeholder: "Select Product",
                        onChange: (e) => handleChange(e),
                        onKeyDown: (e) => handleEnterProductSearch(e),
                        value: selectedSearchValue,
                        boxed: true,
                        //onKeyDown: SelectProductOnEnter,   //no need now
                        onFocus: (event) => {
                          console.log(event);
                          setShow(
                            productsSearchResult.length > 0 ? true : false
                          );
                        },
                      },
                    }}
                    autoCompleteProps={{
                      data: {},
                      isLoading: false,
                      show: show,
                      toggleSearchAll: true,
                      className: "search-autocomplete-popup",
                      onSearchAll: (event) => console.log(event),
                      onSelect: (data) => console.log(data, "data..."),
                      onClearSearch: (event, iconState) => {
                        console.log(event, iconState, "event");
                        setShow(false);
                        setSelectedSearchValue("");
                      },
                      onEscPress: () => setShow(false),
                      onBodyClick: () => setShow(false),
                    }}
                    children={
                      <div>
                        <Loading
                          strokeColor="#0033B3"
                          strokeWidth={5}
                          size={20}
                          show={productsSearchLoading}
                        />
                        <ul>
                          {productsSearchResult &&
                            productsSearchResult.map((item) => (
                              <li
                                key={item.id}
                                value={item.id}
                                onClick={handleSelect}
                                className="products-search-list-item"
                              >
                                {item.name}
                              </li>
                            ))}
                        </ul>
                      </div>
                    }
                  />
                </div>
              </div>

              {/* <div className='form__row'>
                <div className='form__input'>
                  <Dropdown
                    onSelect={handleCourierSelectChange} //most imp
                    options={couriersData}
                    titleLabel='Courier'
                    value={courierData}
                    width='100%'
                  //placeholder="Select Courier"  //not working
                  />
                </div>
              </div> */}

              <div className="form__row">
                <div className="form__input">
                  <Calendar
                    //{...args}
                    //dateFormat='dd/MM/yyyy'
                    maxDate={calenderMaxDate} //working great
                    popperPlacement="bottom-start"
                    //fixedHeight={true}
                    onDateChange={onInvoiceDateChange}
                    customInput={({ value }) => {
                      return (
                        <Input
                          isFloatedLabel
                          label="Date"
                          inputProps={{
                            //defaultValue: value ?  moment(value).format('DD/MM/yyyy') : '',
                            value: calenderDate,
                            //['data-testid']: 'custom-input',
                            //disabled: false,
                            //onChange: onInvoiceDateChangeInput
                          }}
                          maskOptions={{
                            alias: "datetime",
                            placeholder: "yyyy/mm/dd",
                            inputFormat: "yyyy/MM/dd",
                          }}
                        />
                      );
                    }}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form__input">
                  <Dropdown
                    onSelect={handleTaxCategorySelectChange}
                    options={[
                      {
                        id: 1, //comp field
                        name: "Simple", //comp field
                        value: 16,
                      },
                      {
                        id: 2,
                        name: "FBS",
                        value: 5,
                      },
                    ]}
                    titleLabel="Tax Category"
                    /*value={{
                      id: 1,
                      name: "Simple",
                      value: 16
                    }}*/ //working but later
                    value={taxCategoryChangeData}
                    width="100%"
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="primary"
                    inputProps={{
                      disabled: false,
                      value: invoiceNoteValue,
                      onChange: handleInvoiceNoteChange,
                    }}
                    label="Invoice Note"
                  />
                </div>
              </div>
              {!isRetunredInvoice && (
                <>
                  <div className="form__row">
                    <div className="form__input">
                      <Input
                        className="primary"
                        inputProps={{
                          disabled: false,
                          value: invoiceCouponValue,
                          onChange: handleChangeInvoiceCouponValue,
                        }}
                        label="Coupon"
                        error={invoiceCouponValueError}
                        errorMessage="Field is required"
                      />
                    </div>
                  </div>
                  <div className="form__row">
                    <div className="form__input">
                      <CustomButtonWithIcon
                        text="Apply Coupon"
                        iconName="Add"
                        onClick={handleSaleApplyCoupon}
                        disabled={
                          (saleInvoiceData?.products?.length === 0 &&
                            invoiceCouponValue === "") ||
                          invoiceCouponApplied
                        }
                        className={invoiceCouponApplied && "green-button"}
                      />
                    </div>
                  </div>
                  <div className="form__row">
                    <div className="form__input">
                      <CustomButtonWithIcon
                        text="Apply Promotion"
                        iconName="Add"
                        onClick={handleSaleApplyPromotion}
                        disabled={
                          saleInvoiceData?.products?.length === 0 ||
                          invoicePromotionApplied
                        }
                        className={invoicePromotionApplied && "green-button"}
                      />
                    </div>
                  </div>
                  {/* <div className="form__row">
                    <div className="form__input">
                      <CustomButtonWithIcon
                        text="Apply Sale Price"
                        iconName="Add"
                        onClick={handleSaleApplySalePrice}
                        disabled={
                          saleInvoiceData?.products?.length === 0 ||
                          invoiceSalePriceApplied
                        }
                        className={invoiceSalePriceApplied && "green-button"}
                      />
                    </div>
                  </div> */}
                  <div className="form__row">
                    <div className="form__input">
                      <CustomButtonWithIcon
                        text="Clear Discount"
                        iconName="Add"
                        onClick={handleClearAllDiscount}
                        disabled={
                          !invoicePromotionApplied &&
                          !invoiceSalePriceApplied &&
                          !invoiceCouponApplied
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
          {/* product */}

          {/* Customer */}
          <section className="customer">
            <div className="form">
              <div className="form__row u_block">
                <div className="form__input autocomplete-margin">
                  <AutoComplete
                    inputProps={{
                      icon: "Search",
                      className: "search-autocomplete",
                      isFloatedLabel: false,
                      boxed: false,
                      kind: "md",
                      inputProps: {
                        placeholder: "Select Customer",
                        onChange: (e) => handleCustomerSearch(e),
                        value: selectedCustomerValue,
                        boxed: true,
                        //onKeyDown: SelectProductOnEnter,
                        onFocus: (event) => {
                          console.log(event);
                          setCustomersShow(
                            customersData.length > 0 ? true : false
                          );
                        },
                      },
                    }}
                    autoCompleteProps={{
                      data: {},
                      isLoading: true,
                      show: customersShow,
                      toggleSearchAll: true,
                      className: "search-autocomplete-popup",
                      onSearchAll: (event) => console.log(event),
                      onSelect: (data) => console.log(data, "data..."),
                      onClearSearch: (event, iconState) => {
                        console.log(event, iconState, "event");
                        setCustomersShow(false);
                        setSelectedCustomerValue("");
                      },
                      onEscPress: () => setCustomersShow(false),
                      onBodyClick: () => setCustomersShow(false),
                    }}
                    children={
                      <div>
                        <Loading
                          strokeColor="#0033B3"
                          strokeWidth={5}
                          size={20}
                          show={customersSearchLoading}
                        />
                        <ul>
                          {customersData &&
                            customersData.map((item) => (
                              <li
                                key={item.id}
                                value={item.id}
                                onClick={() => handleCustomerSelect(item)}
                                className="products-search-list-item"
                              >
                                {item.name}
                              </li>
                            ))}
                        </ul>
                      </div>
                    }
                  />
                </div>
              </div>

              {/*-----------------*/}

              {selectedCutomer ? (
                <div className="form__row u_block">
                  <Customer_Card
                    selectedCutomer={selectedCutomer}
                    handleCustomerDelete={handleCustomerDelete}
                  />
                </div>
              ) : (
                <div className="form__row u_block">
                  <h3>No Customer Selected</h3>
                </div>
              )}

              {/*-----------------*/}

              <div className="form__row u_block">
                {/*<CustomTable />*/}
                <div className="page__table">
                  <SellNestedProductsTable
                    tableData={productsTableData}
                    //tableDataLoading={loading}
                    checkCashier={registerScopeFilter(
                      localStorageData.user_info
                    )}
                    onChangeProductsData={handleChangeProductsData}
                    tableType="register_sell"
                    isReturned={isReturned}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="number"
                    inputProps={{
                      //min: 0,
                      disabled: true,
                      type: "text",
                      value: saleInvoiceData ? saleInvoiceData.sub_total : "",
                    }}
                    label="Subtotal"
                    isFloatedLabel={false}
                  />
                </div>
                <div className="form__input">
                  <Input
                    className="number"
                    inputProps={{
                      type: "number",
                      value: paidAmountValue,
                      onChange: handlePaidChange,
                      disabled:
                        (saleInvoiceData &&
                          saleInvoiceData.method !== "Cash") ||
                        isRetunredInvoice ||
                        invoicePromotionApplied ||
                        invoiceCouponApplied,
                    }}
                    label="Paid"
                    isFloatedLabel={false}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="number"
                    inputProps={{
                      min: 0,
                      type: "number",
                      value: discountInputChangeValue,
                      placeholder: "0",
                      max: 100,
                      onChange: handleDiscountChange,
                      disabled: totalInvoiceDiscount > 0 || isRetunredInvoice,
                    }}
                    label="Discount"
                    isFloatedLabel={false}
                  />
                </div>
                <div className="form__input">
                  <Input
                    className="number"
                    inputProps={{
                      disabled: true,
                      type: "text",
                      value: saleInvoiceData
                        ? (
                            saleInvoiceData.payed -
                            (saleInvoiceData.total -
                              saleInvoiceData.discountAmount)
                          ).toFixed(2)
                        : "",
                    }}
                    label="Change"
                    isFloatedLabel={false}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="number"
                    inputProps={{
                      disabled: true,
                      type: "text",
                      value: saleInvoiceData ? saleInvoiceData.tax : "",
                    }}
                    label="Tax"
                    isFloatedLabel={false}
                  />
                </div>
                <div className="form__input">
                  <Input
                    className="number"
                    inputProps={{
                      disabled: true,
                      type: "text",
                      value: discountAmountToShow,
                    }}
                    label="Discounted Amount"
                    isFloatedLabel={false}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form__input u_space_between">
                  <CustomButtonWithIcon
                    size="small"
                    isPrimary={true}
                    text="MOP"
                    onClick={showMopModal}
                  />

                  <span className="u-text-normal">
                    {saleInvoiceData && saleInvoiceData.method}
                  </span>
                </div>

                <div className="form__input"></div>
              </div>

              {/*------------------------edit column-value--modal---------------------------*/}
              {isMopModalVisible && (
                <Modal
                  //headerText={`Edit Ordered Quantity For ${editProduct.product_name}`}
                  headerButtons={[]}
                  height="150px"
                  onBackdropClick={handleMopModalCancel}
                  onClose={handleMopModalCancel}
                  padding="20px 40px 20px 40px"
                  render={renderMopModalContent}
                  //className=""
                  showCloseButton
                  size="small"
                  width="200px"
                  footerButtons={[
                    {
                      disabled: isLoading,
                      isPrimary: false,
                      onClick: handleMopModalCancel,
                      text: "Cancel",
                    },
                    {
                      disabled: isLoading,
                      isPrimary: true,
                      onClick: handleMopModalCancel,
                      text: "Ok",
                    },
                  ]}
                />
              )}

              <div className="form__row u_block">
                <div className="form__input">
                  <CustomButtonWithIcon
                    size="small"
                    isPrimary={true}
                    text={`Enter Sale Amount(
                      ${
                        saleInvoiceData
                          ? `${(
                              saleInvoiceData.total -
                              saleInvoiceData.discountAmount
                            ).toFixed(2)}`
                          : ""
                      }
                      )`}
                    className="u_width_100"
                    onClick={() => handlePayBill("completed")}
                    disabled={
                      (saleInvoiceData &&
                        saleInvoiceData.products &&
                        saleInvoiceData.products.length < 1) ||
                      !networkStatus
                    }
                  />
                </div>
              </div>
            </div>
          </section>
          {/* Customer */}
        </div>
      </div>

      {/* print sales overview */}
      {saleInvoiceData && saleInvoiceData.products && (
        <PrintSalesInvoiceTable
          user={localStorageData}
          invoice={saleInvoiceData}
          selectedOutletTemplateData={templateData}
          currentInvoiceNo={shortUUID}
          invoiceStatusToCreate={invoiceStatusToCreate}
          totalInvoiceDiscount={totalInvoiceDiscount}
        />
      )}
      {/* print sales overview */}

      {/* Add Web Order Modal */}
      {webOrderModal && (
        <DynamicModal
          className="web-order-modal"
          heading="Add Web Order"
          size="medium"
          isCancelButton={true}
          isConfirmButton={true}
          onCancel={handleAddWebOrder}
          renderModalContent={WebOrder}
          onConfirm={handleSaveWebOrder}
        />
      )}
      {/* Add Web Order Modal */}

      {/* Return Web Order Modal */}
      {returnWebOrderModal && (
        <DynamicModal
          className="web-order-modal"
          heading="Return Web Order"
          size="medium"
          isCancelButton={true}
          isConfirmButton={true}
          confirmButtonText="Accept Return"
          onCancel={handleReturnWebOrder}
          renderModalContent={returnWebOrder}
          onConfirm={handleConfirmReturn}
        />
      )}
      {/* Return Web Order Modal */}
    </>
  );
}

export default Sell;
