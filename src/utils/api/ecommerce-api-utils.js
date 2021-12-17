import UrlConstants from "../constants/url-configs";
import GenericConstants from "../constants/constants";
import * as ApiCallUtil from "./generic-api-utils";
import axios from "axios";
import { getDataFromLocalStorage } from "../local-storage/local-store-utils";
import Constants from "../constants/constants";
import { constructParamsData } from "./generic-api-utils";

export const getAllOmniSales = async (pageLimit, pageNumber, orderFilter) => {
  const formDataPair = {
    limit: pageLimit,
    page: pageNumber,
    filter: orderFilter,
  };

  const omniSalesOrdersFormDataBody =
    ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.ECOMMERCE.GET_ALL_OMNI_SALES;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    omniSalesOrdersFormDataBody //body
  );
};

export const getOeSaleOrderData = async (InvoiceId) => {
  const formDataPair = {
    invoice_id: InvoiceId,
  };

  const getOeSalesOrdersFormDataBody =
    ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.ECOMMERCE.VIEW_OE_ORDER;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    getOeSalesOrdersFormDataBody //body
  );
};

export const getOmniAlInventorySync = async (limit, PageNumber) => {
  const formDataPair = {
    limit: limit,
    page: PageNumber,
  };

  const getOmniAlInventorySyncFormDataBody =
    ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.ECOMMERCE.GET_ALL_INVENTORY_SYNC;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    getOmniAlInventorySyncFormDataBody //body
  );
};

export const getOmniInventoryDump = async () => {
  const url = UrlConstants.ECOMMERCE.GET_INVENTORY_DUMP;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const fetchOeSalesOrders = async (startDate) => {
  const OeSalesOrdersDataBody = {
    date: startDate,
  };

  const url = UrlConstants.ECOMMERCE.GET_OE_SALE_ORDERS;
  const headers = { "Content-Type": "application/json" };
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    OeSalesOrdersDataBody, //body
    headers
  );
};

export const getomniBulkOrdersId = async (InvoiceReferenceIds) => {
  const OmniBulkInvoicesDataBody = {
    references: InvoiceReferenceIds,
  };

  const url = UrlConstants.ECOMMERCE.GET_BULK_OMNI_INVOICES;
  const headers = { "Content-Type": "application/json" };
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    OmniBulkInvoicesDataBody, //body
    headers
  );
};

export const getomniBulkOrdersInnerIds = async (InvoiceReferenceIds) => {
  const OmniBulkInnerInvoicesDataBody = {
    invoices: InvoiceReferenceIds,
  };

  const url = UrlConstants.ECOMMERCE.GET_BULK_OMNI_INNER_INVOICES;
  const headers = { "Content-Type": "application/json" };
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    OmniBulkInnerInvoicesDataBody, //body
    headers
  );
};

export const cancelBulkOeSalesOrders = async (cancelOeSaleOrders) => {
  const OmniCancelBulkInvoicesDataBody = {
    invoices: cancelOeSaleOrders,
  };

  const url = UrlConstants.ECOMMERCE.CANCEL_OE_ORDER;
  const headers = { "Content-Type": "application/json" };
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    OmniCancelBulkInvoicesDataBody, //body
    headers
  );
};

export const searchEcommerceInvoices = async (
  pageLimit,
  pageNumber,
  searchValue,
  tabFilter
) => {
  const formDataPair = {
    limit: pageLimit,
    page: pageNumber,
    query: searchValue,
    filter: tabFilter,
  };

  const SearchOmniSalesOrdersFormDataBody =
    ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.ECOMMERCE.SEARCH_ALL_OMNI_SALES;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    SearchOmniSalesOrdersFormDataBody //body
  );
};

export const getAllOrders = async (apiData) => {
  // httpbin.org gives you the headers in the response
  // body `res.data`.
  // See: https://httpbin.org/#/HTTP_Methods/get_get
  const params = constructParamsData(apiData);
  let readFromLocalStorage = getDataFromLocalStorage(
    Constants.USER_DETAILS_KEY
  );
  readFromLocalStorage = readFromLocalStorage?.data || null;
  const storeId = readFromLocalStorage?.external_code;
  const brandId = readFromLocalStorage?.brand_id;
  const url = UrlConstants.ECOMMERCE.GET_ALL_ORDERS + `?${params}`;
  const authToken = ApiCallUtil.getUserAuthToken();
  // const callType = GenericConstants.API_CALL_TYPE.GET;
  // const headers = {"client-type": 'shopdesk'};
  return await axios.get(url, {
    headers: {
      client_type: "shopdesk",
      Authorization: authToken,
      store_id: storeId,
      brand_id: brandId,
    },
  });

  // return await ApiCallUtil.http(
  //     url, //api url
  //     callType, //calltype
  //     headers
  // );
};

export const getOrderById = async (orderId) => {
  let readFromLocalStorage = getDataFromLocalStorage(
    Constants.USER_DETAILS_KEY
  );
  readFromLocalStorage = readFromLocalStorage?.data || null;
  const storeId = readFromLocalStorage?.auth?.Store_info?.external_code;
  const brandId = readFromLocalStorage?.brand_id;
  const url = UrlConstants.ECOMMERCE.GET_ORDER_BY_ID + `/${orderId}`;
  const headers = {
    Authorization: `${ApiCallUtil.getUserAuthToken()}`,
    client_type: "shopdesk",
    store_id: storeId,
    brand_id: brandId,
  };

  return await axios
    .get(url, {
      headers: headers,
    })
    .then(async (res) => {
      console.log("res", res);
      let responseData = res?.data;
      if (res?.status === 200) {
        //console.log('res -> ', responseData);
        return { hasError: false, ...responseData };
      } else {
        //console.log('Cannot Sync Products -> ', responseData);
        return {
          hasError: true,
          errorMessage: responseData.message,
          ...responseData,
        };
      }
    })
    .catch((err) => {
      console.log("AXIOS ERROR: ", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.data?.message ||
        "Unable to complete the request";
      return { hasError: true, errorMessage: errorMessage };
    });
};

export const updateOrderStatus = async (orderSieId, orderData) => {
  const url = UrlConstants.ECOMMERCE.UPDATE_ORDER_STATUS + `/${orderSieId}`;
  const callType = GenericConstants.API_CALL_TYPE.PUT;
  return await ApiCallUtil.http_order(url, callType, orderData);
};

export const updateWMSOrderStatus = async (orderData) => {
  const url = UrlConstants.ECOMMERCE.WMS_SHIPPED_ORDER;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  return await ApiCallUtil.http(url, callType, orderData);
};

export const getManualReturnOrders = async (orderData) => {
  const formDataBody = ApiCallUtil.constructParamsData(orderData);
  const url = UrlConstants.ECOMMERCE.MANUAL_RETURNS + `?${formDataBody}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;
  return await ApiCallUtil.http_order(url, callType);
};