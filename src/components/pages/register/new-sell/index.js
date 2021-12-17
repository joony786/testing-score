import React, { useState, useEffect } from "react";
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
import {
  calculateInvoiceTotalData,
  addInvoicePayload,
  calculateDiscountValue,
} from "../../../../utils/helpers/invoices";
import Constants from "../../../../utils/constants/constants";
import SwitchOutlet from "../../../atoms/switch_outlet";
import PageTitle from "../../../organism/header";
import SellInvoiceProductsTable from "../../../organism/table/sell/sellInvoiceProductsTable";
import PrintInvoiceTable from "./print-invoice-table";
import Customer_Card from "../../../molecules/customer_card";
import short from "short-uuid";
import DynamicModal from "../../../atoms/modal";
import WebOrders from "./web-orders";
import ReturnWebOrders from "./return-web-orders";
import MopModal from "./mop-modal";

const calenderMaxDate = new Date();
const timeFormat = "HH:mm:ss";
const todayDate = moment().format("yyyy/MM/DD");
let localStorageCacheData = null;

const NewSell = () => {
  const history = useHistory();
  const [invoiceProductsSelected, setInvoiceProductsSelected] = useState([]);
  const [invoiceProductsToMap, setInvoiceProductsToMap] = useState([]);
  const [invoiceProductSearch, setInvoiceProductSearch] = useState("");
  const [invoiceProductDropDown, setInvoiceProductDropDown] = useState(false);
  const [invoiceProductsLoading, setInvoiceProductsLoading] = useState(false);
  const [calenderDate, setCalenderDate] = useState(todayDate);
  const [invoiceNoteValue, setInvoiceNoteValue] = useState("");
  const [selectedTaxCategory, setSelectedTaxCategory] = useState({
    id: 1,
    name: "Simple",
    value: 16,
  });

  const [customerDropDown, setCustomerDropDown] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerDataToMap, setCustomerDataToMap] = useState([]);
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [invoiceTotalData, setInvoiceTotalData] = useState({});
  const [discountInputValue, setDiscountInputValue] = useState(0);
  const [isMopModalVisible, setIsMopModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [printInvoiceData, setPrintInvoiceData] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [isReturnedInvoice, setisReturnedInvoice] = useState(false);
  const [isParkedInvoice, setIsParkedInvoice] = useState(false);

  const [oldInvoiceData, setOldInvoiceData] = useState(null);

  const [invoiceCouponValue, setInvoiceCouponValue] = useState("");
  const [invoiceCouponValueError, setInvoiceCouponValueError] = useState(false);
  const [invoicePromotionApplied, setInvoicePromotionApplied] = useState(false);
  const [invoiceCouponApplied, setInvoiceCouponApplied] = useState(false);

  const [localStorageUserData, setLocalStorageUserData] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [templateData, setTemplateData] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(window.navigator.onLine); //imp
  const [webOrderModal, setWebOrderModal] = useState(false);
  const [totalInvoiceDiscount, setTotalInvoiceDiscount] = useState(0);
  const [orderStatus, setOrderStatus] = useState("completed");
  const [componentMount, setComponentMount] = useState(false);
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
    /*-----------------network status hooks----------------------*/
    window.addEventListener("offline", function (e) {
      setNetworkStatus(false);
    });
    window.addEventListener("online", function (e) {
      setNetworkStatus(true);
    });
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

  const handleChangeInvoiceProducts = (e) => {
    const { value } = e.target;
    setInvoiceProductSearch(value);
    if (value.length > 0) {
      setInvoiceProductDropDown(true);
    }
  };
  const handleChangeInvoiceCouponValue = (e) => {
    setInvoiceCouponValue(e.target.value);
    if (invoiceCouponValueError) {
      setInvoiceCouponValueError(false);
    }
  };
  const handleSearchInvoiceProducts = async (value) => {
    setInvoiceProductsLoading(true);
    const productsSearchResponse = await ProductsApiUtil.searchProducts(
      Helpers.productsSearchPageLimit,
      Helpers.productsSearchPageNumber,
      value
    );
    if (productsSearchResponse.hasError) {
      setInvoiceProductsLoading(false);
      setInvoiceProductsToMap([]);
    } else {
      const products =
        productsSearchResponse?.products?.data ||
        productsSearchResponse?.products;
      setInvoiceProductsToMap(products);
      setInvoiceProductsLoading(false);
    }
  };

  const handleAddInvoiceProduct = (product, newProductsData) => {
    if (invoiceProductsToMap?.length || newProductsData?.length) {
      const findProduct = invoiceProductsSelected.find(
        (pro) => pro.id === product.id
      );
      let updatedProduct = {};
      if (findProduct) {
        const findIndexProduct = invoiceProductsSelected.indexOf(findProduct);
        updatedProduct = {
          ...product,
          selectQty: parseInt(findProduct.selectQty) + 1,
        };
        invoiceProductsSelected.splice(findIndexProduct, 1, updatedProduct);
        let subTotal = 0;
        let totalQty = 0;
        for (const pro of invoiceProductsSelected) {
          subTotal = parseFloat(
            subTotal + pro.selectQty * pro.prices.discount_price
          ).toFixed(2);
          totalQty = totalQty + pro?.selectQty;
        }
        const discountAmount = (discountInputValue * subTotal) / 100;
        const discountPer = discountAmount / totalQty || 0;
        setInvoiceProductsSelected(invoiceProductsSelected);
        setInvoiceTotalData(
          calculateInvoiceTotalData(
            invoiceProductsSelected,
            discountAmount,
            0,
            selectedTaxCategory,
            false,
            false,
            discountPer,
            discountInputValue
          )
        );
      } else {
        updatedProduct = {
          ...product,
          selectQty: 1,
        };
        setInvoiceProductsSelected([
          ...invoiceProductsSelected,
          updatedProduct,
        ]);
        const newProductsData = [...invoiceProductsSelected, updatedProduct];
        let subTotal = 0;
        let totalQty = 0;

        for (const pro of newProductsData) {
          subTotal = parseFloat(
            subTotal + pro.selectQty * pro.prices.discount_price
          ).toFixed(2);
          totalQty = totalQty + pro?.selectQty;
        }
        const discountAmount = (discountInputValue * subTotal) / 100;
        const discountPer = discountAmount / totalQty || 0;
        setInvoiceTotalData(
          calculateInvoiceTotalData(
            [...invoiceProductsSelected, updatedProduct],
            discountAmount,
            0,
            selectedTaxCategory,
            false,
            false,
            discountPer,
            discountInputValue
          )
        );
      }
      if (invoicePromotionApplied || invoiceCouponApplied) {
        handleClearAllDiscount([...invoiceProductsSelected, updatedProduct]);
      }
    }
    setInvoiceProductDropDown(false);
    setInvoiceProductSearch("");
    setInvoiceProductsToMap([]);
    setTrigger(trigger + 1);
  };
  const handleEnterProductSearch = async (e) => {
    if (e.keyCode === 13) {
      setInvoiceProductsLoading(true);
      const productsSearchResponse = await ProductsApiUtil.searchProducts(
        Helpers.productsSearchPageLimit,
        Helpers.productsSearchPageNumber,
        invoiceProductSearch
      );
      if (productsSearchResponse.hasError) {
        console.log(
          "Cant search Customer -> ",
          productsSearchResponse.errorMessage
        );
        setInvoiceProductsLoading(false);
      } else {
        const productData =
          productsSearchResponse?.products?.data[0] ||
          productsSearchResponse?.products;
        handleAddInvoiceProduct(productData, [productData]);
      }
    }
  };
  const onInvoiceDateChange = (value) => {
    let dateString = moment(value).format("yyyy/MM/DD"); //imp keep as it is
    setCalenderDate(moment(value).format("yyyy/MM/DD"));
    let currentTime = moment().format(timeFormat); //current time
  };

  const handleInvoiceNoteChange = (e) => {
    setInvoiceNoteValue(e.target.value);
  };

  const handleTaxCategorySelectChange = (listItem) => {
    setSelectedTaxCategory(listItem);
    setInvoiceTotalData(
      calculateInvoiceTotalData(
        invoiceProductsSelected,
        invoiceTotalData?.discountedAmount,
        0,
        listItem
      )
    );
  };

  const handleCustomerSearch = (e) => {
    const { value } = e.target;
    setCustomerSearch(value);
    if (value.length > 0) {
      searchCustomer(value);
    }
  };

  const searchCustomer = async (searchValue) => {
    setCustomerDropDown(true);
    setCustomerLoading(true);
    const customersSearchResponse = await CustomersApiUtil.searchCustomers(
      Helpers.productsSearchPageLimit,
      Helpers.productsSearchPageNumber,
      searchValue
    );
    if (customersSearchResponse.hasError) {
      console.log(
        "Cant search Customer -> ",
        customersSearchResponse.errorMessage
      );
      setCustomerLoading(false); //imp to hide customers search loading
    } else {
      setCustomerLoading(false); //imp to hide customers search loading
      const customers =
        customersSearchResponse?.Customer?.data ||
        customersSearchResponse?.Customers;
      setCustomerDataToMap(customers);
    }
  };
  const handleCustomerSelect = (cus) => {
    setSelectedCustomerData(cus);
    setCustomerDropDown(false);
    setCustomerDataToMap([]);
    setCustomerSearch("");
  };
  const handleCustomerDelete = () => {
    setSelectedCustomerData(null);
  };
  const handlePaidChange = (e) => {
    setInvoiceTotalData(
      calculateInvoiceTotalData(
        invoiceProductsSelected,
        invoiceTotalData?.discountedAmount,
        e.target.value,
        selectedTaxCategory,
        false,
        false,
        0,
        discountInputValue
      )
    );
  };
  const handleDiscountChange = (e) => {
    const { value } = e.target;
    if (value <= 100 && value >= 0) {
      const discountAmount = (value * invoiceTotalData?.subTotal) / 100;
      let totalQty = 0;
      for (const pro of invoiceProductsSelected) {
        totalQty = totalQty + pro?.selectQty;
      }
      const discountPer = discountAmount / totalQty || 0;
      setDiscountInputValue(value);
      setInvoiceTotalData(
        calculateInvoiceTotalData(
          invoiceProductsSelected,
          discountAmount,
          0,
          selectedTaxCategory,
          false,
          false,
          discountPer,
          discountInputValue
        )
      );
    }
  };
  const showMopModal = () => {
    setIsMopModalVisible(!isMopModalVisible);
  };

  const addInvoiceRequest = async (status) => {
    let updatesProducts = [];
    let parkedTotalData = {};
    const isParked = status === "parked";
    if (status === "parked") {
      for (const pro of invoiceProductsSelected) {
        updatesProducts.push({
          ...pro,
          discount: 0,
          offer_price: 0,
          promotions: [],
        });
      }
      parkedTotalData = calculateInvoiceTotalData(
        updatesProducts,
        0,
        0,
        selectedTaxCategory
      );
      setInvoiceCouponValue("");
      setInvoicePromotionApplied(false);
      setInvoiceCouponApplied(false);
      showAlertUi(true, "Pormotion removed for Sale Parked");
    }
    const invoiceNumber = oldInvoiceData?.show_id || short.generate();
    const payloadToInvoice = addInvoicePayload(
      selectedCustomerData,
      !isParked ? invoiceProductsSelected : updatesProducts,
      !isParked ? invoiceTotalData : parkedTotalData,
      status,
      calenderDate,
      storeLocation,
      paymentMethod,
      invoiceNoteValue,
      invoiceNumber
    );
    payloadToInvoice.discount_percentage = discountInputValue;
    let registerInvoiceResponse;
    if (oldInvoiceData?.status === "0" || oldInvoiceData?.status === "1") {
      if (isReturnedInvoice) {
        payloadToInvoice.invoice_number = `${payloadToInvoice.invoice_number}-${
          parseInt(oldInvoiceData?.return_count || 0) + 1
        }`;
        payloadToInvoice.status = "returned";
      }
      setInvoiceNo(payloadToInvoice.invoice_number);
      registerInvoiceResponse = await SalesApiUtil.updateRegisterInvoice(
        payloadToInvoice,
        oldInvoiceData?.id
      );
    } else {
      setInvoiceNo(payloadToInvoice.invoice_number);
      registerInvoiceResponse = await SalesApiUtil.registerInvoice({
        invoices: [payloadToInvoice],
      });
    }
    setOrderStatus(payloadToInvoice.status);
    if (registerInvoiceResponse.hasError) {
      showAlertUi(true, registerInvoiceResponse.errorMessage);
      return false; //imp message must be exact
    } else {
      return true; //imp message must be exact
    }
  };
  const handleCompleteInvoice = async (status) => {
    if (invoiceProductsSelected.length === 0) {
      showAlertUi(true, "No Products Added");
      return;
    }
    let addInvoiceResponse;
    if (status === "completed" || status === "parked") {
      document.getElementById("app-loader-container").style.display = "block";
      addInvoiceResponse = await addInvoiceRequest(status);
    }
    document.getElementById("app-loader-container").style.display = "none";
    if (addInvoiceResponse) {
      if (status === "completed") {
        const productsToPrint = [];
        for (const pro of invoiceProductsSelected) {
          productsToPrint.push({
            id: pro?.id || "",
            name: pro?.name || "",
            selectQty: pro?.selectQty || 0,
            originalPrice: pro?.prices?.discount_price || 0,
            offer_price: pro?.offer_price || pro?.prices?.discount_price || 0,
          });
        }
        const printInvoiceDataToSet = {
          completeReturn: false,
          subTotal: invoiceTotalData?.subTotal || 0,
          totalTax: invoiceTotalData?.totalTax || 0,
          totalDiscount: invoiceTotalData?.discountedAmount || 0,
          totalAmount: invoiceTotalData?.totalAmount || 0,
          paymentMethod: paymentMethod,
          payed: invoiceTotalData?.paidAmount || 0,
          toPay: invoiceTotalData?.paidAmount - invoiceTotalData?.totalAmount,
          invoice_note: invoiceNoteValue,
          products: productsToPrint,
        };
        setPrintInvoiceData(printInvoiceDataToSet);
        printSalesOverview(); //imp first print then reset fields
      }
      if (status === "parked") {
        closeFunction();
      }
      // resetFiledsOnNewInvoice(); //after print must
    }
  };

  const handleDeadSale = async () => {
    if (invoiceProductsSelected.length === 0) {
      showAlertUi(true, "No Products Added");
      return;
    }
    document.getElementById("app-loader-container").style.display = "block";
    const invoiceNumber = oldInvoiceData?.show_id;
    setInvoiceNo(invoiceNumber);
    const payloadToInvoice = addInvoicePayload(
      selectedCustomerData,
      invoiceProductsSelected,
      invoiceTotalData,
      "parked",
      calenderDate,
      storeLocation,
      paymentMethod,
      invoiceNoteValue,
      invoiceNumber
    );
    payloadToInvoice.discount_percentage = discountInputValue;
    const salesHistoryDeadResponse = await SalesApiUtil.updateRegisterInvoice(
      { ...payloadToInvoice, is_dead: "1" },
      oldInvoiceData?.id
    );
    if (salesHistoryDeadResponse.hasError) {
      console.log(
        "Cant fetch registered products Data -> ",
        salesHistoryDeadResponse.errorMessage
      );
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, salesHistoryDeadResponse.errorMessage);
    } else {
      closeFunction();
      document.getElementById("app-loader-container").style.display = "none";
      history.push({
        pathname: "/register/sales-history",
      });
    }
  };

  const handleSaleApplyPromotion = async () => {
    if (invoiceProductsSelected.length > 0) {
      const payload = promotionPayload(invoiceProductsSelected);
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
        for (const pro of invoiceProductsSelected) {
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
              offer_price: parseFloat(
                pro.prices.discount_price -
                  findDiscount.discount / pro.selectQty
              ).toFixed(2),
              discount: parseFloat(findDiscount.discount).toFixed(2),
              // discounted_amount: findDiscount.discount,
              promotions: discountAppliedData,
            });
          } else {
            updatesProducts.push(pro);
          }
        }
        setInvoicePromotionApplied(true);
        setInvoiceCouponApplied(false);

        setInvoiceProductsSelected(updatesProducts);
        setDiscountInputValue(0);
        setInvoiceTotalData(
          calculateInvoiceTotalData(
            updatesProducts,
            totalDiscount,
            0,
            selectedTaxCategory,
            true
          )
        );
        setTrigger(trigger + 1);
        successAlerUi(true, "Promotion applied successfully");
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const handleSaleApplyCoupon = async () => {
    if (invoiceProductsSelected.length > 0 && invoiceCouponValue) {
      const payload = promotionPayload(invoiceProductsSelected, [
        invoiceCouponValue,
      ]);
      document.getElementById("app-loader-container").style.display = "block";
      const couponRes = await WebOrdersApiUtil.getCouponDiscount(payload);
      if (!couponRes.success || couponRes.hasError) {
        const errorMessage =
          couponRes?.errorMessage?.message ||
          couponRes?.data?.message ||
          couponRes?.errorMessage;
        console.log(errorMessage);
        showAlertUi(true, errorMessage);
        document.getElementById("app-loader-container").style.display = "none";
      } else {
        const discountItems = couponRes?.data || [];
        const updatesProducts = [];
        let totalDiscount = 0;
        for (const pro of invoiceProductsSelected) {
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
              offer_price: parseFloat(
                pro.prices.discount_price -
                  findDiscount.discount / pro.selectQty
              ).toFixed(2),
              discount: parseFloat(findDiscount.discount).toFixed(2),
              // discounted_amount: findDiscount.discount / pro.qty,
              promotions: couponsApplied,
            });
          } else {
            updatesProducts.push(pro);
          }
        }
        setInvoiceProductsSelected(updatesProducts);
        setDiscountInputValue(0);
        setInvoiceTotalData(
          calculateInvoiceTotalData(
            updatesProducts,
            totalDiscount,
            0,
            selectedTaxCategory,
            true
          )
        );
        setTrigger(trigger + 1);
        setInvoiceCouponApplied(true);
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

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const successAlerUi = (show, message) => {
    Helpers.showWarningAppAlertUiContent(show, message);
  };

  const closeFunction = async () => {
    setPrintInvoiceData(null);
    setSelectedCustomerData(null);
    setInvoiceTotalData({});
    setInvoiceProductsSelected([]);
    setPaymentMethod("Cash");
    setDiscountInputValue(0);
    setInvoiceNoteValue("");
    setSelectedTaxCategory({
      id: 1,
      name: "Simple",
      value: 16,
    });
    setTrigger(trigger + 1);
    setInvoiceCouponValue("");
    setInvoicePromotionApplied(false);
    setInvoiceCouponApplied(false);
    setIsParkedInvoice(false);
    setisReturnedInvoice(false);
    setOldInvoiceData(null);
    saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, {});
  };
  const handleClearAllDiscount = async (productArrayUpdated = []) => {
    if (invoiceProductsSelected?.length > 0) {
      const updatesProducts = [];
      if (
        invoiceProductsSelected?.length > (productArrayUpdated?.length || 0)
      ) {
        for (const pro of invoiceProductsSelected) {
          updatesProducts.push({
            ...pro,
            offer_price: 0,
            promotions: [],
          });
        }
        setInvoiceProductsSelected(updatesProducts);
      } else if (productArrayUpdated.length > 0) {
        for (const pro of productArrayUpdated) {
          updatesProducts.push({
            ...pro,
            offer_price: 0,
            promotions: [],
          });
        }
      }
      setInvoiceTotalData(
        calculateInvoiceTotalData(updatesProducts, 0, 0, selectedTaxCategory)
      );
      setInvoiceCouponValue("");
      setInvoicePromotionApplied(false);
      setInvoiceCouponApplied(false);
      return true;
    } else {
      return false;
    }
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
    } else {
      closeFunction();
    }
  };
  const MopModalRender = () => {
    return (
      <MopModal
        selectedCustomerData={selectedCustomerData}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
    );
  };
  const getCustomerData = async (customerId) => {
    const customersSearchResponse = await CustomersApiUtil.getSingleCustomer(
      customerId
    );
    if (!customersSearchResponse.hasError) {
      setSelectedCustomerData(customersSearchResponse?.customer[0]);
    }
  };
  useEffect(() => {
    if (
      history?.location?.selected_invoice_data !== undefined &&
      invoiceProductsSelected?.length === 0
    ) {
      const invoiceData =
        history?.location?.selected_invoice_data?.invoices || {};
      if (invoiceData?.status === "1" && invoiceData?.invoice_products.length) {
        setIsParkedInvoice(true);
        setOrderStatus("parked");
        let totalDis = !invoiceData?.promotion_id
          ? invoiceData?.discounted_amount
          : 0;
        const products = [];
        for (const pro of invoiceData?.invoice_products) {
          products.push({
            selectQty: pro?.original_quantity,
            prices: {
              discount_price: pro?.discount_price,
              sale_price: pro?.sale_price,
            },
            discount: pro?.discount,
            offer_price: parseFloat(
              pro?.discount_price - pro?.discount / pro?.quantity
            ).toFixed(2),
            id: pro.product_id,
            name: pro.name,
            tax_info: {
              tax_value: pro.tax_value,
              tax_amount: pro.tax_amount,
            },
            sku: pro.sku,
            promotions:
              pro?.invoice_item_promotions != 0
                ? pro?.invoice_item_promotions
                : [],
          });
          if (invoiceData?.promotion_id) {
            totalDis =
              totalDis +
              parseFloat(
                (pro?.discount / pro?.original_quantity) * pro?.quantity
              ).toFixed(2);
          }
        }
        setCalenderDate(invoiceData?.date);
        setInvoiceNoteValue(invoiceData?.note || "");
        setInvoiceProductsSelected(products);
        let discountPercent = 0;
        if (!invoiceData?.promotion_id) {
          discountPercent = calculateDiscountValue(
            invoiceData?.discounted_amount,
            invoiceData?.sub_total
          );
          setDiscountInputValue(
            calculateDiscountValue(
              invoiceData?.discounted_amount,
              invoiceData?.sub_total
            )
          );
        }
        setOldInvoiceData(invoiceData);
        getCustomerData(invoiceData?.customer_id);
        setInvoiceTotalData(
          calculateInvoiceTotalData(
            products,
            totalDis,
            0,
            selectedTaxCategory,
            invoiceData?.promotion_id ? true : false,
            true,
            0,
            discountPercent
          )
        );
      }
      if (invoiceData?.status === "0" && invoiceData?.invoice_products.length) {
        const products = [];
        setOrderStatus("returned");
        let totalDis = !invoiceData?.promotion_id
          ? invoiceData?.discounted_amount
          : 0;
        let totalOriginalQty = 0;
        let totalQty = 0;
        let additionalDiscount = 0;
        setisReturnedInvoice(true);
        for (const pro of invoiceData?.invoice_products) {
          const difference = pro?.sale_price - pro?.discount_price;
          additionalDiscount =
            additionalDiscount + difference * pro?.original_quantity;
          const isPromotion = invoiceData?.promotion_id;
          const discountPerItem = parseFloat(
            (pro?.discount - difference) / pro?.original_quantity
          );
          products.push({
            selectQty: -pro?.quantity,
            oldQty: -pro?.quantity,
            prices: {
              discount_price: pro?.discount_price,
              sale_price: pro?.sale_price,
            },
            offer_price: invoiceData?.promotion_id
              ? parseFloat(
                  pro?.discount_price - pro?.discount / pro?.original_quantity
                ).toFixed(2)
              : 0,
            discount_per_item: isPromotion ? discountPerItem : 0,
            discount: isPromotion ? discountPerItem * pro?.quantity : 0,
            id: pro.product_id,
            name: pro.name,
            tax_info: {
              tax_value: pro.tax_value,
              tax_amount: pro.tax_amount,
            },
            sku: pro.sku,
            promotions:
              pro?.invoice_item_promotions != 0
                ? pro?.invoice_item_promotions
                : [],
          });
          totalOriginalQty =
            parseInt(totalOriginalQty) + parseInt(pro?.original_quantity);
          totalQty = parseInt(totalQty) + parseInt(pro?.quantity);
          if (invoiceData?.promotion_id) {
            totalDis =
              totalDis +
              parseFloat(
                (pro?.discount / pro?.original_quantity) * pro?.quantity
              ).toFixed(2);
          }
        }
        setCalenderDate(todayDate);
        setInvoiceNoteValue(invoiceData?.note || "");
        setInvoiceProductsSelected(products);
        let discountPer = 0;
        totalDis = totalDis - additionalDiscount;
        if (!invoiceData?.promotion_id) {
          const calDiscount =
            invoiceData?.discounted_amount - additionalDiscount;
          discountPer = calDiscount / totalOriginalQty;
          totalDis = discountPer * totalQty;
          setDiscountInputValue(
            calculateDiscountValue(
              calDiscount,
              invoiceData?.sub_total - additionalDiscount
            )
          );
        }
        setOldInvoiceData(invoiceData);
        getCustomerData(invoiceData?.customer_id);
        setInvoiceTotalData(
          calculateInvoiceTotalData(
            products,
            totalDis,
            0,
            selectedTaxCategory,
            invoiceData?.promotion_id ? true : false,
            true,
            discountPer,
            discountInputValue
          )
        );
      }
    }
  }, [componentMount]);

  useEffect(() => {
    let delayDebounceFn;
    if (invoiceProductSearch !== "") {
      delayDebounceFn = setTimeout(() => {
        handleSearchInvoiceProducts(invoiceProductSearch);
      }, 500);
    }
    return () => clearTimeout(delayDebounceFn);
  }, [invoiceProductSearch]);

  const [selectedWebOrderCustomerData, setSelectedWebOrderCustomerData] =
    useState({});
  const [selectedAddressData, setSelectedAddressData] = useState({});
  const [selectedShippingData, setSelectedShippingData] = useState({});
  const [selectedProductsData, setSelectedProductsData] = useState([]);
  const [totalData, setTotalData] = useState({});
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentWebOrderMethod, setPaymentWebOrderMethod] =
    useState("Credit Card");
  const [promotionApplied, setPromotionApplied] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  const [returnWebOrderModal, setReturnWebOrderModal] = useState(false);
  const [returnWebOrderData, setReturnWebOrderData] = useState({});
  const [showManualReturnButton, setShowManualReturnButton] = useState(false);

  const handleSaveWebOrder = async () => {
    if (
      selectedShippingData &&
      selectedAddressData &&
      selectedWebOrderCustomerData &&
      selectedProductsData.length > 0 &&
      totalData
    ) {
      setIsLoading(true);
      document.getElementById("app-loader-container").style.display = "block";
      const dataToSave = createPayloadToSave(
        selectedWebOrderCustomerData,
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
            id: pro?.id || "",
            name: pro?.name || "",
            selectQty: pro?.selectQty || 0,
            originalPrice: pro?.prices?.discount_price || 0,
            offer_price: pro?.offer_price || pro?.prices?.discount_price || 0,
            // product_sale_price:
            //   pro.prices.discount_price - pro.discounted_amount / pro.selectQty,
          });
        }
        const webOrderData = {
          completeReturn: false,
          subTotal: totalData?.subTotal || 0,
          totalTax: totalData?.totalTax || 0,
          totalDiscount: totalData?.discountedAmount || 0,
          totalAmount: totalData?.totalAmount || 0,
          paymentMethod: paymentMethod,
          payed: totalData?.paid || 0,
          toPay: totalData?.paid - totalData?.totalAmount,
          products: productsData,
        };
        setInvoiceNo(createWebOrderRes.data.orderCreated[0].orderId);
        setPrintInvoiceData(webOrderData);
        setWebOrderModal(false);
        printSalesOverview();
        document.getElementById("app-loader-container").style.display = "none";
        setSelectedWebOrderCustomerData({});
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
    setSelectedWebOrderCustomerData({});
    setSelectedAddressData({});
    setSelectedShippingData({});
    setSelectedProductsData([]);
    setPromotionApplied(false);
    // setRe
    setTotalData({});
  };

  const clearAll = () => {
    console.log("inside clear all");
    setSelectedWebOrderCustomerData({});
    setSelectedAddressData({});
    setSelectedShippingData({});
    setSelectedProductsData([]);
    setPromotionApplied(false);
    setTotalData("");
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
            totalDiscount += findDiscount.discount;
            updatesProducts.push({
              ...pro,
              discounted_amount: parseFloat(findDiscount.discount).toFixed(2),
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
            totalDiscount += findDiscount.discount;
            updatesProducts.push({
              ...pro,
              discounted_amount: parseFloat(findDiscount.discount).toFixed(2),
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
        if (promotionApplied) {
          setPromotionApplied(false);
        }
        if (couponApplied) {
          setCouponApplied(false);
        }
        setTotalInvoiceDiscount(0);
        setTotalData(calculateTotalData(updatesProducts, 0));
        setSelectedProductsData(updatesProducts);
      }
    }
  };
  const errorMessageWebOrder = (errorMessage) => {
    console.log("Cant Add Address -> ", errorMessage);
    document.getElementById("app-loader-container").style.display = "none";
    // showAlertUi(true, errorMessage);
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
        selectedCustomerData={selectedWebOrderCustomerData}
        setSelectedCustomerData={setSelectedWebOrderCustomerData}
        setSelectedAddressData={setSelectedAddressData}
        selectedShippingData={selectedShippingData}
        setSelectedShippingData={setSelectedShippingData}
        setSelectedProductsData={setSelectedProductsData}
        selectedProductsData={selectedProductsData}
        paymentMethod={paymentWebOrderMethod}
        handleApplyPromotion={handleApplyPromotion}
        handleApplyCoupon={handleApplyCoupon}
        couponApplied={couponApplied}
        promotionApplied={promotionApplied}
        handleClearWebOrderAllDiscount={handleClearWebOrderAllDiscount}
        clearAll={clearAll}
      />
    );
  };
  // const isReturned = isRetunredInvoice ? "-" : "";
  const handleReturnWebOrder = () => {
    setReturnWebOrderModal(!returnWebOrderModal);
    handleClearWebOrderAllDiscount();
  };
  const handleConfirmReturn = async () => {
    if (returnWebOrderData?.orderId) {
      document.getElementById("app-loader-container").style.display = "block";
      console.log("returnWebOrderData", returnWebOrderData);
      if (!returnWebOrderData?.deliveryNumber) {
        return errorMessageWebOrder(
          "Order cannot be returned as it is not dilevered yet!"
        );
      }
      const productsData = [];
      for (const pro of selectedProductsData) {
        productsData.push({
          sku: pro?.sku,
          quantity: pro?.selectQty.toString(),
        })
      }
      const dataToReturn = {
        orderNumber: returnWebOrderData.orderId,
        deliveryNumber: returnWebOrderData?.deliveryNumber,
        returnCode: "3000",
        returnMessage: "Customer found better price elsewhere",
        location: "WH/Output",
        lineItems: productsData,
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
            id: pro?.id || "",
            name: pro?.name || "",
            selectQty: pro?.selectQty || 0,
            originalPrice: pro?.prices?.discount_price || 0,
            // offer_price: pro?.offer_price || pro?.prices?.discount_price || 0,
            offer_price: parseFloat(
              pro.prices.discount_price + pro.discounted_amount / pro.selectQty
            ).toFixed(2),
          });
        }
        const webOrderData = {
          completeReturn: false,
          subTotal: totalData?.subTotal || 0,
          totalTax: totalData?.totalTax || 0,
          totalDiscount: totalData?.discountedAmount || 0,
          totalAmount: totalData?.totalAmount || 0,
          paymentMethod: paymentMethod,
          payed: totalData?.paid || 0,
          toPay: totalData?.paid - totalData?.totalAmount,
          products: productsData,
        };
        setInvoiceNo(returnWebOrderRes.orderId);
        setPrintInvoiceData(webOrderData);
        document.getElementById("app-loader-container").style.display = "none";
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

  const handleManualReturn = async (orderId) => {
    if (orderId) {
      document.getElementById("app-loader-container").style.display = "block";
      const dataToReturn = {
        orderId: orderId,
        isSync: false,
      };
      const returnWebOrderRes = await WebOrdersApiUtil.manualReturnWebOrder(
        dataToReturn
      );
      if (returnWebOrderRes.hasError) {
        const errorMessage =
          returnWebOrderRes?.errorMessage || returnWebOrderRes?.data?.message;
        console.log("Cant Return Web Order-> ", errorMessage);
        document.getElementById("app-loader-container").style.display = "none";
        errorMessageWebOrder(errorMessage);
        setShowManualReturnButton(true);
      } else {
        document.getElementById("app-loader-container").style.display = "none";
        setReturnWebOrderModal(false);
        setShowManualReturnButton(false);
        setSelectedProductsData([]);
        setReturnWebOrderData({});
        setTotalData({});
        successAlerUi(true, "Web Order return successfully.");
      }
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
        setShowManualReturnButton={setShowManualReturnButton}
        showManualReturnButton={showManualReturnButton}
        handleManualReturn={handleManualReturn}
      />
    );
  };

  useEffect(() => {
    if (componentMount) {
      const localStorageData = {
        selectedCustomerData,
        invoiceProductsSelected,
        invoiceTotalData,
        status: orderStatus,
        calenderDate,
        storeLocation,
        paymentMethod,
        invoiceNoteValue,
        invoicePromotionApplied: invoicePromotionApplied,
        invoiceCouponApplied: invoiceCouponApplied,
        isParkedInvoice: isParkedInvoice,
        isReturnedInvoice: isReturnedInvoice,
      };
      saveDataIntoLocalStorage(
        Constants.SELL_CURRENT_INVOICE_KEY,
        localStorageData
      );
    }
  }, [
    componentMount,
    trigger,
    invoiceProductsSelected,
    invoiceTotalData,
    selectedCustomerData,
    calenderDate,
    storeLocation,
    orderStatus,
    paymentMethod,
    invoiceNoteValue,
    invoiceCouponApplied,
    invoicePromotionApplied,
    isReturnedInvoice,
    isParkedInvoice,
  ]);

  useEffect(() => {
    let invoiceCacheData = getDataFromLocalStorage(
      Constants.SELL_CURRENT_INVOICE_KEY
    );
    const invoiceData = invoiceCacheData?.data;
    setComponentMount(true);
    setisReturnedInvoice(invoiceData?.isReturnedInvoice || false);
    setIsParkedInvoice(invoiceData?.isParkedInvoice || false);
    setInvoicePromotionApplied(invoiceData?.invoicePromotionApplied || false);
    setInvoiceCouponApplied(invoiceData?.invoiceCouponApplied || false);
    setInvoiceTotalData(invoiceData?.invoiceTotalData || {});
    setCalenderDate(invoiceData?.calenderDate || todayDate);
    setSelectedCustomerData(invoiceData?.selectedCustomerData || null);
    setStoreLocation(invoiceData?.storeLocation || "");
    setOrderStatus(invoiceData?.orderStatus || "completed");
    setInvoiceNoteValue(invoiceData?.invoiceNoteValue || "");
    setInvoiceProductsSelected(invoiceData?.invoiceProductsSelected || []);
    setPaymentMethod(invoiceData?.paymentMethod || "Cash");
  }, []);
  const returnValue = () => {
    let data = invoiceTotalData?.discountedAmount;
    console.log(data, "data");
    if (data) {
      return invoiceTotalData?.discountedAmount % 1 !== 0
        ? parseFloat(invoiceTotalData?.discountedAmount).toFixed(2)
        : invoiceTotalData?.discountedAmount;
    } else return 0;
  };
  return (
    <>
      <div className="page sell">
        <div className="page__top">
          <SwitchOutlet />
        </div>

        <PageTitle title="Sell" />

        <div className="page__buttons">
          {!isReturnedInvoice && (
            <CustomButtonWithIcon
              text="Park Sale"
              iconName="Add"
              disabled={invoiceProductsSelected?.length === 0}
              onClick={() => handleCompleteInvoice("parked")}
            />
          )}
          <CustomButtonWithIcon
            text="Clear Sale"
            iconName="Add"
            onClick={closeFunction}
          />
          {isParkedInvoice && (
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
                        disabled: isReturnedInvoice,
                        // ref: inputRef,
                        placeholder: "Select Product",
                        onChange: (e) => handleChangeInvoiceProducts(e),
                        onKeyDown: (e) => handleEnterProductSearch(e),
                        value: invoiceProductSearch,
                        boxed: true,
                        //onKeyDown: SelectProductOnEnter,   //no need now
                        onFocus: (event) => {
                          console.log(event);
                          setInvoiceProductDropDown(
                            invoiceProductsToMap.length > 0 ? true : false
                          );
                        },
                      },
                    }}
                    autoCompleteProps={{
                      data: {},
                      isLoading: false,
                      show: invoiceProductDropDown,
                      toggleSearchAll: true,
                      className: "search-autocomplete-popup",
                      onSearchAll: (event) => console.log(event),
                      onSelect: (data) => console.log(data, "data..."),
                      onClearSearch: (event, iconState) => {
                        console.log(event, iconState, "event");
                        setInvoiceProductSearch("");
                        setInvoiceProductsToMap([]);
                        setInvoiceProductDropDown(false);
                      },
                      onEscPress: () => setInvoiceProductDropDown(false),
                      onBodyClick: () => setInvoiceProductDropDown(false),
                    }}
                    children={
                      <div>
                        <Loading
                          strokeColor="#0033B3"
                          strokeWidth={5}
                          size={20}
                          show={invoiceProductsLoading}
                        />
                        <ul>
                          {invoiceProductsToMap &&
                            invoiceProductsToMap.map((pro) => (
                              <li
                                key={pro.id}
                                onClick={() => handleAddInvoiceProduct(pro)}
                                className="products-search-list-item"
                              >
                                {pro.name} {pro?.sku ? `/ ${pro?.sku}` : ""}
                              </li>
                            ))}
                          {invoiceProductsToMap?.length == 0 &&
                            !invoiceProductsLoading && (
                              <h3>No Products Found</h3>
                            )}
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
                    maxDate={calenderMaxDate}
                    popperPlacement="bottom-start"
                    onDateChange={onInvoiceDateChange}
                    customInput={({ value }) => {
                      return (
                        <Input
                          isFloatedLabel={false}
                          label="Date"
                          inputProps={{
                            value: calenderDate,
                            disabled: isReturnedInvoice,
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

              {/* <div className="form__row">
                <div className="form__input">
                  <Dropdown
                    onSelect={handleTaxCategorySelectChange}
                    options={[
                      {
                        id: 1,
                        name: "Simple",
                        value: 16,
                      },
                      {
                        id: 2,
                        name: "FBS",
                        value: 5,
                      },
                    ]}
                    titleLabel="Tax Category"
                    value={selectedTaxCategory}
                    width="100%"
                  />
                </div>
              </div> */}

              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="primary"
                    inputProps={{
                      disabled: isReturnedInvoice,
                      value: invoiceNoteValue,
                      onChange: handleInvoiceNoteChange,
                    }}
                    label="Invoice Note"
                  />
                </div>
              </div>
              {!isReturnedInvoice && (
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
                          (invoiceProductsSelected?.length === 0 &&
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
                          invoiceProductsSelected?.length === 0 ||
                          invoicePromotionApplied
                        }
                        className={invoicePromotionApplied && "green-button"}
                      />
                    </div>
                  </div>
                  <div className="form__row">
                    <div className="form__input">
                      <CustomButtonWithIcon
                        text="Clear Discount"
                        iconName="Add"
                        onClick={handleClearAllDiscount}
                        disabled={
                          !invoicePromotionApplied && !invoiceCouponApplied
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

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
                        disabled: isReturnedInvoice,
                        placeholder: "Select Customer",
                        onChange: (e) => handleCustomerSearch(e),
                        value: customerSearch,
                        boxed: true,
                        //onKeyDown: SelectProductOnEnter,
                        onFocus: (event) => {
                          console.log(event);
                          setCustomerDropDown(
                            customerDataToMap.length > 0 ? true : false
                          );
                        },
                      },
                    }}
                    autoCompleteProps={{
                      data: {},
                      isLoading: true,
                      show: customerDropDown,
                      toggleSearchAll: true,
                      className: "search-autocomplete-popup",
                      onSearchAll: (event) => console.log(event),
                      onSelect: (data) => console.log(data, "data..."),
                      onClearSearch: (event, iconState) => {
                        console.log(event, iconState, "event");
                        setCustomerDropDown(false);
                        setCustomerSearch("");
                        setCustomerDataToMap([]);
                      },
                      onEscPress: () => setCustomerDropDown(false),
                      onBodyClick: () => setCustomerDropDown(false),
                    }}
                    children={
                      <div>
                        <Loading
                          strokeColor="#0033B3"
                          strokeWidth={5}
                          size={20}
                          show={customerLoading}
                        />
                        <ul>
                          {customerDataToMap &&
                            customerDataToMap.map((cus) => (
                              <li
                                key={cus.id}
                                onClick={() => handleCustomerSelect(cus)}
                                className="products-search-list-item"
                              >
                                {cus.name}
                              </li>
                            ))}
                        </ul>
                      </div>
                    }
                  />
                </div>
              </div>

              {/*-----------------*/}

              {selectedCustomerData ? (
                <div className="form__row u_block">
                  <Customer_Card
                    isReturnedInvoice={isReturnedInvoice}
                    selectedCutomer={selectedCustomerData}
                    handleCustomerDelete={handleCustomerDelete}
                  />
                </div>
              ) : (
                <div className="form__row u_block">
                  <h3>No Customer Selected</h3>
                </div>
              )}

              <div className="form__row u_block page__table">
                <SellInvoiceProductsTable
                  tableData={invoiceProductsSelected}
                  setInvoiceProductsSelected={setInvoiceProductsSelected}
                  // onChangeProductsData={handleChangeProductsData}
                  isReturned={isReturnedInvoice}
                  trigger={trigger}
                  invoiceTotalData={invoiceTotalData}
                  selectedTaxCategory={selectedTaxCategory}
                  setInvoiceTotalData={setInvoiceTotalData}
                  handleClearAllDiscount={handleClearAllDiscount}
                  discountInputValue={discountInputValue}
                  setDiscountInputValue={setDiscountInputValue}
                  isPromotion={
                    invoicePromotionApplied ||
                    invoiceCouponApplied ||
                    oldInvoiceData?.promotion_id
                  }
                />
              </div>

              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="number"
                    inputProps={{
                      //min: 0,
                      disabled: true,
                      type: "text",
                      value: invoiceTotalData?.subTotal || 0,
                    }}
                    label="Subtotal"
                    isFloatedLabel={false}
                  />
                </div>
                <div className="form__input">
                  <Input
                    className="number"
                    inputProps={{
                      min: 0,
                      type: "number",
                      value: invoiceTotalData?.paidAmount || 0,
                      onChange: handlePaidChange,
                      disabled:
                        invoiceProductsSelected?.length === 0 ||
                        paymentMethod !== "Cash" ||
                        isReturnedInvoice ||
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
                      value: discountInputValue,
                      placeholder: "0",
                      max: 100,
                      onChange: handleDiscountChange,
                      disabled:
                        invoiceProductsSelected?.length === 0 ||
                        invoicePromotionApplied ||
                        invoiceCouponApplied ||
                        isReturnedInvoice,
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
                      value: invoiceTotalData?.change || 0,
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
                      value: invoiceTotalData?.totalTax || 0,
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
                      value: returnValue(),
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
                    disabled={isReturnedInvoice}
                    onClick={
                      !isReturnedInvoice
                        ? showMopModal
                        : function noRefCheck() {}
                    }
                  />
                  <span className="u-text-normal">{paymentMethod}</span>
                </div>

                <div className="form__input"></div>
              </div>

              <div className="form__row u_block">
                <div className="form__input">
                  <CustomButtonWithIcon
                    size="small"
                    isPrimary={true}
                    text={`Enter Sale Amount(
                      ${invoiceTotalData?.totalAmount || 0}
                      )`}
                    className="u_width_100"
                    onClick={() => handleCompleteInvoice("completed")}
                    disabled={invoiceProductsSelected?.length === 0}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
        {isMopModalVisible && (
          <DynamicModal
            className="web-order-modal"
            heading="Select Payment Method"
            size="small"
            isCancelButton={true}
            isConfirmButton={true}
            onCancel={showMopModal}
            renderModalContent={MopModalRender}
            onConfirm={showMopModal}
          />
        )}

        {printInvoiceData && (
          <PrintInvoiceTable
            templateData={templateData}
            user={localStorageUserData}
            invoiceData={printInvoiceData}
            invoiceNo={invoiceNo}
          />
        )}
      </div>

      {/* Add Web Order Modal */}
      {webOrderModal && (
        <DynamicModal
          className="web-order-modal"
          heading="Add Web Order"
          isCancelButton={true}
          isConfirmButton={true}
          onCancel={handleAddWebOrder}
          renderModalContent={WebOrder}
          onConfirm={handleSaveWebOrder}
          size="medium"
          // isCustomSize={true}
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
};

export default NewSell;
